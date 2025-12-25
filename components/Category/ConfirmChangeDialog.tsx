import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import IconLoading from "../Loading";

type Props = {
  status: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  loading: boolean;
  callback: () => void;
};
export default function ConfirmChangeDialog({
  status,
  open,
  setOpen,
  loading,
  callback,
}: Props) {
  const itemStatus = status === "active" ? "publish" : "unpublish";
  const newStatus = status === "active" ? "unpublish" : "publish";
  return (
    <Dialog open={open} onOpenChange={loading ? () => {} : setOpen}>
      <DialogContent className="flex w-[440px] flex-col items-center justify-center gap-7 rounded-[10px]">
        <DialogHeader>
          <DialogTitle className="pt-5 text-center text-lg font-semibold text-[#1E1E1E] md:text-xl">
            Are you sure you want to change from {itemStatus} to {newStatus}?
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          {itemStatus === "publish"
            ? "This blog will be visible to the public."
            : "This blog will be hidden from the public."}
        </DialogDescription>
        <DialogFooter className="w-full">
          <div className="flex w-full justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-auto w-[47%] rounded-[10px] bg-[#44444480] py-2 text-base text-white md:text-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={callback}
              disabled={loading}
              className="bg-primary hover:bg-primary text-white h-auto w-[47%] rounded-[10px] py-2 text-base hover:opacity-80 md:text-lg cursor-pointer"
            >
              {loading ? <IconLoading className="size-6" /> : "Change"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
