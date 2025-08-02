import { PublicationProcess, PublicationStatus } from "../..";


export interface Publication {
    id: string;
    userId: string;
    originalMessage: string;
    proposedCopy?: string;
    createdAt: Date;
    updatedAt: Date;
    status: PublicationStatus;
    process: PublicationProcess;
    images?: string[];
}