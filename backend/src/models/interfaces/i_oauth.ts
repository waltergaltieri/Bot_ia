import { OAuthProfile } from "../../schemas/entities";
import { config } from '../../config/index';
import { Result } from "../../utils";

// This interface must to be extended by other OAuth interfaces.
export interface OAuthOf<T> {
    config: T;
}

export interface IOAuth<T = any> {
    authenticate: (config: OAuthOf<T>) => Promise<Result<OAuthProfile<any>, string>>;
}