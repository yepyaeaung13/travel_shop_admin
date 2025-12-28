import {useRouter} from "next/navigation";
import {useCreateProduct, useUpdateProduct} from "@/queries/product";
import {ProductStatus} from "@/types/product";

export function useProductSubmit(id?: number) {
  const router = useRouter();
  const create = useCreateProduct();
  const update = useUpdateProduct();

  const submit = (data: any) => {
    const payload = data;
    if (id)
      update.mutate({id, payload}, {onSuccess: redirect})
    else create.mutate(payload, {onSuccess: redirect});
  };

  const saveDraft = (data: any) =>
    submit({...data, status: ProductStatus.DRAFT});

  function redirect() {
    router.push("/product");
  }

  return {
    submit,
    saveDraft,
    isLoading: create.isPending || update.isPending,
  };
}