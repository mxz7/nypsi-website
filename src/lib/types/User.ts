interface Base {
  authenticated: boolean;
}

interface NotAuthenticated extends Base {
  authenticated: false;
}

export interface User extends Base {
  authenticated: true;
  username?: string;
  discriminator?: string;
  avatar?: string;
  id?: string;
}

export type UserSession = NotAuthenticated | User;
