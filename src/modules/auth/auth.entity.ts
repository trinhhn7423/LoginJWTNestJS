import { Column, Entity } from 'typeorm';
import { TimeEntityCommon } from '../../common/entity/time.entity.common';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class AuthEntity extends TimeEntityCommon {
  @Column({ length: 20, unique: true })
  username: string;
  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({
    type: 'enum',
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;
}
