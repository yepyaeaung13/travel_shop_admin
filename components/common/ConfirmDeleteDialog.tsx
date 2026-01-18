import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import IconDeleteConfirm from "../DeleteConfirm";
import IconLoading from "../Loading";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  loading: boolean;
  callback: () => void;
  title?: string;
  description?: string;
};
export default function ConfirmDeleteDialog({
  open,
  setOpen,
  loading,
  callback,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone",
}: Props) {
  return (
    <Dialog open={open} onOpenChange={loading ? () => {} : setOpen}>
      <DialogContent className="flex w-[440px] flex-col items-center justify-center gap-7 rounded-[10px]">
        <DialogHeader className="gap-1">
          <div className="mb-7 flex justify-center">
            <IconDeleteConfirm className="" />
          </div>
          <DialogTitle className="text-lg font-semibold text-[#1E1E1E] md:text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-base text-[#1E1E1E] md:text-lg">
            {description}
          </DialogDescription>
        </DialogHeader>
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
              className="h-auto w-[47%] rounded-[10px] bg-[#FF3333] py-2 text-white text-base hover:bg-[#FF3333] md:text-lg cursor-pointer"
            >
              {loading ? <IconLoading className="size-6" /> : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
