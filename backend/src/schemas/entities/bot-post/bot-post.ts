export type PostStatus = 
    | "idle"
    | "awaiting_images"
    | "awaiting_text"
    | "ready_to_optimize"
    | "awaiting_confirmation"
    | "posting"
    | "done";

export interface MediaItem {
    type: "image" | "video";
    url: string;
}

export interface BotPost {
    userId: string;
    status: PostStatus;
    images: MediaItem[];
    videos: MediaItem[];
    text: string;
    optimizedText: string;
    createdAt: string;
    updatedAt: string;
}
