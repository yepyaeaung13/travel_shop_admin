
export type ProductImage = {
  url: string;
  isMain: boolean;
  file: File;
};

interface UseProductImagesParams {
  maxImages: number;
}

export function useProductImages({
  maxImages
}: UseProductImagesParams) {

  const addFiles = (files: File[]) => {

    // add product image to state
  };

  const removeImage = (url: string) => {
    // remove product image from state
    URL.revokeObjectURL(url);
  };

  const replaceMainImage = (file: File) => {

    // add image to the state
  };

  return {
    addFiles,
    removeImage,
    replaceMainImage,
  };
}