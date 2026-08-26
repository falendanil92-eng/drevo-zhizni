import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://solntse-drevo.ru/sitemap.xml',
    host: 'https://solntse-drevo.ru',
  };
}
