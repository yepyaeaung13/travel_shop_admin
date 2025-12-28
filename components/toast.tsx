import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import React from "react";

export function successToast(title: string, desc?: string) {
  toast.custom(
    () => (
      <div className="flex items-start gap-3 bg-green-50 border border-green-400 text-green-800 shadow-lg rounded-xl p-4 w-full max-w-sm">
        <CheckCircle2 className="w-6 h-6 text-green-600 mt-1" />
        <div className="flex flex-col">
          <p className="font-semibold text-green-700">{title}</p>
          {desc && <p className="text-sm text-green-600">{desc}</p>}
        </div>
      </div>
    ),
    {
      duration: 4000, // 4 seconds
    }
  );
}

export function errorToast(title: string, desc?: string) {
  toast.custom(
    () => (
      <div className="flex items-start gap-3 bg-red-50 border border-red-400 text-red-800 shadow-lg rounded-xl p-4 w-full max-w-sm">
        <XCircle className="w-6 h-6 text-red-600 mt-1" />
        <div className="flex flex-col">
          <p className="font-semibold text-red-700">{title}</p>
          {desc && <p className="text-sm text-red-600">{desc}</p>}
        </div>
      </div>
    ),
    {
      duration: 4000, // 4 seconds
    }
  );
}
