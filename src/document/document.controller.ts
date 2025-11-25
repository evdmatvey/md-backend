import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import {
  CreateDocumentOkResponse,
  DocumentBadRequestResponse,
  DocumentNotFoundResponse,
  GetDocumentOkResponse,
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
    type: CreateDocumentOkResponse,
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

  @Get(':slug')
  @ApiOperation({ summary: 'Получение markdown документа по его slug' })
  @ApiOkResponse({
    type: GetDocumentOkResponse,
    description: 'Документ успешно получен по переданному slug',
  })
  @ApiNotFoundResponse({
    type: DocumentNotFoundResponse,
    description: 'По переданному slug документ не найден',
  })
  public async getBySlug(@Param('slug') slug: string) {
    const document = await this._documentService.getBySlug(slug);

    return { document };
  }
}
