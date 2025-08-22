import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Seller } from "../seller/seller.entity";
import { Product } from "../product/product.entity";

@Entity()
export class Admin {
  @PrimaryColumn({ unsigned: true })
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 17 })
  nid: string;

  @Column({ type: 'int', unsigned: true })
  age: number;

  @Column({ default: 'active' })
  status?: 'active' | 'inactive';

  @Column({ nullable: true })
  fileName: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'character varying', length: 11, nullable: true })
  phone: string;

  @OneToMany(() => Seller, seller => seller.admin)
  sellers: Seller[];

  @OneToMany(() => Product, product => product.addedBy)
  productsAdded: Product[];
}