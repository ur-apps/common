import { PointerType } from './types';

export const SUPPORTS_POINTER = typeof PointerEvent !== 'undefined';
export const ENTER_EVENT = SUPPORTS_POINTER ? 'pointerenter' : 'mouseenter';
export const LEAVE_EVENT = SUPPORTS_POINTER ? 'pointerleave' : 'mouseleave';
export const FOCUS_EVENT = 'focus';
export const BLUR_EVENT = 'blur';
export const DEFAULT_POINTER_TYPES: PointerType[] = ['mouse', 'pen'];
