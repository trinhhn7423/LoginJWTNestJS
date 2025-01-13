import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export abstract class TimeEntityCommon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  created_at: Date;

  @Column({
    nullable: true,
  })
  updated_at: Date;

  @Column({
    nullable: true,
  })
  deleted_at: Date;
}
