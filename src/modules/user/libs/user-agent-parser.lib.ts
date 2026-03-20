import { Injectable } from '@nestjs/common';
import { UAParser } from 'ua-parser-js';
import { UserAgentParserPort } from '@/domains/ports/out';
import { type DeviceInfo } from '@/domains/types';

@Injectable()
export class UserAgentParser implements UserAgentParserPort {
  private readonly _parser: UAParser;

  public constructor() {
    this._parser = new UAParser();
  }

  public parse(userAgent: string): DeviceInfo {
    const parsed = this._parser.setUA(userAgent).getResult();

    return {
      browser: parsed.browser.name || 'Unknown',
      os: parsed.os.name || 'Unknown',
    };
  }
}
