import { z } from 'zod';

const signupValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    userName: z
      .string({ required_error: 'Username is required' })
      .min(3, 'Username must be at least 3 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email format'),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(6, 'Phone number is too short'),
    country: z.string({ required_error: 'Country is required' }),
    city: z.string({ required_error: 'City is required' }),
    affiliateNetworkName: z.string({
      required_error: 'Affiliate network name is required',
    }),
    publisherId: z.string({
      required_error: 'Publisher ID is required',
    }),
    image: z
      .string({
        required_error: 'Image is required',
      })
      .optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
  }),
});

const loginValidationSchema = z.object({
  body: z
    .object({
      email: z.string().email('Invalid email').optional(),
      userName: z.string().optional(),
      password: z.string({ required_error: 'Password is required' }),
    })
    .refine((data) => data.email || data.userName, {
      message: 'Either email or username is required',
      path: ['email'],
    }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Old password is required',
    }),
    newPassword: z.string({ required_error: 'New password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email('Invalid email'),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required!',
      })
      .email('Invalid email'),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export const UserValidation = {
  signupValidationSchema,
  loginValidationSchema,
  changePasswordValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
