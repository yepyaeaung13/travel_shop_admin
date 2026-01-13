import { IconLoading } from "@/assets/icons/IconLoading";

export default function LoadingSpinner() {
  return (
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/10">
      <button className="h-28 w-36 bg-white rounded-xl flex justify-center items-center shadow-md border border-gray-300">
        <IconLoading />
      </button>
    </div>
  );
}
