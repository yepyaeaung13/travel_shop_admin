import axiosClient from "@/lib/axios";

export enum PageType {
  login = "login",
  home = "home",
  category = "category",
  landing = "landing",
}

export enum DeviceType {
  mobile = "mobile",
  web = "web",
}

export enum MediaType {
  image = "image",
  video = "video",
}

export enum BannerType {
  default = "default",
  hero = "hero",
  ads = "ads",
}

export enum LandingDataType {
  banner = "banner",
  announcement = "announcement",
}

export type CreateBannerInput = {
  image: string | null;
  order: number;
  file?: File | null;
  pageType: PageType;
  mediaType: MediaType;
  deviceType: DeviceType;
  bannerType: BannerType;
}[];

export type UpdateBannerInput = {
  id: number;
  image: string | null;
  order: number;
  file?: File | null;
  pageType: PageType;
  mediaType: MediaType;
  deviceType: DeviceType;
  bannerType: BannerType;
}[];

export type CreateLandingInput = {
  assets: {
    image: string;
    order: number;
    file?: File | null;
    mediaType: MediaType;
    deviceType: DeviceType;
    bannerType: LandingDataType;
    text: string;
  }[];
};

export type UpdateLandingInput = {
  assets: {
    id: number;
    image: string;
    order: number;
    file?: File;
    mediaType: MediaType;
    deviceType: DeviceType;
    bannerType: LandingDataType;
    text: string;
  }[];
};

export type CreatePolicyInput = {
  title: string;
  description: string;
};

export type UpdatePolicyInput = {
  id: number;
  title: string;
  description: string;
};

export const getBanners = async () => {
  const res = await axiosClient.get("/v1/web/banners");
  return res.data;
};

export const createBanners = async (
  banners: CreateBannerInput,
  announceText?: {
    text: string;
  },
) => {
  const res = await axiosClient.post("/v1/web/banners", {
    announceText,
    banners,
  });
  return res.data;
};

export const updateBanners = async (
  banners: UpdateBannerInput,
  announceText?: {
    text: string;
    id: number;
  },
) => {
  const res = await axiosClient.put("/v1/web/banners", { announceText, banners });
  return res.data;
};

export const getPolicy = async () => {
  const res = await axiosClient.get("/v1/web/policy");
  return res.data;
};

export const createPolicy = async (payload: CreatePolicyInput) => {
  const res = await axiosClient.post("/v1/web/policy", payload);
  return res.data;
};

export const updatePolicy = async (payload: UpdatePolicyInput) => {
  const res = await axiosClient.put("/v1/web/policy", payload);
  return res.data;
};
