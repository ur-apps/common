import { PointerType } from './types.ts';

export const ENTER_EVENT = 'pointerenter' as const;
export const LEAVE_EVENT = 'pointerleave' as const;
export const DEFAULT_POINTER_TYPES: PointerType[] = ['mouse', 'pen'];
