import { Body, Controller, Patch, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { CoordinateDTO, UpdateWorkingModeDTO } from 'src/shared/dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorator/role.decorator';
import { RolesGuard } from 'src/shared/guards';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('worker')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('worker')
    @Patch('toggle-working-mode')
    enableWorking(@Req() req: any, @Body(ValidationPipe) workerDTO: UpdateWorkingModeDTO) {
        workerDTO.ID = parseInt(req.user['ID']) 
        return this.workerService.toggleWorkingMode(workerDTO)
    }

    @SkipThrottle()
    @UseGuards(AuthGuard('jwt'))
    @Roles('user', 'worker')
    @Patch('update-coordinate')
    async updateCoordinates(@Body(ValidationPipe) coordinate: CoordinateDTO, @Req() req: any) {
        return this.workerService.updateCoordinate(coordinate, req.user['ID'])
    }
}
