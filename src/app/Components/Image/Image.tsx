import Image from "next/image";

export const CustomImage = ({
  ratio,
  src,
  alt = src,
  priority = false,
  className,
}: {
  ratio?: string;
  src: string;
  alt?: string;
  priority?: boolean;
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

  const width = ratio === "4/5" ? 400 : ratio === "2/3" ? 200 : 500;
  const height = ratio === "4/5" ? 500 : ratio === "2/3" ? 300 : 400;
  return (
    <Image
      className={`${aspectRatio} ${className}`}
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
    />
  );
};
