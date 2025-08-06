import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'bigint' })
  phone: number;

  @Column({ unique: true })
  nid: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
}
