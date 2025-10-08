import z from "zod";

export const UserAddViewData = z.object({
  userId: z.string().regex(/^\d{17,19}$/),
  viewerId: z
    .string()
    .regex(/^\d{17,19}$/)
    .optional(),
  viewerIp: z.union([z.ipv4(), z.ipv6()]),
  referrer: z.string().url().optional(),
});
