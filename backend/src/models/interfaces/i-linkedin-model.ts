import { IOAuth } from "..";
import { Result } from "../../utils";

export interface LinkedInConfig {
  code: string;
}

export interface ILinkedInModel extends IOAuth<LinkedInConfig> {
  publicCopy(): Promise<Result<any, string>>;
}
