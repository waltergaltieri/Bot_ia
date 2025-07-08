// This interface must to be extended by other OAuth interfaces.
export interface BaseOAuthConfig {}

export interface IOAuth {
    authenticate: (config: BaseOAuthConfig) => Promise<string>;
}