export function percentile(values, p) { if (!values.length)
    throw new Error('EMPTY_SAMPLE'); const sorted = [...values].sort((a, b) => a - b); return sorted[Math.ceil((p / 100) * sorted.length) - 1] ?? sorted[0]; }
export function releaseGate(input) { const failures = []; if (!input.tests)
    failures.push('TESTS'); if (input.errorRate > 0.01)
    failures.push('ERROR_RATE'); if (input.p95Ms > input.maxP95Ms)
    failures.push('P95'); if (!input.criticalEvidence)
    failures.push('EVIDENCE'); return { pass: failures.length === 0, failures }; }
