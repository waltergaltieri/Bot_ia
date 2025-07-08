import { config } from "../config";

export function getLinkedInAuthUrl(): string {
  const { clientId, uniqueState } = config.socialMedia.linkedin;
  const redirectUri = "https://f53hh0d1-3000.uks1.devtunnels.ms/api/linkedin/auth";
  const scope = "openid profile email";
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(uniqueState)}`;
  return authUrl;
}