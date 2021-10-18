export abstract class SessionStorage {
  abstract getToken(): String | null;

  abstract saveToken(token: string): void;

  abstract removeToken(): void;
}
