import Image from "next/image";

export const CustomImage = ({
  ratio,
  src,
  alt = src,
  className,
}: {
  ratio?: string;
  src: string;
  alt?: string;
  className?: string;
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
  return (
    <Image
      className={`${aspectRatio} ${className}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      quality={100}
    />
  );
};
