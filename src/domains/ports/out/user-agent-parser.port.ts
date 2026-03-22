import { DeviceInfo } from '@/domains/types';

export interface UserAgentParserPort {
  parse(userAgent: string): DeviceInfo;
}
