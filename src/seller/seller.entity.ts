import { Admin } from 'src/admin/admin.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({select:false})
  password: string;

  @Column({ type: 'bigint' })
  phone: number;

  @Column({ unique: true })
  nid: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Admin, admin => admin.sellers,{onDelete:'SET NULL' , nullable:true})
  @JoinColumn({name:'adminId'})
  admin:Admin;
}
