export type Authed = {
  authenticated: true;
  user: User;
};

export type NotAuthed = {
  authenticated: false;
};

export type User = {
  id: string;
  lastCommand: Date;
  avatar: string | null;
  lastKnownUsername: string;
  adminLevel: number;
};
export type Session = {
  id: string;
  expiresAt: Date;
  userId: string;
};
