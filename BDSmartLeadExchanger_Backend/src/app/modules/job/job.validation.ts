import { z } from 'zod';

// User creates deposit
const jobSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Job title must be at least 5 characters'),
    description: z
      .string()
      .min(10, 'Job description must be at least 10 characters'),
    jobUrl: z.string().url('Must be a valid URL'),
    screenshotTitles: z
      .array(z.string())
      .max(4, 'Max 4 screenshot titles allowed'),
    thumbnail: z.string().optional(), // file path or URL
  }),
});

export const jobValidation = {
  jobSchema,
};
