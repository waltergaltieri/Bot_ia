import { IOAuth } from "..";
import { Result } from "../../utils";

export interface LinkedInConfig {
  code: string;
  state: string;
}

export interface LinkedInCopy {
  userPhone: string;
  text: string;
  author?: string;
  visibility?: "PUBLIC" | "CONNECTIONS_ONLY";
  feedDistribution?: "MAIN_FEED" | "GROUP_FEED";
  targetEntities?: string[];
  thirdPartyDistributionChannels?: string[];
  lifecycleState?: "PUBLISHED" | "DRAFT";
  isReshareDisabledByAuthor?: boolean;
}

export interface ILinkedInModel extends IOAuth<LinkedInConfig> {
  publicCopy(copy: LinkedInCopy): Promise<Result<any, string>>;
}
