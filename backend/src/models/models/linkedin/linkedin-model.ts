import axios from "axios";
import { LinkedInProfile, OAuthProfile } from "../../../schemas/entities";
import { OAuthOf, IOAuth } from "../../interfaces/i_oauth";
import { fail, isFailure, logger, success, Result } from "../../../utils";

export interface LinkedInConfig {
  code: string;
}

export class LinkedInModel implements IOAuth {
  async authenticate({ config }: OAuthOf<LinkedInConfig>): Promise<Result<OAuthProfile<any>, string>> {
    const accessTokenResult = await this.getAccesToken(config.code);

    if (isFailure(accessTokenResult)) return accessTokenResult;

    return await this.getProfile(accessTokenResult.data);
  }

  private async getAccesToken(code: string): Promise<Result<string, string>> {
    try {
      const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: "https://f53hh0d1-3000.uks1.devtunnels.ms/api/linkedin/auth",
          client_id: "77gb0ro5raeet3",
          client_secret: "WPL_AP1.jhOIJBTqmBZzwmlD.nuf+ZA==",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      const accessToken = tokenResponse.data.access_token;
      logger.info("✅ ACCESS TOKEN:", accessToken);
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
