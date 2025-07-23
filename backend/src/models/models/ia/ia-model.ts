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

type Assistants = "PUBLISHER" | "ANALYZER" | "COMMUNITY";

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
      const checkNewPublicationResult = await this.publicationModel.isNewPublication(userPhoneNumber);

      if (!checkNewPublicationResult.success) return "Failed to check new publication status";

      const { isNew, userId, publication } = checkNewPublicationResult.data as ConsultingPublicationStatus;

      const iaBot = this.getIaBot(isNew ? "ANALYZER" : "COMMUNITY", userPrompt);
      return await this.startProcessing(userPrompt, iaBot, userId, isNew ? "ANALYZER" : "COMMUNITY", publication);
    } catch (error) {
      console.error("Error in getResponse:", error);
      throw new Error("Failed to analyze the prompt");
    }
  }

  private getIaBot(assistant: Assistants, userPrompt: string): APIPromise<OpenAI.Chat.Completions.ChatCompletion> {
    let iaBot: APIPromise<OpenAI.Chat.Completions.ChatCompletion>;

    switch (assistant) {
      case "ANALYZER":
        iaBot = getOrchestrator({
          openai: this.openai,
          userPrompt: userPrompt,
        });
        break;
      case "PUBLISHER":
        iaBot = getPublisher({
          openai: this.openai,
          userPrompt: userPrompt,
        });
        break;
      case "COMMUNITY":
        iaBot = getComunity({
          openai: this.openai,
          copyProposal: userPrompt,
        });
        break;
      default:
        iaBot = getOrchestrator({
          openai: this.openai,
          userPrompt: "Analyze the following message to determine if it should be published or not.",
        });
    }

    return iaBot;
  }

  async startProcessing(
    userPrompt: string,
    iaBot: APIPromise<OpenAI.Chat.Completions.ChatCompletion>,
    userId: string,
    botInUse: Assistants,
    publication?: Publication
  ): Promise<string> {
    const botResponse = await iaBot;

    const toolCall = botResponse.choices[0]?.message?.tool_calls?.find(
      (call: any) => call.function?.name === "handlePublication"
    );

    const res = botResponse.choices[0]?.message?.content ?? "";
    if (botInUse === "COMMUNITY" && res == "PUBLICAR" && publication) {
      const user = await this.userModel.findById(userId);
      if (!user) {
        console.error("User not found for ID:", userId);
        return "User not found, please try again later.";
      }

      const linkedinCopy: LinkedInCopy = {
        userPhone: user.phone,
        text: publication?.content ?? "Mandarina",
      };

      const result = await this.linkedinModel.publicCopy(linkedinCopy);
      if (!result.success) {
        console.error("Error publishing on LinkedIn:", result.error);
        return "Failed to publish on LinkedIn, please try again later.";
      }
      console.log("Publication successful on LinkedIn:", result.data);

      this.publicationModel.publishPublication(publication.id);

      return "Publicacion completada exitosamente en LinkedIn.";
    }

    if (toolCall) {
      const args = JSON.parse(toolCall.function.arguments);
      const response = args.response;
      return await this.handlePublication({ response: response, userId, prompt: userPrompt });
    }

    return botResponse.choices[0]?.message?.content || "";
  }

  private async handlePublication(params: { response: string; userId: string; prompt: string }): Promise<string> {
    const { response, userId, prompt } = params;
    if (response === "PUBLICAR") {
      const result = await this.publicationModel.startNewPublication(prompt, userId);

      if (!result.success) return "Service unavailable, please try again later";

      const iaBot = this.getIaBot("PUBLISHER", prompt);

      const publisherResponse = await this.startProcessing(prompt, iaBot, userId, "PUBLISHER");

      const publication = result.data as Publication;

      this.publicationModel.updatePublication(publication.id, publisherResponse);

      return publisherResponse;
    }

    return "NO IMPLEMENTADO";
  }
}
