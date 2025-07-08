import { Result } from "../../utils";

export interface SendMessageConfig {
  chatId: string;
  text: string;
}

export interface IncommingMessage {
  chatId: string;
  text: string;
}

export interface ITelegramModel {
  setWebhook: (url: string, options?: any) => Promise<Result<string, string>>;
  getWebhookInfo: () => Promise<Result<any, string>>;
  deleteWebhook: () => Promise<Result<any, string>>;
  getMe: () => Promise<Result<any, string>>;
  onMessage: (IncommingMessage: IncommingMessage) => Promise<Result<any, string>>;
  sendMessage: (config: SendMessageConfig) => Promise<Result<any, string>>;
}
