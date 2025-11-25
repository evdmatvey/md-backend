import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import {
  DocumentBadRequestResponse,
  DocumentOkResponse,
} from './swagger/response.types';

@ApiTags('Документы')
@Controller('documents')
export class DocumentController {
  public constructor(private readonly _documentService: DocumentService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создание короткой ссылки на markdown' })
  @ApiOkResponse({
    type: DocumentOkResponse,
    description: 'Короткая ссылка на переданный markdown успешно создана',
  })
  @ApiBadRequestResponse({
    type: DocumentBadRequestResponse,
    description:
      'Данные для создания короткой ссылки на markdown были переданы неверно',
  })
  public async create(@Body() dto: CreateDocumentDto) {
    return this._documentService.create(dto);
  }
}
