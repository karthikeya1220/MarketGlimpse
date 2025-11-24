'use server';

import { auth } from '@/lib/better-auth/auth';
import { inngest } from '@/lib/inngest/client';
import { headers } from 'next/headers';
import { signUpSchema, signInSchema } from '@/lib/validations/auth';
import { logger } from '@/lib/logger';
import { z } from 'zod';
import { type ActionResult, successResult, errorResult } from '@/lib/action-types';

export const signUpWithEmail = async (data: SignUpFormData): Promise<ActionResult<unknown>> => {
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

    return successResult(response as unknown, 'Account created successfully');
  } catch (error) {
    logger.error('Sign up failed', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message).join(', ');
      return errorResult(errorMessages, 'VALIDATION_ERROR');
    }

    return errorResult(
      error instanceof Error ? error.message : 'Sign up failed',
      'SIGNUP_ERROR'
    );
  }
};

export const signInWithEmail = async (data: SignInFormData): Promise<ActionResult<unknown>> => {
  try {
    // Validate input
    const validatedData = signInSchema.parse(data);

    const response = await auth.api.signInEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
      },
    });

    return successResult(response as unknown, 'Signed in successfully');
  } catch (error) {
    logger.error('Sign in failed', error instanceof Error ? error : new Error(String(error)));

    if (error instanceof z.ZodError) {
      const errorMessages = error.issues.map((issue) => issue.message).join(', ');
      return errorResult(errorMessages, 'VALIDATION_ERROR');
    }

    return errorResult(
      error instanceof Error ? error.message : 'Sign in failed',
      'SIGNIN_ERROR'
    );
  }
};

export const signOut = async (): Promise<ActionResult<void>> => {
  try {
    await auth.api.signOut({ headers: await headers() });
    return successResult(undefined, 'Signed out successfully');
  } catch (error) {
    logger.error('Sign out failed', error instanceof Error ? error : new Error(String(error)));
    return errorResult(
      error instanceof Error ? error.message : 'Sign out failed',
      'SIGNOUT_ERROR'
    );
  }
};
