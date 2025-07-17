import { create } from "domain";
import { config } from "../config";
import { createStateForUser } from "./oauth-payload-util";

export function getLinkedInAuthUrl(customState?: string): string {
  const { clientId, uniqueState } = config.socialMedia.linkedin;
  const redirectUri = "https://app.otakudistrict.com/api/linkedin/auth";
  const scope = "openid profile email w_member_social";

  const state = customState ? createStateForUser(customState) : createStateForUser(uniqueState);

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
  return authUrl;
}