import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerName: string;

  @Column()
  customerEmail: string;

  @Column()
  productId: number; // No relationship for now

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'enum', enum: ['placed', 'processing', 'delevered', 'cancelled'], default: 'placed' })
  status: 'placed' | 'processing' | 'completed' | 'cancelled';
}
