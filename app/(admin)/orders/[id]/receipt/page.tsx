"use client";

import IconSaveImage from "@/assets/icons/order/IconSaveImage";
import { Button } from "@/components/ui/button";
import { useGetOrderDetail } from "@/queries/order";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { Suspense, useRef } from "react";

export default function Page() {
  return (
    <Suspense fallback="">
      <ReceiptPage />
    </Suspense>
  );
}

const ReceiptPage = () => {
  const router = useRouter();
  const { id } = useParams();

  // const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  const receiptRef = useRef<HTMLDivElement | null>(null);

  const { data: orderDetail, isLoading } = useGetOrderDetail(Number(id));

  const isCODPayment = orderDetail?.data?.payment?.methodName
    ?.toLowerCase()
    .includes("cod");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 overflow-x-auto">
      {/* Receipt Paper */}
      <div className="mx-auto min-w-[726px]">
        <div
          ref={receiptRef}
          id="receipt"
          style={{
            width: "100%",
            maxWidth: "726px",
            padding: "30px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* HEADER */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "30px",
            }}
          >
            {/* LEFT SIDE */}
            <div style={{ width: "230px", textAlign: "center" }}>
              <Image
                src="/images/logo.png"
                alt="logo"
                width={100}
                height={100}
                style={{
                  margin: "0 auto",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => router.push("/")}
              />

              <div
                style={{
                  marginTop: "10px",
                  fontSize: "14px",
                  color: "#303030",
                }}
              >
                <div>Travel Shop</div>
                <div>09987654321</div>
                <div>example@gmail.com</div>
                <div>12-A Bawdi Yeiktha Street Bahan Tsp, Yangon, Myanmar</div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                Order ID - #{orderDetail?.data?.id.toString().padStart(3, "0")}
              </div>
              <div style={{ fontSize: "14px", color: "#3C3C3C" }}>
                {dayjs(orderDetail?.data?.createdAt).format(
                  "DD MMM YYYY [at] hh:mm a",
                )}
              </div>
            </div>
          </div>

          {/* SHIPPING + PAYMENT */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "30px",
            }}
          >
            <div style={{ fontSize: "14px" }}>
              <div>
                <span style={{ color: "#3C3C3C" }}>Name - </span>
                {orderDetail?.data?.deliveryContactPersion}
              </div>
              <div>
                <span style={{ color: "#3C3C3C" }}>Phone - </span>
                {orderDetail?.data?.deliveryContactNumber}
              </div>
              <div>
                <span style={{ color: "#3C3C3C" }}>Address - </span>
                {orderDetail?.data?.deliveryAddress}
              </div>
            </div>

            {/* PAYMENT BADGE */}
            <div
              style={{
                border: `6px solid ${isCODPayment ? "#616FF5" : "#126D00"}`,
                padding: "4px",
                borderRadius: "6px",
              }}
            >
              <div
                style={{
                  border: `4px solid ${isCODPayment ? "#616FF5" : "#126D00"}`,
                  color: isCODPayment ? "#616FF5" : "#126D00",
                  fontSize: "32px",
                  fontWeight: "bold",
                  width: "140px",
                  height: "46px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isCODPayment ? "COD" : "PAID"}
              </div>
            </div>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingBottom: "10px" }}>
                  Item description
                </th>
                <th
                  style={{
                    backgroundColor: "rgba(46,110,255,0.1)",
                    textAlign: "right",
                    padding: "10px",
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    backgroundColor: "rgba(46,110,255,0.1)",
                    textAlign: "center",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    backgroundColor: "rgba(46,110,255,0.1)",
                    textAlign: "right",
                    paddingRight: "10px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {orderDetail?.data?.items.map((item: any) => (
                <tr key={item.id}>
                  <td
                    style={{
                      borderBottom: "1px solid rgba(60,60,60,0.2)",
                      padding: "10px 0",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{item.name}</div>
                    <div style={{ color: "#3C3C3C" }}>{item.variant}</div>
                  </td>

                  <td
                    style={{
                      backgroundColor: "rgba(46,110,255,0.1)",
                      borderBottom: "1px solid rgba(60,60,60,0.2)",
                      textAlign: "right",
                      padding: "10px",
                    }}
                  >
                    {Number(item.price).toLocaleString()} Ks
                  </td>

                  <td
                    style={{
                      backgroundColor: "rgba(46,110,255,0.1)",
                      borderBottom: "1px solid rgba(60,60,60,0.2)",
                      textAlign: "center",
                    }}
                  >
                    {item.qty}
                  </td>

                  <td
                    style={{
                      backgroundColor: "rgba(46,110,255,0.1)",
                      borderBottom: "1px solid rgba(60,60,60,0.2)",
                      textAlign: "right",
                      paddingRight: "10px",
                    }}
                  >
                    {Number(item.total).toLocaleString()} Ks
                  </td>
                </tr>
              ))}

              {/* SUBTOTAL */}
              <tr>
                <td />
                <td
                  style={{
                    backgroundColor: "rgba(46,110,255,0.1)",
                    padding: "10px",
                  }}
                >
                  Subtotal <br /> Shipping Fee
                </td>
                <td style={{ backgroundColor: "rgba(46,110,255,0.1)" }} />
                <td
                  style={{
                    backgroundColor: "rgba(46,110,255,0.1)",
                    textAlign: "right",
                    paddingRight: "10px",
                  }}
                >
                  {Number(orderDetail?.data?.subTotalAmount).toLocaleString()}{" "}
                  Ks
                  <br />
                  {Number(orderDetail?.data?.deliveryFee).toLocaleString()} Ks
                </td>
              </tr>

              {/* TOTAL */}
              <tr>
                <td />
                <td
                  style={{
                    backgroundColor: "#2E6EFF",
                    color: "#ffffff",
                    fontWeight: "bold",
                    padding: "15px",
                  }}
                >
                  Total
                </td>
                <td style={{ backgroundColor: "#2E6EFF" }} />
                <td
                  style={{
                    backgroundColor: "#2E6EFF",
                    color: "#ffffff",
                    fontWeight: "bold",
                    textAlign: "right",
                    paddingRight: "10px",
                  }}
                >
                  {Number(orderDetail?.data?.totalAmount).toLocaleString()} Ks
                </td>
              </tr>
            </tbody>
          </table>

          {/* FOOTER */}
          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
              fontSize: "12px",
              color: "#3C3C3C",
            }}
          >
            Thank You For Shopping With Travel Shop
          </div>
        </div>
      </div>
      {/* Actions Buttons */}
      <div className="mx-auto">
        <div className="flex items-center gap-2.5">
          <Button
            onClick={() => router.back()}
            className="flex h-10 flex-1 items-center justify-center bg-[#A1A1A1] text-sm text-white hover:bg-[#A1A1A1]/80 md:text-base"
          >
            <span>Cancel</span>
          </Button>
          <Button
            onClick={handlePrint}
            className="flex h-10 flex-1 items-center justify-center gap-2.5 bg-[#2E6EFF] text-sm text-white hover:bg-[#2E6EFF]/80 md:text-base"
          >
            <IconSaveImage className="size-5 stroke-white" />
            <span>Save receipt</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
