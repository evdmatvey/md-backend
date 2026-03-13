import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({
    required: true,
    example: 'README',
    description: 'Название',
  })
  @IsString({ message: 'Название должно быть строкой.' })
  @IsNotEmpty({ message: 'Название не должно быть пустым.' })
  @MaxLength(255, { message: 'Название слишком длинное.' })
  title: string;

  @ApiProperty({
    required: true,
    example: '## Hello, world!',
    description: 'Текст в формате markdown',
  })
  @IsString({ message: 'Markdown должен быть строкой.' })
  @IsNotEmpty({ message: 'Markdown не должен быть пустым.' })
  markdown: string;
}
