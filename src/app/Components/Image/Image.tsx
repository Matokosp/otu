import Image from "next/image";

export const CustomImage = ({
  ratio,
  src,
  alt = src,
  className,
  fill = false,
  priority = false,
  quality = 75,
  sizes,
}: {
  ratio?: string;
  src: string;
  alt?: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}) => {
  const aspectRatio =
    ratio === ratio && ratio === "4/5"
      ? "aspect-[4/5]"
      : ratio === "2/3"
      ? "aspect-[2/3]"
      : ratio === "5/4"
      ? "aspect-[5/4]"
      : "";

  const width = ratio === "4/5" ? 800 : ratio === "2/3" ? 400 : 1000;
  const height = ratio === "4/5" ? 1000 : ratio === "2/3" ? 600 : 800;

  const defaultSizes = sizes || "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} object-cover`}
        priority={priority}
        quality={quality}
        sizes={defaultSizes}
      />
    );
  }

  return (
    <Image
      className={`${aspectRatio} ${className}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      sizes={defaultSizes}
    />
  );
};
