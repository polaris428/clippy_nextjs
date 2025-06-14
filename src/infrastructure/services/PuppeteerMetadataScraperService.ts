import { injectable } from 'tsyringe';
import { IMetadataScraperService } from '@/domain/services/IMetadataScraperService';
import { scrapeMetadata } from '@/lib/scrapeMetadata'; // 기존 함수 재사용
import { MetadataResult } from '@/types/MetadataResult';

@injectable()
export class PuppeteerMetadataScraperService implements IMetadataScraperService {
  async scrape(url: string): Promise<MetadataResult> {
    return scrapeMetadata(url);
  }
}
