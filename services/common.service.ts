import axiosClient from "@/lib/axios";

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosClient.post("/v1/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}
