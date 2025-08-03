import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { AddAdminDto } from "./add-admin.dto";
import { UpdateAdminDto } from "./update-admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "./admin.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminService {
    
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository:Repository<Admin>,

    ){}

    async findAll():Promise<Admin[]> {
        return this.adminRepository.find();
    }

    async getAdminById(id: number):Promise<Admin> {
        const admin = await this.adminRepository.findOne({where:{id}})
        if (!admin) throw new NotFoundException("Admin not found");
        return admin;
    }

    async createAdmin(addAdminDto: AddAdminDto):Promise<Admin> {
        const idExist = await this.adminRepository.findOne({where : {id:addAdminDto.id}});
        if(idExist) throw new ConflictException('Admin with the same if already exists');

        const emailExists = await this.adminRepository.findOne({where : {email: addAdminDto.email}});
        if (emailExists) throw new ConflictException('Email already in use');

        const newCreatedAdmin = this.adminRepository.create(addAdminDto);
        return this.adminRepository.save(newCreatedAdmin);
    }
    

    async updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<Admin> {
        const admin = await this.getAdminById(id);

        if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
            const existingAdmin = await this.adminRepository.findOne({ where: { email: updateAdminDto.email } });
        if (existingAdmin) throw new ConflictException('Email already exists');
        }

    return await this.adminRepository.save({ ...admin, ...updateAdminDto });
    }


    async changeStatus(id: number, status: 'active' | 'inactive'): Promise<Admin> {
    const admin = await this.getAdminById(id);
    admin.status = status;
    return await this.adminRepository.save(admin);
    }

    async deleteAdmin(id : number): Promise<void>{
        const admin = await this.getAdminById(id);
        await this.adminRepository.remove(admin);

    }
    async getInactive():Promise<Admin[]>{
        return await this.adminRepository.find({where:{status:'inactive'}});
    }
    async getOlderThan(age:number):Promise<Admin[]>{
        return await this.adminRepository.createQueryBuilder('admin').where('admin.age> :age',{age}).getMany();
    }

    
}
