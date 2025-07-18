// eslint-disable-next-line
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      [key: string]: unknown;
    };
  }

  interface User {
    id: string;
    username: string;
    [key: string]: unknown;
  }
}
