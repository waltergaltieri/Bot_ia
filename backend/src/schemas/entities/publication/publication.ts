import { PublicationProcess, PublicationStatus } from "../..";


export interface Publication {
    id: string;
    userId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    status: PublicationStatus;
    process: PublicationProcess;
}