export interface HealthInput {
  configReady: boolean;
  requiredStoreWritable: boolean;
  cacheAvailable: boolean;
  pendingJobs: number;
  oldestPendingAgeMs: number;
}

export function health(input: HealthInput) {
  const ready = input.configReady && input.requiredStoreWritable;
  return {
    live: true,
    ready,
    status: ready ? (input.cacheAvailable ? 'ready' : 'degraded') : 'not_ready',
    checks: {
      requiredConfig: input.configReady,
      requiredStore: input.requiredStoreWritable,
      optionalCache: input.cacheAvailable,
      outboxBacklog: { pending: input.pendingJobs, oldestAgeMs: input.oldestPendingAgeMs },
    },
  } as const;
}
