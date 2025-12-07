export interface IEmailVerificationRepository {
  saveToken(token: string, userId: string): Promise<void>;
  findToken(token: string): Promise<any>;
  markTokenUsed(id: string): Promise<void>;
  verifyUser(userId: string): Promise<void>;
}
