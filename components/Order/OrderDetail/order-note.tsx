import React from "react";

const OrderNote = ({ note }: { note: string }) => {
  return (
    <div className="bg-card space-y-2.5 rounded-b-md border-t px-5 pb-5">
      <h3 className="text-custom-dark-gray pt-5 text-lg font-medium">Notes</h3>
      <p className="text-custom-dark-gray rounded-[10px] bg-gray-200 p-4 text-base leading-relaxed dark:bg-gray-800">
        {note}
      </p>
    </div>
  );
};

export default OrderNote;
