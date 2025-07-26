import OpenAI from "openai";
import { IIA } from "../../interfaces/i-ia";
import { config } from "../../../config";
import { IUserModel } from "../../interfaces/i-user-model";
import {
  ConsultingPublicationStatus,
  getOrchestrator,
  ILinkedInModel,
  IPublicationModel,
  LinkedInCopy,
  LinkedInModel,
  PublicationModel,
  UserModel,
} from "../..";
import { getPublisher } from "./publisher-config";
import { APIPromise } from "openai/core";
import { Publication } from "../../../schemas";
import { getComunity } from "./comunity-config";
import { getDefaultAgentConfig } from "./default-agent-config";

type AssistantType = "PUBLISHER" | "ANALYZER" | "COMMUNITY" | "DEFAULT_AGENT";

type AsyncChatCompletion = APIPromise<OpenAI.Chat.Completions.ChatCompletion>;
type ChatCompletion = OpenAI.Chat.Completions.ChatCompletion;

interface ProcessingContext {
  userPrompt: string;
  userId: string;
  botType: AssistantType;
  publication?: Publication | undefined;
}

interface PublicationHandlerParams {
  response: string;
  userId: string;
  prompt: string;
}

interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

const ERROR_MESSAGES = {
  PUBLICATION_CHECK_FAILED: "Failed to check new publication status",
  ANALYSIS_FAILED: "Failed to analyze the prompt",
  USER_NOT_FOUND: "User not found, please try again later.",
  LINKEDIN_PUBLISH_FAILED: "Failed to publish on LinkedIn, please try again later.",
  SERVICE_UNAVAILABLE: "Service unavailable, please try again later",
  PARSING_ERROR: "Lo siento, no pude entender tu solicitud. Por favor, intenta de nuevo.",
  NOT_IMPLEMENTED: "NO IMPLEMENTADO",
} as const;

const SUCCESS_MESSAGES = {
  LINKEDIN_PUBLISHED: "Publicación completada exitosamente en LinkedIn.",
} as const;

export class IAModel implements IIA {
  private readonly openai: OpenAI;
  private readonly userModel: IUserModel;
  private readonly publicationModel: IPublicationModel;
  private readonly linkedinModel: ILinkedInModel;

  constructor() {
    this.openai = new OpenAI({ apiKey: config.openai.apiKey });
    this.userModel = new UserModel();
    this.publicationModel = new PublicationModel();
    this.linkedinModel = new LinkedInModel();
  }

  async getResponse(userPrompt: string, userPhoneNumber: string): Promise<string> {
    try {
      const publicationStatus = await this.checkPublicationStatus(userPhoneNumber);
      if (!publicationStatus.success) return ERROR_MESSAGES.PUBLICATION_CHECK_FAILED;

      const { isNew, userId, publication } = publicationStatus.data as ConsultingPublicationStatus;
      const botType: AssistantType = isNew ? "ANALYZER" : "COMMUNITY";

      const context: ProcessingContext = {
        userPrompt,
        userId,
        botType,
        publication,
      };

      return await this.processWithContext(context);
    } catch (error) {
      console.error("Error in getResponse:", error);
      return ERROR_MESSAGES.ANALYSIS_FAILED;
    }
  }

  private async checkPublicationStatus(userPhoneNumber: string): Promise<ServiceResult<ConsultingPublicationStatus>> {
    try {
      return await this.publicationModel.isNewPublication(userPhoneNumber);
    } catch (error) {
      console.error("Error checking publication status:", error);
      return { success: false, error: "Publication status check failed" };
    }
  }

  private async processWithContext(context: ProcessingContext): Promise<string> {
    const iaBot = this.createAssistantBot(context.botType, context.userPrompt);
    return await this.executeProcessing(iaBot, context);
  }

  private createAssistantBot(assistantType: AssistantType, userPrompt: string): AsyncChatCompletion {
    const botFactories: Record<AssistantType, () => AsyncChatCompletion> = {
      ANALYZER: () => getOrchestrator({ openai: this.openai, userPrompt }),
      PUBLISHER: () => getPublisher({ openai: this.openai, userPrompt }),
      COMMUNITY: () => getComunity({ openai: this.openai, copyProposal: userPrompt }),
      DEFAULT_AGENT: () => getDefaultAgentConfig({ openai: this.openai, userPrompt }),
    };

    const factory = botFactories[assistantType];
    if (!factory) {
      console.warn(`Unknown assistant type: ${assistantType}, defaulting to ANALYZER`);
      return getOrchestrator({
        openai: this.openai,
        userPrompt: "Analyze the following message to determine if it should be published or not.",
      });
    }

    return factory();
  }

