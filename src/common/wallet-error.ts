class WalletError extends Error {
  code: number = 200;

  message: string = 'success';

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export default WalletError;
