import axios from "axios";
import { LinkedInProfile, OAuthProfile } from "../../../schemas/entities";
import { fail, isFailure, logger, success, Result } from "../../../utils";
import { OAuthOf, ILinkedInModel, LinkedInConfig, IUserModel, UserModel, LinkedInCopy } from "../..";
import { decodeState } from "../../../utils/oauth-payload-util";

export class LinkedInModel implements ILinkedInModel {
  private readonly userModel: IUserModel = new UserModel();


  async authenticate({ config }: OAuthOf<LinkedInConfig>): Promise<Result<OAuthProfile<LinkedInProfile>, string>> {
    const accessTokenResult = await this.getAccesToken(config.code);

    if (isFailure(accessTokenResult)) return accessTokenResult;
    const profileResult = await this.getProfile(accessTokenResult.data);

    if (isFailure(profileResult)) return profileResult;

    const payload = decodeState(config.state);

    if(!payload) {
      return fail("Invalid state payload", "Error decoding state");
    }

    this.userModel.saveOrUpdateUser({phone: payload.phone, linkedinProfile: profileResult.data, linkedinAccessToken: accessTokenResult.data});

    return profileResult;
  }

  async publicCopy(copy: LinkedInCopy): Promise<Result<any, string>> {

    const { userPhone, text, author, visibility, feedDistribution, targetEntities, thirdPartyDistributionChannels, lifecycleState, isReshareDisabledByAuthor } = copy;
    const user = await this.userModel.findByPhone(userPhone);

    if(!user) {
      return fail("User not found", "Error fetching user for LinkedIn post");
    }

    const linkedInProfile = user.linkedinProfile;

   
    logger.info("Publicando en LinkedIn...");
    try {
      // const postBody = {
      //   author: author ? `${author}:${linkedInProfile?.sub}` : `urn:li:person:${linkedInProfile?.sub}`,
      //   commentary: text,
      //   visibility: visibility ?? "PUBLIC",
      //   distribution: {
      //     feedDistribution: feedDistribution ?? "MAIN_FEED",
      //     targetEntities: targetEntities ?? [],
      //     thirdPartyDistributionChannels: thirdPartyDistributionChannels ?? [],
      //   },
      //   lifecycleState: lifecycleState ?? "PUBLISHED",
      //   isReshareDisabledByAuthor: isReshareDisabledByAuthor ?? false,
      // };

      // const response = await axios.post("https://api.linkedin.com/rest/posts", postBody, {
      //   headers: {
      //     Authorization: `Bearer ${user.linkedinAccessToken}`,
      //     "LinkedIn-Version": "202410",
      //     "X-Restli-Protocol-Version": "2.0.0",
      //     "Content-Type": "application/json",
      //   },
      // });

      // logger.info("✅ PUBLICACIÓN EN LINKEDIN:", response.data);
      // return success<any>(response.data);

      const fakeData = {"text": text, "mensaje": "publicado con éxito en LinkedIn"};
      logger.info("✅ PUBLICACIÓN EN LINKEDIN:", fakeData);
      return success<any>(fakeData);
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
      return success<OAuthProfile<LinkedInProfile>>(profile);
    } catch (error: any) {
      return fail(error.response?.data || error.message, "Error al obtener el perfil de LinkedIn");
    }
  }
}
