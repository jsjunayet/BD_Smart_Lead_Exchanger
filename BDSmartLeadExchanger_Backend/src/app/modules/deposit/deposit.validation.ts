import { z } from 'zod';

// User creates deposit
const createDepositSchema = z.object({
  body: z.object({
    amount: z.number({ required_error: 'Amount is required' }).min(1),
    transactionId: z.string({ required_error: 'Transaction ID is required' }),
    bkashNumber: z.string({ required_error: 'Bkash number is required' }),
  }),
});

// Admin approves or rejects deposit
const updateDepositSchema = z.object({
  body: z.object({
    status: z.enum(['approved', 'rejected'], {
      required_error: 'Status required',
    }),
    rejectReason: z.string().optional(), // required only if rejected
  }),
});

export const depositeValidation = {
  createDepositSchema,
  updateDepositSchema,
};
