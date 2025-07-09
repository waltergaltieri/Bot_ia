import { IOAuth, LinkedInConfig, LinkedInModel } from "../../../models";
import { isFailure, logger, sendBadRequest, sendInternalServerError, sendOk } from "../../../utils";
import { Request, Response } from "express";

export class LinkedInController {
  private linkedInModel: IOAuth<LinkedInConfig>;

  constructor({ linkedInModel }: { linkedInModel: IOAuth<LinkedInConfig> }) {
    this.linkedInModel = linkedInModel;
  }

  authenticate = async (req: Request, res: Response) => {
    try {
      logger.info("Iniciando autenticación de LinkedIn con método GET...");

      const { code } = req.query;
      if (!code) {
        sendBadRequest(res, "Código de autenticación no proporcionado");
        return;
      }

      const profileResult = await this.linkedInModel.authenticate({
        config: {
          code: code as string,
        },
      });

      if (isFailure(profileResult)) {
        sendBadRequest(res, "Error durante la autenticación de LinkedIn", profileResult.error);
        return;
      }

      sendOk(res, profileResult.data, "Autenticación exitosa");

      res.status(200).json({
        message: "Autenticación exitosa",
        profile: profileResult.data,
      });
    } catch (error) {
      sendInternalServerError(res, "Error durante la autenticación de LinkedIn", error);
    }
  };
}
