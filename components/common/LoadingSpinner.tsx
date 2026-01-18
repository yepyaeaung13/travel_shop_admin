import { useEffect } from "react";
import { IconLoading } from "@/assets/icons/IconLoading";

export default function LoadingSpinner() {
  useEffect(() => {
    // Disable scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // Restore scroll
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
      <div className="h-28 w-36 bg-white rounded-xl flex justify-center items-center shadow-md border border-gray-300">
        <IconLoading />
      </div>
    </div>
  );
}
