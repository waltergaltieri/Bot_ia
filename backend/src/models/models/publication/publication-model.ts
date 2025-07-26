import { ConsultingPublicationStatus, IPublicationModel, IUserModel, UserModel } from "../..";
import { PublicationSchema } from "../../../config/db";
import { Publication } from "../../../schemas";
import { hoursPassedSince, Result, success, fail } from "../../../utils";

export class PublicationModel implements IPublicationModel {
  private readonly publicationSchema = PublicationSchema;
  private readonly userModel: IUserModel = new UserModel();

  async startNewPublication(text: string, userId: string): Promise<Result<any, string>> {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) return fail("User not found");

      const publication: Publication = await this.publicationSchema.create({
        userId: user.id,
        originalMessage: text,
        proposedCopy: text,
        status: "DRAFT",
        process: "IN_PROGRESS",
      });

      return success(publication);
    } catch (error) {
      return fail("Failed to start publishing process");
    }
  }

  async updatePublication(publicationId: string, content: string): Promise<Result<Publication, string>> {
    try {
      const publication: Publication | null = await this.publicationSchema.findByIdAndUpdate(
        publicationId,
        { proposedCopy: content, status: "DRAFT" },
        { new: true }
      );

      if (!publication) return fail("Publication not found");

      return success(publication);
    } catch (error) {
      return fail("Failed to update publication");
    }
  }

  async publishPublication(publicationId: string): Promise<Result<Publication, string>> {
    try {
      const publication = await this.publicationSchema.findByIdAndUpdate(
        publicationId,
        { process: "COMPLETED", status: "PUBLISHED" },
        { new: true }
      );

      if (!publication) return fail("Publication not found");

      return success(publication);
    } catch (error) {
      return fail("Failed to publish publication");
    }
  }

  async cancelPublication(publicationId: string): Promise<Result<Publication, string>> {
    try {
      const publication = await this.publicationSchema.findByIdAndUpdate(
        publicationId,
        { status: "ARCHIVED", process: "CANCELED" },
        { new: true }
      );

      if (!publication) return fail("Publication not found");

      return success(publication);
    } catch (error) {
      return fail("Failed to cancel publication");
    }
  }

  async getPublicationById(publicationId: string): Promise<Result<Publication, string>> {
    try {
      const publication = await this.publicationSchema.findById(publicationId);
      if (!publication) return fail("Publication not found");
      return success(publication);
    } catch (error) {
      return fail("Failed to get publication");
    }
  }

  async isNewPublication(userPhoneNumber: string): Promise<Result<any, string>> {
    try {
      const user = await this.userModel.findByPhone(userPhoneNumber);
      if (!user) return fail("User not found", "User lookup failed in isNewPublication");

      const publication = await this.publicationSchema
        .findOne({
          userId: user.id,
          process: "IN_PROGRESS",
        })
        .sort({ createdAt: -1 });

      if (!publication) return success<ConsultingPublicationStatus>({ isNew: true, userId: user.id });
      const hoursAgo = hoursPassedSince(publication.createdAt);
      if (hoursAgo > 24) return success<ConsultingPublicationStatus>({ isNew: true, userId: user.id });

      return success<ConsultingPublicationStatus>({ isNew: false, userId: user.id, publication });
    } catch (error) {
      return fail("Failed to check new publication");
    }
  }
}
