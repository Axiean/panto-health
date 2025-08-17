/**
 * signals.controller.ts
 *
 * This controller is the entry point for all HTTP requests related to the 'Signal' resource.
 * It is responsible for handling the API layer concerns, including:
 * - Defining RESTful API routes (e.g., GET /signals, GET /signals/:id).
 * - Receiving and validating incoming request data (path params, query params, and body DTOs).
 * - Utilizing Swagger decorators to provide comprehensive, interactive API documentation.
 * - Delegating all business logic and data manipulation to the `SignalsService`.
 *
 * This strict separation of concerns (Controller for API, Service for Business Logic)
 * is a core principle of the NestJS architecture and leads to a clean, maintainable, and testable codebase.
 */

import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SignalsService } from './signals.service';
import { UpdateSignalDto } from './dto';
import { FilterQuery } from 'mongoose';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Signal } from './schemas/signal.schema';

@ApiTags('Signals')
@Controller('signals')
export class SignalsController {
  constructor(private readonly signalsService: SignalsService) {}

  @ApiOperation({ summary: 'Retrieve all signals with optional filtering' })
  @ApiQuery({
    name: 'deviceId',
    required: false,
    type: String,
    description: 'Filter signals by device ID',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of signals.',
    type: [Signal],
  })
  @Get()
  findAll(@Query() query: { deviceId?: string }) {
    const filter: FilterQuery<any> = {};
    if (query.deviceId) {
      filter.deviceId = query.deviceId;
    }
    return this.signalsService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single signal by its ID' })
  @ApiParam({ name: 'id', description: 'The unique ID of the signal' })
  @ApiResponse({
    status: 200,
    description: 'The requested signal.',
    type: Signal,
  })
  @ApiResponse({ status: 404, description: 'Signal not found.' })
  findOne(@Param('id') id: string) {
    return this.signalsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a signal by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the signal to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated signal.',
    type: Signal,
  })
  @ApiResponse({ status: 404, description: 'Signal not found.' })
  update(@Param('id') id: string, @Body() updateSignalDto: UpdateSignalDto) {
    return this.signalsService.update(id, updateSignalDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a signal by its ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the signal to delete',
  })
  @ApiResponse({ status: 200, description: 'Signal successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Signal not found.' })
  remove(@Param('id') id: string) {
    return this.signalsService.remove(id);
  }
}
