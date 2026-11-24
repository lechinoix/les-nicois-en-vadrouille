import { imageUrl, positionCss } from '@/lib/model';
export default function Photo({
  url,
  alt,
  position,
  eager = false,
  thumbnail = false,
}: {
  url: string;
  alt: string;
  position?: string | null;
  eager?: boolean;
  thumbnail?: boolean;
}) {
  return (
    <img
      src={imageUrl(url, thumbnail ? 400 : 1280)}
      srcSet={(thumbnail ? [200, 400] : [320, 640, 960, 1280, 1920, 2560])
        .map((w) => `${imageUrl(url, w)} ${w}w`)
        .join(', ')}
      sizes={thumbnail ? '(max-width: 400px) 100vw, 400px' : '100vw'}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      alt={alt}
      style={{ objectPosition: positionCss(position) }}
    />
  );
}
