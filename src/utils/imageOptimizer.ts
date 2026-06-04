interface OptimizeImageOptions {
  maxDimension?: number;
  quality?: number;
  fileName?: string;
}

const DEFAULT_MAX_DIMENSION = 1600;
const DEFAULT_QUALITY = 0.82;

const getTargetSize = (width: number, height: number, maxDimension: number) => {
  const longestSide = Math.max(width, height);

  if (longestSide <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / longestSide;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
};

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("이미지를 불러오지 못했습니다."));
    };
    image.src = url;
  });

export const optimizeImageFile = async (
  file: File,
  options: OptimizeImageOptions = {},
) => {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const maxDimension = options.maxDimension ?? DEFAULT_MAX_DIMENSION;
  const quality = options.quality ?? DEFAULT_QUALITY;
  const image = await loadImage(file);
  const { width, height } = getTargetSize(
    image.naturalWidth,
    image.naturalHeight,
    maxDimension,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return file;
  }

  ctx.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File(
    [blob],
    options.fileName || file.name.replace(/\.[^.]+$/, ".jpg"),
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    },
  );
};
