import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateDocumentCommand,
  type CreateDocumentUseCase,
  CreateDocumentUseCaseSymbol,
  GetDocumentBySlugQuery,
  type GetDocumentBySlugUseCase,
  GetDocumentBySlugUseCaseSymbol,
} from '@/domains/ports/in';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentErrorFilter } from './filters/document-error.filter';
import {
  CreateDocumentOkResponse,
  DocumentBadRequestResponse,
  DocumentBannedResponse,
  DocumentNotFoundResponse,
  GetDocumentOkResponse,
} from './responses';

@ApiTags('Документы')
@Controller('documents')
@UseFilters(DocumentErrorFilter)
@UsePipes(new ValidationPipe())
export class DocumentController {
  public constructor(
    @Inject(CreateDocumentUseCaseSymbol)
    private readonly _createDocumentUseCase: CreateDocumentUseCase,
    @Inject(GetDocumentBySlugUseCaseSymbol)
    private readonly _getDocumentBySlugUseCase: GetDocumentBySlugUseCase,
    private readonly _configService: ConfigService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Создание короткой ссылки на markdown' })
  @ApiCreatedResponse({
    type: CreateDocumentOkResponse,
    description: 'Короткая ссылка на переданный markdown успешно создана',
  })
  @ApiBadRequestResponse({
    type: DocumentBadRequestResponse,
    description:
      'Данные для создания короткой ссылки на markdown были переданы неверно',
  })
  public async create(
    @Body() dto: CreateDocumentDto,
  ): Promise<CreateDocumentOkResponse> {
    const command = new CreateDocumentCommand(dto.title, dto.markdown);
    const created = await this._createDocumentUseCase.execute(command);

    const sharedUrl = this._configService.getOrThrow<string>('FRONTEND_URL');

    return CreateDocumentOkResponse.fromDomain(created, sharedUrl);
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
  @ApiForbiddenResponse({
    type: DocumentBannedResponse,
    description: 'Документ заблокирован',
  })
  public async getBySlug(
    @Param('slug') slug: string,
  ): Promise<GetDocumentOkResponse> {
    const query = new GetDocumentBySlugQuery(slug);
    const document = await this._getDocumentBySlugUseCase.execute(query);

    return GetDocumentOkResponse.fromDomain(document);
  }
}
