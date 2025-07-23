
export type AnalyzerResponse = "PUBLICAR" | "NO_PUBLICAR" | "IGNORAR";

export interface IAResponse<T> {
    result: T
} 


export interface IIA {
    getResponse(userPromp: String, userPhoneNumber: String): Promise<string>;
 }