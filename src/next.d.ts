// next.d.ts
import { NextRequest } from 'next/server';

declare module 'next/server' {
  interface NextRequest {
    userId?: string; // Add the userId property here
  }
}
