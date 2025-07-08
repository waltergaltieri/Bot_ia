import { Request, Response } from 'express';

export interface ITelegram {
  setWebhook: (req: Request, res: Response) => Promise<void>;
  getWebhookInfo: (req: Request, res: Response) => Promise<void>;
  deleteWebhook: (req: Request, res: Response) => Promise<void>;
  getMe: (req: Request, res: Response) => Promise<void>;
  onMessage: (req: Request, res: Response) => Promise<void>;
}
