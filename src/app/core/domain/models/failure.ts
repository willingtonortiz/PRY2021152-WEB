export class Failure {
  message: string;

  constructor(message: string = '') {
    this.message = message;
  }

  static from(value: string): Failure {
    return new Failure(value);
  }
}
