import Image from 'next/image';
import type { Photo } from '@/lib/catalogue';

/** A photograph, resized on the way and cropped around the cat instead of
    around the middle of the frame. One from the first source arrives from its
    CDN; one from Commons is a file in public/commons. */
export function CatPhoto({ photo, alt, sizes, lead = false }: { photo: Photo; alt: string; sizes: string; lead?: boolean }) {
  return (
    <Image
      src={photo.url}
      alt={alt}
      width={photo.w}
      height={photo.h}
      sizes={sizes}
      quality={82}
      preload={lead}
      loading={lead ? 'eager' : 'lazy'}
      style={{ objectPosition: `${photo.fx ?? 50}% ${photo.fy ?? 40}%` }}
    />
  );
}
