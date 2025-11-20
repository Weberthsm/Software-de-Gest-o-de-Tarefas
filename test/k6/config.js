// K6 config constants. Override via environment vars when needed.
// Usage: K6_BASE_URL=http://localhost:3000 k6 run test/k6/auth/register.k6.js
export const BASE_URL = __ENV.K6_BASE_URL || 'http://localhost:3000';
