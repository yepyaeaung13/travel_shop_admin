
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserType {
  CUSTOMER = "CUSTOMER",
  SELLER = "SELLER",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum LoginType {
  NORMAL = "normal",
  FACEBOOK = "facebook",
  GOOGLE = "google",
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
  region: string;
  city: string;
  township: string;
  address: string;
  type: string;
  role: string;
  status: string;
  createdAt: string;
}

export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  picture?: string | null;
  birthDate?: string | null;
  gender?: string | null;
  address?: string | null;
  loginType: LoginType;
  role: UserRole;
  type: UserType;
  status: UserStatus;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type getUsersResponse = {
  data:User[];
  message: string;
  meta: {
    skip:string;
    take:string;
    page:string;
  };
}
export type getUserResponse = {
  data:User;
  message: string;
  meta: object;
}

export type UserColumnDef = {
  id: number;
  name: string;
  phoneNumber: string | null;
  email: string;
  totalOrderAmount: number | null;
  totalOrderCount: number | null;
  status: string;
};

export enum UserSortOption {
  NAME_ASC = "nameAsc",
  NAME_DESC = "nameDesc",
  PHONE_ASC = "phoneAsc",
  PHONE_DESC = "phoneDesc",
  EMAIL_ASC = "emailAsc",
  EMAIL_DESC = "emailDesc",
  TOTAL_ORDER_COUNT_ASC = "orderCountAsc",
  TOTAL_ORDER_COUNT_DESC = "orderCountDesc",
  TOTAL_ORDER_AMOUNT_ASC = "orderAmountAsc",
  TOTAL_ORDER_AMOUNT_DESC = "orderAmountDesc",
  NEWEST = "newest",
  OLDEST = "oldest",
}
