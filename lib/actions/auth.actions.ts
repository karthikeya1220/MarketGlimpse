'use server';

import { auth } from '@/lib/better-auth/auth';
import { inngest } from '@/lib/inngest/client';
import { headers } from 'next/headers';
import { signUpSchema, signInSchema } from '@/lib/validations/auth';
import { logger } from '@/lib/logger';
import { z } from 'zod';

export const signUpWithEmail = async (data: SignUpFormData) => {
  try {
    // Validate input
    const validatedData = signUpSchema.parse(data);

    const response = await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.fullName,
      },
    });

    if (response) {
      await inngest.send({
        name: 'app/user.created',
        data: {
          email: validatedData.email,
          name: validatedData.fullName,
          country: validatedData.country,
          investmentGoals: validatedData.investmentGoals,
          riskTolerance: validatedData.riskTolerance,
          preferredIndustry: validatedData.preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (error) {
    logger.error('Sign up failed', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Invalid input data',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
      };
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Sign up failed',
        code: 'SIGNUP_ERROR',
      },
    };
  }
};

export const signInWithEmail = async (data: SignInFormData) => {
  try {
    // Validate input
    const validatedData = signInSchema.parse(data);

    const response = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    return { success: true, data: response };
  } catch (error) {
    logger.error('Sign in failed', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          message: 'Invalid input data',
          code: 'VALIDATION_ERROR',
          details: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
      };
    }

    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Sign in failed',
        code: 'SIGNIN_ERROR',
      },
    };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (error) {
    logger.error('Sign out failed', error instanceof Error ? error : new Error(String(error)));
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Sign out failed',
        code: 'SIGNOUT_ERROR',
      },
    };
  }
};
