import { object, string } from "zod";

export const UserAddViewData = object({
  userId: string().regex(/^\d{17,19}$/),
  viewerId: string()
    .regex(/^\d{17,19}$/)
    .optional(),
  viewerIp: string().ip(),
  referrer: string().url().optional(),
});
