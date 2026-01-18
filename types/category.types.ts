export type Category = {
  id?: number;
  name: string;
  bannerImage: string;
  image: string;
  status: "active" | "inactive";
};

export type SubCategory = {
  id?: number;
  name: string;
  image: string;
  file?: File;
};

export type UpdateSubCategory = {
  id?: number;
  name: string;
  image: string;
  file?: File;
};

export type CategoryResponse = {
  id: number;
  name: string;
  bannerImage: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  subCategories?: Omit<CategoryResponse, "subCategories">[];
  products: any[];
  status: "active" | "inactive";
};

export type CategoryListResponse = {
  success: boolean;
  message: string;
  data: CategoryResponse[];
  meta: any;
};

export type CategoryGetResponse = {
  success: boolean;
  message: string;
  data: CategoryResponse;
  meta: any;
};
