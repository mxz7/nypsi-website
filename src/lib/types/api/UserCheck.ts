interface ErrorUserCheck {
  ok: false;
  error: number;
}

interface SuccessUsercheck {
  ok: true;
  exists: boolean;
  private: boolean;
}

export type APIUserCheck = SuccessUsercheck | ErrorUserCheck;
