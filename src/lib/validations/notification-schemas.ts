import { z } from "zod";

export const notificationIdSchema = z.string().cuid();
