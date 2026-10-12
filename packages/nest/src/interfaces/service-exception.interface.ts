import { Errors } from './errors.interface.ts';

export interface ServiceException {
  status: number;
  message: string;
  errors?: Errors;
}
