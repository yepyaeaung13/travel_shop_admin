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
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  callback: () => void;
  loading: boolean;
  title?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
};
export default function ConfirmDialog({
  open,
  setOpen,
  callback,
  loading,
  title,
  description,
  className,
  titleClassName,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={loading ? () => {} : setOpen}>
      <DialogContent
        className={cn(
          "flex w-[440px] flex-col items-center justify-center p-5 gap-5 rounded-[10px]",
          className,
        )}
      >
        {title && (
          <p
            className={cn(
              "pt-5 w-full max-w-[306px] text-center text-base font-semibold text-[#1E1E1E] md:text-lg",
              titleClassName,
            )}
          >
            {title}
          </p>
        )}
        {description && (
          <DialogDescription className="text-center text-sm font-normal text-[#3C3C3C] md:text-base -mt-2.5">
            {description}
          </DialogDescription>
        )}
        <DialogFooter className="w-full">
          <div className="flex w-full justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="h-auto w-[47%] rounded-[10px] bg-[#44444480] hover:bg-[#44444490] hover:text-white border-none py-2 text-base text-white md:text-lg cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={callback}
              disabled={loading}
              className="bg-primary hover:bg-primary text-white h-auto w-[47%] rounded-[10px] py-2 text-base hover:opacity-80 md:text-lg cursor-pointer"
            >
              {loading ? <IconLoading className="size-6" /> : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
