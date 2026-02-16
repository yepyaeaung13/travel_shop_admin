export type UpdatePaymentType = {
  name: string;
  image: string;
  qrCode: string | null;
  accountName: string;
  accountNumber: string;
  status: boolean;
};

export type UpdateStatusPaymentType = {
  status: boolean;
};
