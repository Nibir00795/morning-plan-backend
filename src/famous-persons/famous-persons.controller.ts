import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { FamousPersonsService } from './famous-persons.service';

@ApiTags('Famous Persons')
@Controller('famous-persons')
export class FamousPersonsController {
  constructor(private readonly fpService: FamousPersonsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List all famous persons with tasks' })
  findAll() {
    return this.fpService.findAll();
  }

  @Public()
  @Get('icons')
  @ApiOperation({ summary: 'List all available task icons' })
  getIcons() {
    return this.fpService.getIcons();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single famous person by ID' })
  findOne(@Param('id') id: string) {
    return this.fpService.findOne(id);
  }

  @Public()
  @Get(':id/tasks')
  @ApiOperation({ summary: 'Get tasks for a famous person' })
  getTasks(@Param('id') id: string) {
    return this.fpService.getTasksByPerson(id);
  }
}
