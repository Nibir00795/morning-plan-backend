import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiSecurity, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Public } from '../common/decorators/public.decorator';
import { AdminApiKeyGuard } from '../common/guards/admin-api-key.guard';
import { AdminService } from './admin.service';
import { StorageService } from '../storage/storage.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { CreateFamousPersonDto } from './dto/create-famous-person.dto';
import { UpdateFamousPersonDto } from './dto/update-famous-person.dto';
import { CreateFamousTaskDto } from './dto/create-famous-task.dto';
import { UpdateFamousTaskDto } from './dto/update-famous-task.dto';
import { CreateIconDto } from './dto/create-icon.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  private readonly adminUsername: string;
  private readonly adminPassword: string;
  private readonly adminApiKey: string;

  constructor(
    private readonly adminService: AdminService,
    private readonly storage: StorageService,
    config: ConfigService,
  ) {
    this.adminUsername = config.get<string>('ADMIN_USERNAME', 'admin');
    this.adminPassword = config.get<string>('ADMIN_PASSWORD', '');
    this.adminApiKey = config.get<string>('ADMIN_API_KEY', '');
  }

  // ── Login (no guard) ──

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Admin login — returns API key on success' })
  login(@Body() dto: AdminLoginDto) {
    if (
      dto.username !== this.adminUsername ||
      dto.password !== this.adminPassword
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return { apiKey: this.adminApiKey };
  }

  // ── Guarded admin routes ──

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Get('famous-persons')
  @ApiOperation({ summary: 'List all famous persons (admin)' })
  listPersons() {
    return this.adminService.listPersons();
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Post('famous-persons')
  @ApiOperation({ summary: 'Create a famous person with optional tasks' })
  createPerson(@Body() dto: CreateFamousPersonDto) {
    return this.adminService.createPerson(dto);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Patch('famous-persons/:id')
  @ApiOperation({ summary: 'Update famous person details' })
  updatePerson(@Param('id') id: string, @Body() dto: UpdateFamousPersonDto) {
    return this.adminService.updatePerson(id, dto);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Delete('famous-persons/:id')
  @ApiOperation({ summary: 'Delete a famous person and their tasks' })
  deletePerson(@Param('id') id: string) {
    return this.adminService.deletePerson(id);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Post('famous-persons/:personId/tasks')
  @ApiOperation({ summary: 'Add a task to a famous person' })
  addTask(
    @Param('personId') personId: string,
    @Body() dto: CreateFamousTaskDto,
  ) {
    return this.adminService.addTask(personId, dto);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Patch('famous-tasks/:taskId')
  @ApiOperation({ summary: 'Update a famous task' })
  updateTask(
    @Param('taskId') taskId: string,
    @Body() dto: UpdateFamousTaskDto,
  ) {
    return this.adminService.updateTask(taskId, dto);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Delete('famous-tasks/:taskId')
  @ApiOperation({ summary: 'Delete a famous task' })
  deleteTask(@Param('taskId') taskId: string) {
    return this.adminService.deleteTask(taskId);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Get('icons')
  @ApiOperation({ summary: 'List all task icons' })
  listIcons() {
    return this.adminService.listIcons();
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Post('icons/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({ summary: 'Upload icon image; returns URL for createIcon' })
  async uploadIcon(@UploadedFile() file: Express.Multer.File) {
    if (!file || !file.buffer) {
      throw new BadRequestException('No file uploaded');
    }
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowed.join(', ')}`,
      );
    }
    const url = await this.storage.uploadIcon(file);
    return { url };
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Post('icons')
  @ApiOperation({ summary: 'Create a new task icon' })
  createIcon(@Body() dto: CreateIconDto) {
    return this.adminService.createIcon(dto);
  }

  @Public()
  @UseGuards(AdminApiKeyGuard)
  @ApiSecurity('admin-api-key')
  @Delete('icons/:id')
  @ApiOperation({ summary: 'Delete a task icon' })
  deleteIcon(@Param('id') id: string) {
    return this.adminService.deleteIcon(id);
  }
}
