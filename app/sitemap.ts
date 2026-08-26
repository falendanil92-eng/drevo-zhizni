import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://solntse-drevo.ru/',
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
