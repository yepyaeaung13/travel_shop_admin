import React, { SVGProps } from "react";

type CameraIconProps = {
  className?: string;
};

export const CameraIcon = ({ className }: CameraIconProps) => {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width={40} height={40} rx={20} fill="#616FF5" />
      <path
        d="M14.7602 30H25.2402C28.0002 30 29.1002 28.31 29.2302 26.25L29.7502 17.99C29.8902 15.83 28.1702 14 26.0002 14C25.3902 14 24.8302 13.65 24.5502 13.11L23.8302 11.66C23.3702 10.75 22.1702 10 21.1502 10H18.8602C17.8302 10 16.6302 10.75 16.1702 11.66L15.4502 13.11C15.1702 13.65 14.6102 14 14.0002 14C11.8302 14 10.1102 15.83 10.2502 17.99L10.7702 26.25C10.8902 28.31 12.0002 30 14.7602 30Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 16H21.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 26C21.79 26 23.25 24.54 23.25 22.75C23.25 20.96 21.79 19.5 20 19.5C18.21 19.5 16.75 20.96 16.75 22.75C16.75 24.54 18.21 26 20 26Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const EditIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
        stroke="#3C3C3C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0418 3.01928L8.16183 10.8993C7.86183 11.1993 7.56183 11.7893 7.50183 12.2193L7.07183 15.2293C6.91183 16.3193 7.68183 17.0793 8.77183 16.9293L11.7818 16.4993C12.2018 16.4393 12.7918 16.1393 13.1018 15.8393L20.9818 7.95928C22.3418 6.59928 22.9818 5.01928 20.9818 3.01928C18.9818 1.01928 17.4018 1.65928 16.0418 3.01928Z"
        stroke="#3C3C3C"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9102 4.15039C15.5802 6.54039 17.4502 8.41039 19.8502 9.09039"
        stroke="#3C3C3C"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
