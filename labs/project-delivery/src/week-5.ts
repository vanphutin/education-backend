export interface MigrationStep { kind: 'add_nullable' | 'backfill' | 'validate' | 'set_not_null' | 'drop'; table: string }
export function migrationRisks(steps: MigrationStep[]): string[] {
  const risks: string[] = [];
  const setIndex = steps.findIndex(step => step.kind === 'set_not_null');
  const backfillIndex = steps.findIndex(step => step.kind === 'backfill');
  const validateIndex = steps.findIndex(step => step.kind === 'validate');
  if (setIndex >= 0 && (backfillIndex < 0 || backfillIndex > setIndex)) risks.push('NOT_NULL_BEFORE_BACKFILL');
  if (setIndex >= 0 && (validateIndex < 0 || validateIndex > setIndex)) risks.push('NOT_NULL_BEFORE_VALIDATION');
  if (steps.some(step => step.kind === 'drop')) risks.push('DESTRUCTIVE_CHANGE_REQUIRES_COMPATIBILITY_WINDOW');
  return risks;
}
export function recommendCompositeIndex(filters: string[], order: string[]): string[] {
  return [...new Set([...filters, ...order])];
}
