export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: string = 'user',
    public readonly isVerified: boolean = false,
    public readonly password?: string,
  ) {}
}
