import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// this middleware is used to set the x-request-id header on the request and response. mostly for debugging purposes.

export function middleware(request: NextRequest) {
  // check if x-request-id already exists
  const existingRequestId = request.headers.get('x-request-id');
  
  // generate a new UUID v4 if not present
  const requestId = existingRequestId || crypto.randomUUID();
  
  // clone the request headers and set the x-request-id
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  
  // create the response with modified headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // set x-request-id on the response for client visibility
  response.headers.set('x-request-id', requestId);
  
  // Add security headers for production
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add strict transport security in production (only over HTTPS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};

