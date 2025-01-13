import { IsDate } from 'class-validator';

export abstract class TimeDtoCommon {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}
