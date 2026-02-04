import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Mail, MapPin, Smartphone } from "lucide-react";

const CustomerDetail = ({ order }: { order: any }) => {
  return (
    <>
      <div className="bg-card space-y-2.5 md:space-y-5 rounded-t-md pb-4 md:pb-5">
        <h3 className="text-custom-dark-gray border-b p-4 md:p-5 text-xl font-medium">
          Customer details
        </h3>

        <div className="flex items-center gap-3 px-4 md:px-5">
          <Avatar className="h-18 w-18">
            <AvatarImage
              src="/placeholder.svg?height=70&width=70"
              alt="user"
            />
            <AvatarFallback>{order?.user?.name?.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <span className="text-custom-dark-gray text-lg font-medium">
              {order?.user?.name}
            </span>
            <span className="text-custom-dark-gray text-base font-normal">
              ID: #{order?.user?.id?.toString().padStart(5, "0")}
            </span>
          </div>
        </div>

        <div className="space-y-1 md:space-y-2.5 px-4 md:px-5">
          <div className="flex items-center gap-2.5">
            <Mail className="text-custom-dark-gray h-6 w-6" />
            <span className="text-custom-dark-gray text-base font-normal">
              {order?.user?.email}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Smartphone className="text-custom-dark-gray h-6 w-6" />
            <span className="text-custom-dark-gray text-base font-normal">
              {order?.user?.phoneNumber}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-card space-y-2.5 md:space-y-5 pb-4 md:pb-5">
        <div className="flex items-center justify-between border-t px-4 md:px-5 pt-4 md:pt-5">
          <h3 className="text-custom-dark-gray text-xl font-medium">
            Shipping address
          </h3>
        </div>

        <div className="space-y-1 md:space-y-2.5">
          <div className="flex gap-3 px-5">
            <MapPin className="text-custom-dark-gray mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="text-custom-dark-gray space-y-1 text-sm">
              <p>
                 {order?.address?.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerDetail;
