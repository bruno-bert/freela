import type { ContactState, RecordContactInput } from '@core/domain/model';
import { ConflictError, DomainError } from '@core/domain/errors';
export function recordContact(current: ContactState, command: RecordContactInput, now: string): ContactState {
  if (current.version !== command.expectedVersion) throw new ConflictError();
  if (current.contacted) throw new DomainError('Contact has already been recorded.', 409);
  return { contacted: true, version: current.version + 1, history: [...current.history, { at: now, note: command.note }] };
}
export const initialContact = (): ContactState => ({ contacted: false, version: 0, history: [] });
