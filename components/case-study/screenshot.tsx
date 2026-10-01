import Image from "next/image";

export function Screenshot({
  src,
  alt,
  width,
  height,
  caption,
}: {
  src: string;
  alt: string;
  /** Strings, because MDX props here can't be JS expressions. */
  width: number | string;
  height: number | string;
  caption?: string;
}) {
  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-lg border border-white/10">
        <Image
          src={src}
          alt={alt}
          width={Number(width)}
          height={Number(height)}
          sizes="(min-width: 768px) 768px, 100vw"
          className="h-auto w-full"
        />
      </div>
      {caption && <figcaption className="mt-3 font-mono text-xs text-fog/70">{caption}</figcaption>}
    </figure>
  );
}
