interface BaseUserCheck {
  message: string;
}

interface ErrorUserCheck extends BaseUserCheck {
  message: string;
  error: number;
}

interface SuccessUsercheck extends BaseUserCheck {
  message: "success";
  exists: boolean;
  private: boolean;
}

export type APIUserCheck = SuccessUsercheck | ErrorUserCheck;
