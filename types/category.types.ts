export type Category = {
  id: number;
  name: string;
  parentId: number | null;
  image: string;
  file?: File;
  description: string;
  variations: string[];
  status: "active" | "inactive";
};

export type UpdateCategory = {
  id: number;
  name: string;
  parentId: number | null;
  image: string;
  imageUrl?: string;
  file?: File;
  description: string;
  variations: { id: number; name: string }[];
  status: "active" | "inactive";
};

export type CategoryResponse = {
  id: number;
  name: string;
  parentId: number;
  image: string;
  imageUrl: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  variations: {
    id: number;
    name: string;
  }[];
  subCategories?: Omit<CategoryResponse, "subCategories">[];
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
