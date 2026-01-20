"use client";

import IconNoYet from "@/assets/icons/NoYet";
import IconBtnLoading from "@/components/BtnLoading";
import { Card } from "@/components/ui/card";
import { useGetProductsByCategory } from "@/queries/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function Page() {
  return (
    <Suspense fallback="">
      <ProductByCategoryPage />
    </Suspense>
  );
}

function ProductByCategoryPage() {
  const { id } = useParams();
  const [take, setTake] = useState(10);
  const { data: productsData, isLoading } = useGetProductsByCategory(
    Number(id),
    take,
  );
  console.log("data", take);
  return (
    <section className="min-h-full space-y-4">
      <div>
        <Link
          href={"/category"}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-70"
        >
          <ChevronLeft className="h-6 w-6" />
          <h1 className="text-foreground text-lg font-medium md:text-xl">
            Back
          </h1>
        </Link>
      </div>
      <Card className="px-5 py-7">
        <h2 className="text-xl font-medium">Un-categorized Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 md:gap-4">
          {productsData?.data?.map((p: any) => (
            <div
              key={p.id}
              className="md:border border-b border-gray-200 md:rounded-[20px] p-4 space-y-2.5 hover:shadow-lg duration-300 max-sm:flex gap-4"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_FILEBASE_GATEWAY_PATH}/${p.images[0].url}`}
                alt="photo"
                height={195}
                width={207}
                className="rounded-[10px] md:rounded-[16px] h-[70px] max-sm:w-[70px] md:h-[195px] object-cover"
              />
              <div className="w-full flex flex-col justify-between space-y-2.5">
                <p className="text-sm truncate">{p.name}</p>
                <div className="w-full flex justify-end">
                  <Link
                    href={`/product/${p.id}`}
                    className="text-primary flex gap-1.5 items-center hover:underline"
                  >
                    Details <ChevronRight className="h-6 w-6 text-primary" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {productsData?.data?.length === 0 && !isLoading && (
          <div className="flex w-full flex-col items-center justify-center gap-5 pb-16 pt-24">
            <IconNoYet className="h-[149px] w-[200px] md:h-[225px] md:w-[300px]" />
            <span className="md:text-xl font-medium text-[#444444]">
              No un-categorized products yet
            </span>
          </div>
        )}
        {productsData?.data?.length > 10 && (
          <div className="flex justify-center">
            <button
              onClick={() => setTake(take + 10)}
              className="w-[169px] h-[41px] md:w-[215px] md:h-[47px] flex justify-center items-center rounded-[10px] bg-primary text-white md:text-lg md:font-medium hover:bg-primary/80 duration-300"
            >
              {isLoading ? <IconBtnLoading /> : "See More"}
            </button>
          </div>
        )}
      </Card>
    </section>
  );
}
