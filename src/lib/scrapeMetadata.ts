import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMetadata(url: string) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      timeout: 5000,
    });

    const $ = cheerio.load(data);

    const getMeta = (name: string, attr = 'property') => $(`meta[${attr}="${name}"]`).attr('content') || '';

    const title = getMeta('og:title') || $('title').text();
    const description = getMeta('og:description') || $('meta[name="description"]').attr('content') || '';
    const image = getMeta('og:image') || getMeta('twitter:image') || $('img').first().attr('src') || '';
    const favicon = $('link[rel="icon"]').attr('href') || $('link[rel="shortcut icon"]').attr('href') || '';

    return {
      title,
      description,
      image,
      favicon,
    };
  } catch (e) {
    console.error('❌ 메타데이터 크롤링 실패:', e);
    return {
      title: '',
      description: '',
      image: '',
      favicon: '',
    };
  }
}
