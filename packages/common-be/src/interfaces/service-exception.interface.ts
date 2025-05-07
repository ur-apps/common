import { Errors } from './errors.interface';

export interface ServiceException {
  status: number;
  message: string;
  errors?: Errors;
}
