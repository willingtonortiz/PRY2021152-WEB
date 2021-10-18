import { SessionStorage } from '../../domain';

const TOKEN_KEY = 'TOKEN_KEY';

export class SessionStorageImpl implements SessionStorage {
  getToken(): String | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  saveToken(token: string): void {
    return localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
