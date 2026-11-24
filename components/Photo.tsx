import { imageUrl, positionCss } from '@/lib/model';
export default function Photo({
  url,
  alt,
  position,
  eager = false,
}: {
  url: string;
  alt: string;
  position?: string | null;
  eager?: boolean;
}) {
  return (
    <img
      src={imageUrl(url, 1280)}
      srcSet={[320, 640, 960, 1280, 1920, 2560]
        .map((w) => `${imageUrl(url, w)} ${w}w`)
        .join(', ')}
      sizes="(max-width: 700px) 100vw, 80vw"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      alt={alt}
      style={{ objectPosition: positionCss(position) }}
    />
  );
}
