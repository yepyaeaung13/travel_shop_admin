import React, { SVGProps } from "react";

const IconSortDownArrow = (props: SVGProps<SVGSVGElement>) => {
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
        d="M3 9H14M3 15H10M3 3H19M18.5 21V9M18.5 21C17.8 21 16.491 19.006 16 18.5M18.5 21C19.2 21 20.509 19.006 21 18.5"
        stroke="#3C3C3C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconSortDownArrow;
