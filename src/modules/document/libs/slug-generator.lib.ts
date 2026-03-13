import { nanoid } from 'nanoid';
import { SlugGeneratorPort } from '@/domains/ports/out/slug-generator.port';

export class SlugGenerator implements SlugGeneratorPort {
  private static SLUG_LENGTH: number = 8;

  public generate(): string {
    return nanoid(SlugGenerator.SLUG_LENGTH);
  }
}
