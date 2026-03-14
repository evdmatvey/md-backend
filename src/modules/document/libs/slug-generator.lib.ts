import { nanoid } from 'nanoid';
import { SlugGeneratorPort } from '@/domains/ports/out';

export class SlugGenerator implements SlugGeneratorPort {
  private static SLUG_LENGTH: number = 8;

  public generate(): string {
    return nanoid(SlugGenerator.SLUG_LENGTH);
  }
}
