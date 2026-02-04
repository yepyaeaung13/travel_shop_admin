"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckIcon, Edit, MapPin, Navigation, XIcon } from "lucide-react";
import React, { useEffect } from "react";
import OrderNote from "./order-note";

const ShippingAddress = () => {
  const [notes, setNotes] = React.useState<string>("");
  const [editNotes, setEditNotes] = React.useState<string>("");

  // validation errors
  const [notesError, setNotesError] = React.useState<string>("");

  const notesRef = React.useRef<HTMLTextAreaElement | null>(null);

  const [isSaving, setIsSaving] = React.useState(false);

  // useEffect(() => {
  //   setNotes(order.notes ?? "");
  // }, [order.notes]);

  const handleUpdate = async () => {};

  return (
    <>
      {/* Notes area */}
      {false ? (
        <OrderNote note={notes} />
      ) : (
        <div className="bg-card space-y-2.5 rounded-b-md border-t px-4 md:px-5 pb-5">
          <h3 className="text-custom-dark-gray pt-5 text-lg font-medium">
            Notes
          </h3>
          <textarea
            ref={notesRef}
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            placeholder="Add order notes..."
            aria-label="Order notes"
            aria-invalid={Boolean(notesError)}
            className="text-custom-dark-gray min-h-[96px] w-full resize-none rounded-[10px]
              bg-gray-200 p-4 text-base leading-relaxed dark:bg-gray-800"
            maxLength={500}
          />
          {notesError ? (
            <p className="mt-1 text-sm text-red-500">{notesError}</p>
          ) : null}
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-1 h-10 md:h-12 w-full flex-1 rounded-[10px] text-lg">
            Add note
          </Button>
        </div>
      )}
    </>
  );
};

export default ShippingAddress;
