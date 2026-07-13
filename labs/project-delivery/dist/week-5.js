export function migrationRisks(steps) {
    const risks = [];
    const setIndex = steps.findIndex(step => step.kind === 'set_not_null');
    const backfillIndex = steps.findIndex(step => step.kind === 'backfill');
    const validateIndex = steps.findIndex(step => step.kind === 'validate');
    if (setIndex >= 0 && (backfillIndex < 0 || backfillIndex > setIndex))
        risks.push('NOT_NULL_BEFORE_BACKFILL');
    if (setIndex >= 0 && (validateIndex < 0 || validateIndex > setIndex))
        risks.push('NOT_NULL_BEFORE_VALIDATION');
    if (steps.some(step => step.kind === 'drop'))
        risks.push('DESTRUCTIVE_CHANGE_REQUIRES_COMPATIBILITY_WINDOW');
    return risks;
}
export function recommendCompositeIndex(filters, order) {
    return [...new Set([...filters, ...order])];
}
