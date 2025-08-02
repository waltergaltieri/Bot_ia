
export type AnalyzerResponse = "PUBLICAR" | "NO_PUBLICAR" | "IGNORAR";

export interface IAResponse<T> {
    result: T
} 

export interface UserPrompt {
    message: string;
    phoneNumber: string;
    type: "text" | "image";
}

export interface IIA {
    getResponse(userPrompt: UserPrompt): Promise<string>;
}