import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application data' })
  @ApiResponse({ status: 200, description: 'Application is running' })
  getData() {
    return this.appService.getData();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({
    status: 200,
    description: 'Service and database are healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        api: { type: 'string', example: 'up' },
        db: { type: 'string', example: 'up' },
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
