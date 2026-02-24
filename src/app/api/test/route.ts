import { NextRequest } from 'next/server';
import {
  successResponse,
  errorResponse,
  handleApiError,
} from '@/lib/api-response';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous';
    const rateLimitResult = rateLimit(ip);

    if (!rateLimitResult.success) {
      return errorResponse('Rate limit exceeded', 429);
    }

    // Test endpoint
    return successResponse(
      {
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        rateLimit: {
          remaining: rateLimitResult.remaining,
          reset: new Date(rateLimitResult.reset).toISOString(),
        },
      },
      'Test successful'
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return successResponse(
      {
        received: body,
        timestamp: new Date().toISOString(),
      },
      'Data received successfully'
    );
  } catch (error) {
    return handleApiError(error);
  }
}
