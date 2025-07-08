export interface LinkedInLocale {
  country: string;
  language: string;
}

export interface LinkedInProfile {
  sub: string;
  email_verified: boolean;
  name: string;
  locale: LinkedInLocale;
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}
