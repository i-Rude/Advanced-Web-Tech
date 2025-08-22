import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Admin } from '../admin/admin.entity';
import { Seller } from '../seller/seller.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', unsigned: true })
  stock: number;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ type: 'int', default: 0 })
  discount: number;

  @ManyToOne(() => Admin, admin => admin.productsAdded, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'addedById' })
  addedBy: Admin;

  @Column()
  sellerId: number;

  @ManyToOne(() => Seller, seller => seller.products, { 
    onDelete: 'CASCADE', 
    nullable: false 
  })
  @JoinColumn({ name: 'sellerId' })
  seller: Seller;
}
