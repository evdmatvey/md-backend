import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('documents')
export class DocumentController {
  public constructor(private readonly _documentService: DocumentService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  public async create(@Body() dto: CreateDocumentDto) {
    return this._documentService.create(dto);
  }
}
