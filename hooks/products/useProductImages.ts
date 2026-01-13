
export type ProductImage = {
  url: string;
  isMain: boolean;
  file: File;
};

interface UseProductImagesParams {
  images: ProductImage[];
  maxImages: number;
  onChange: (next: ProductImage[]) => void;
}

export function useProductImages({
  images,
  maxImages,
  onChange,
}: UseProductImagesParams) {
  const hasPrimary = images.some((img) => img.isMain);
  const showcase =
    images.find((img) => img.isMain) ?? images[0] ?? null;

  const addFiles = (files: File[]) => {
    const remainingSlots = maxImages - images.length;

    if (files.length > remainingSlots) {
      alert(
        `You can only upload ${remainingSlots} more image${
          remainingSlots !== 1 ? "s" : ""
        }`,
      );
      return;
    }

    const nextImages: ProductImage[] = files.map((file, index) => ({
      url: URL.createObjectURL(file),
      // First image ever becomes primary
      isMain: !hasPrimary && index === 0,
      file: file,
    }));

    onChange([...images, ...nextImages]);
  };

  const removeImage = (url: string) => {
    const target = images.find((img) => img.url === url);
    if (!target) return;

    // 🚫 Rule: Primary image OR the current showcase cannot be removed
    if (target.isMain || showcase?.url === url) {
      return;
    }

    const nextImages = images.filter((img) => img.url !== url);
    onChange(nextImages);
    URL.revokeObjectURL(url);
  };

  const setShowcase = (url: string) => {
    onChange(
      images.map((img) => ({
        ...img,
        isMain: img.url === url,
      })),
    );
  };

  const replaceMainImage = (file: File) => {
    console.log("replace main image", showcase,hasPrimary);
    if (!showcase) return;

    // Revoke the old showcase URL to free memory
    URL.revokeObjectURL(showcase.url);

    const nextImages = images.map((img) => {
      if (img.url === showcase.url) {
        return {
          ...img,
          url: URL.createObjectURL(file),
        };
      }
      return img;
    });

    onChange(nextImages);
  };

  const others = showcase
    ? images.filter((img) => img.url !== showcase.url)
    : [];

  return {
    showcase,
    others,
    addFiles,
    removeImage,
    setShowcase,
    replaceMainImage,
  };
}