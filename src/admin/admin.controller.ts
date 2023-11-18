import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateServiceDTO } from 'src/shared/dto';
import { RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorator/role.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/service')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getService() {
        return this.adminService.getService()
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Post('create')
    async createService(@Body(ValidationPipe) service: CreateServiceDTO) {
        return await this.adminService.createService(service)
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Patch(':id/update')
    async updateService(@Param('id') ID: string, @Body(ValidationPipe) serviceDTO: CreateServiceDTO) {
        const service = {
            ID: parseInt(ID),
            name: serviceDTO.name,
        }
        return await this.adminService.updateService(service)
    }
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Delete(':id/delete')
    deleteService(@Param('id') ID: string) {
        return this.adminService.deleteService(parseInt(ID))
    }
}
