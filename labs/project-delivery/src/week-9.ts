export interface RetryInput { method: string; idempotent: boolean; attempt: number; status?: number }
export function shouldRetry(input: RetryInput): boolean { return input.attempt < 3 && input.idempotent && (input.status===429 || input.status===503 || input.status===504); }
export function safeLog(input:{service:string;requestId:string;route:string;status:number;durationMs:number;token?:string}) { const {token: _secret,...safe}=input; return safe; }
