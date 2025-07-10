import { Router } from "express";
import { IOAuth, LinkedInConfig } from "../../models";
import { LinkedInController } from "../../controllers";

export interface ILinkedInRouter {
  linkedInModel: IOAuth<LinkedInConfig>;
}

export const createLinkedInRouter = ({ linkedInModel }: ILinkedInRouter) => {
  const router = Router();
  const linkedInController = new LinkedInController({ linkedInModel });
  router.get("/auth", linkedInController.authenticate);

  return router;
};