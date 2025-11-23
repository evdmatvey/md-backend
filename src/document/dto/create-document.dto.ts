import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString({ message: 'Название должно быть строкой.' })
  @IsNotEmpty({ message: 'Название не должно быть пустым.' })
  @MaxLength(255, { message: 'Название слишком длинное.' })
  title: string;

  @IsString({ message: 'Markdown должен быть строкой.' })
  @IsNotEmpty({ message: 'Markdown не должен быть пустым.' })
  markdown: string;
}
