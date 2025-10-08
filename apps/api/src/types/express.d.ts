import 'express';

declare global {
  namespace Express {
    interface User {
      sub: string;
      storeId: string;
      subDomain: string;
      iat?: number;
      exp?: number;
    }

    interface Request {
      user?: User;
      tenant?: string;
    }
  }
}