  private async executeProcessing(iaBot: AsyncChatCompletion, context: ProcessingContext): Promise<string> {
    try {
      const botResponse = await iaBot;

      if (context.botType === "COMMUNITY") {
        const parsedResponse = this.parseResponse(botResponse);
        switch (parsedResponse) {
          case "PUBLICAR":
            if (context.publication) {
              return await this.handleCommunityPublication(context.userId, context.publication);
            } else {
              return "No hay publicación para manejar.";
            }

          case "NO_PUBLICAR":
            this.discardPublication(context.publication?.id);
            return "Entendido, no se publicará la propuesta.";

          case "MODIFICAR":
            return this.modifyPublication(context);

          default:
            return "Por favor, toma una decisión sobre el copy propuesto antes de ejecutar cualquier otra acción.";
        }
      }

      const toolCallResult = this.extractToolCall(botResponse, "handlePublication");
      if (toolCallResult) {
        return await this.handlePublication({
          response: toolCallResult.response,
          userId: context.userId,
          prompt: context.userPrompt,
        });
      }

      return this.parseResponse(botResponse);
    } catch (error) {
      console.error("Error in executeProcessing:", error);
      return ERROR_MESSAGES.ANALYSIS_FAILED;
    }
  }

  private async handleCommunityPublication(userId: string, publication: Publication): Promise<string> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        console.error("User not found for ID:", userId);
        return ERROR_MESSAGES.USER_NOT_FOUND;
      }

      const linkedinCopy: LinkedInCopy = {
        userPhone: user.phone,
        text: publication.proposedCopy ?? "Mandarina",
      };

      const publishResult = await this.linkedinModel.publicCopy(linkedinCopy);
      if (!publishResult.success) {
        console.error("Error publishing on LinkedIn:", publishResult.error);
        return ERROR_MESSAGES.LINKEDIN_PUBLISH_FAILED;
      }

      console.log("Publication successful on LinkedIn:", publishResult.data);

      await this.publicationModel.publishPublication(publication.id);

      return SUCCESS_MESSAGES.LINKEDIN_PUBLISHED;
    } catch (error) {
      console.error("Error in handleCommunityPublication:", error);
      return ERROR_MESSAGES.LINKEDIN_PUBLISH_FAILED;
    }
  }

  private extractToolCall(botResponse: ChatCompletion, toolName: string) {
    try {
      const toolCall = botResponse.choices[0]?.message?.tool_calls?.find(
        (call: any) => call.function?.name === toolName
      );

      if (!toolCall) return null;

      const args = JSON.parse(toolCall.function.arguments);
      return { response: args.response };
    } catch (error) {
      console.error("Error extracting tool call:", error);
      return null;
    }
  }

  private async handlePublication(params: PublicationHandlerParams): Promise<string> {
    const { response, userId, prompt } = params;

    if (response !== "PUBLICAR") {
      const defaultBot = this.createAssistantBot("DEFAULT_AGENT", prompt);
      const defaultResponse = await defaultBot;
      const parsedResponse = this.parseResponse(defaultResponse);
      return parsedResponse || ERROR_MESSAGES.PARSING_ERROR;
    }

    try {
      const publicationResult = await this.publicationModel.startNewPublication(prompt, userId);
      if (!publicationResult.success) return ERROR_MESSAGES.SERVICE_UNAVAILABLE;

      const publisherBot = this.createAssistantBot("PUBLISHER", prompt);
      const publisherResponse = await this.executePublisherFlow(publisherBot, userId);

      const publication = publicationResult.data as Publication;
      const { proposedCopy } = publisherResponse;

      await this.publicationModel.updatePublication(publication.id, proposedCopy);

      return this.formatPublisherResponse(publisherResponse);
    } catch (error) {
      console.error("Error in handlePublication:", error);
      return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    }
  }

  private async discardPublication(publicationId: string | undefined): Promise<void> {
    try {
      if (!publicationId) {
        console.log("No publication ID provided for discarding.");
        return;
      }
      await this.publicationModel.cancelPublication(publicationId);
    } catch (error) {
      console.error("Error discarding publication:", error);
      throw new Error("Failed to discard publication");
    }
  }

  private async modifyPublication(publicationContext: ProcessingContext): Promise<string> {
    try {
      const { publication: publicationToUpdate, userId, userPrompt } = publicationContext;
      if (!publicationToUpdate) throw new Error("No publication to update.");

      const { id, proposedCopy: currentProposedCopy } = publicationToUpdate;

      const prompt = `${currentProposedCopy ?? ""}\n\n${userPrompt}`;
      const publisherBot = this.createAssistantBot("PUBLISHER", prompt);
      const publisherResponse = await this.executePublisherFlow(publisherBot, userId);

      const { proposedCopy } = publisherResponse;
      await this.publicationModel.updatePublication(id, proposedCopy);

      return this.formatPublisherResponse(publisherResponse);
    } catch (error) {
      console.error("Error modifying publication:", error);
      return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
    }
  }

  // private async handleRandomPrompts(): Promise<string> {

  // }

  private async executePublisherFlow(publisherBot: AsyncChatCompletion, userId: string) {
    const botResponse = await publisherBot;
    const rawResponse = this.parseResponse(botResponse);

    try {
      return JSON.parse(rawResponse);
    } catch (error) {
      console.error("Error parsing publisher response:", error);
      throw new Error("Invalid publisher response format");
    }
  }

  private formatPublisherResponse(publisherResponse: any): string {
    const { question, proposedCopy } = publisherResponse;
    return `${question}\n\n${proposedCopy}`;
  }

  private parseResponse(rawResponse: ChatCompletion): string {
    const response = rawResponse.choices[0]?.message?.content;

    if (!response) {
      console.warn("Empty response from OpenAI");
      return ERROR_MESSAGES.PARSING_ERROR;
    }

    return response.trim();
  }
}
