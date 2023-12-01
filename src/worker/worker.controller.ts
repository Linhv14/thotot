import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { UpdateWorkingModeDTO } from 'src/shared/dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/shared/decorator/role.decorator';
import { RolesGuard } from 'src/shared/guards';

@Controller('worker')
export class WorkerController {
    constructor(private readonly workerService: WorkerService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('worker')
    @Post('toggle-working-mode')
    enableWorking(@Req() req: any, @Body(ValidationPipe) workerDTO: UpdateWorkingModeDTO) {
        workerDTO.ID = parseInt(req.user['ID']) 
        return this.workerService.toggleWorkingMode(workerDTO)
    }
}
