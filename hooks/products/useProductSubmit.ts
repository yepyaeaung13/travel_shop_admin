import { useRouter } from "next/navigation";
import { useCreateProduct, useUpdateProduct } from "@/queries/product";
import { ProductStatus } from "@/types/product";
import { uploadImage } from "@/services/common.service";

export function useProductSubmit(id?: number) {
  const router = useRouter();
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const submit = async (data: any) => {
    let payload = data;
    console.log("data", data);
    return;
    const images = await Promise.all(
      payload.images.map(async (img: any) => {
        const res = await uploadImage(img.file);
        const url = res?.data?.key;
        return { url, isMain: img.isMain };
      })
    );
    // overwrite images with url key
    payload = {
      ...payload,
      images,
    };
    
    if (id) update.mutate({ id, payload }, { onSuccess: redirect });
    else create.mutate(payload, { onSuccess: redirect });
  };

  const saveDraft = (data: any) =>
    submit({ ...data, status: ProductStatus.INACTIVE });

  function redirect() {
    router.push("/product");
  }

  return {
    submit,
    saveDraft,
    isLoading: create.isPending || update.isPending,
  };
}
