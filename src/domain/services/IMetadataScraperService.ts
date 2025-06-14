import { MetadataResult } from '@/types/MetadataResult';

export interface IMetadataScraperService {
  scrape(url: string): Promise<MetadataResult>;
}
