import axios from "axios";
import { LinkedInProfile, OAuthProfile } from "../../../schemas/entities";
import { fail, isFailure, logger, success, Result } from "../../../utils";
import { OAuthOf, ILinkedInModel, LinkedInConfig } from "../..";

export class LinkedInModel implements ILinkedInModel {
  async authenticate({ config }: OAuthOf<LinkedInConfig>): Promise<Result<OAuthProfile<LinkedInProfile>, string>> {
    const accessTokenResult = await this.getAccesToken(config.code);

    if (isFailure(accessTokenResult)) return accessTokenResult;
    const profileResult = await this.getProfile(accessTokenResult.data);
    return profileResult;
  }

  async publicCopy(): Promise<Result<any, string>> {
    // const access =
    //   "AQVuB6g3w0XTHTrI87C8KxAJxV61sqKyI5DNzRMuGpkIQJ7470YJFnbY8FDOGx0Kns20s6ZmQV0PALyG8-uea7zEFQaDdJ8PyuaCwkG6EZETHpxpTH8D0jn_CAQxTE5aeu-kUsIM4hf0SoUL-aQxSK7dqOgRRLAV0P80D1co3I8W9CpcgEnwkWvvymDJv6RcNhxXeuHwWgfgcWcEf-Ak-fr4gcftustF2gdj9mwomn0Lajjjugo5Y6TY3gxBwjEs4n-sKQ4Y9NjYqxQ3mho8fPwEsBI96lyltSeKfRGd3JBGkWKv-kHq8Uxt3fO1HGSXtNMyuQkHls-UCdFtj60QvwcOpQU7pA";
    logger.info("Publicando en LinkedIn...");
    try {
      const postBody = {
        author: "urn:li:person:yTMUGolJhZ", // Cambiar a "author" en lugar de "owner"
        commentary: "¡Hola, este es mi primer post automático en LinkedIn desde mi app!",
        visibility: "PUBLIC",
        distribution: {
          feedDistribution: "MAIN_FEED",
          targetEntities: [],
          thirdPartyDistributionChannels: [],
        },
        lifecycleState: "PUBLISHED",
        isReshareDisabledByAuthor: false,
      };

      const access =
        "AQVuB6g3w0XTHTrI87C8KxAJxV61sqKyI5DNzRMuGpkIQJ7470YJFnbY8FDOGx0Kns20s6ZmQV0PALyG8-uea7zEFQaDdJ8PyuaCwkG6EZETHpxpTH8D0jn_CAQxTE5aeu-kUsIM4hf0SoUL-aQxSK7dqOgRRLAV0P80D1co3I8W9CpcgEnwkWvvymDJv6RcNhxXeuHwWgfgcWcEf-Ak-fr4gcftustF2gdj9mwomn0Lajjjugo5Y6TY3gxBwjEs4n-sKQ4Y9NjYqxQ3mho8fPwEsBI96lyltSeKfRGd3JBGkWKv-kHq8Uxt3fO1HGSXtNMyuQkHls-UCdFtj60QvwcOpQU7pA";

      // Usar el endpoint correcto
      const response = await axios.post("https://api.linkedin.com/rest/posts", postBody, {
        headers: {
          Authorization: `Bearer ${access}`,
          "LinkedIn-Version": "202410", // Versión requerida
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      });

      logger.info("✅ PUBLICACIÓN EN LINKEDIN:", response.data);
      return success<any>(response.data);
    } catch (error: any) {
      logger.error("❌ Error en publicCopy:", error.response?.data || error.message);
      return fail(error.response?.data || error.message, "Error al publicar en LinkedIn");
    }
  }

  private async getAccesToken(code: string): Promise<Result<string, string>> {
    try {
      const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "https://app.otakudistrict.com/api/linkedin/auth",
          client_id: "77gb0ro5raeet3",
          client_secret: "WPL_AP1.jhOIJBTqmBZzwmlD.nuf+ZA==",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const accessToken = tokenResponse.data.access_token;
      logger.info(`✅ ACCESS TOKEN: ${accessToken}`);
      return success<string>(accessToken);
    } catch (error: any) {
      return fail(error.response?.data || error.message, "Error al obtener el token de acceso de LinkedIn");
    }
  }

  private async getProfile(accessToken: string): Promise<Result<OAuthProfile<LinkedInProfile>, string>> {
    try {
      const profileResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profile: OAuthProfile<LinkedInProfile> = profileResponse.data;
      logger.info("✅ USER PROFILE:", profile);
      return success<OAuthProfile<LinkedInProfile>>(profile);
    } catch (error: any) {
      return fail(error.response?.data || error.message, "Error al obtener el perfil de LinkedIn");
    }
  }
}
