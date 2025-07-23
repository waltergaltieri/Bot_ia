import { Publication } from "../../schemas";
import { Result } from "../../utils";

export interface ConsultingPublicationStatus {
    isNew: boolean;
    userId: string;
    publication?: Publication;
}

export interface IPublicationModel {
    isNewPublication(userPhoneNumber: string): Promise<Result<any, string>>;
    startNewPublication(text: string, userId: string): Promise<Result<any, string>>;
    getPublicationById(publicationId: string): Promise<Result<Publication, string>>;
    updatePublication(publicationId: string, content: string): Promise<Result<Publication, string>>;
    publishPublication(publicationId: string): Promise<Result<Publication, string>>;
    cancelPublication(publicationId: string): Promise<Result<Publication, string>>;
}