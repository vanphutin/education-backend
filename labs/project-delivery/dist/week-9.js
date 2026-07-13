export function shouldRetry(input) { return input.attempt < 3 && input.idempotent && (input.status === 429 || input.status === 503 || input.status === 504); }
export function safeLog(input) { const { token: _secret, ...safe } = input; return safe; }
