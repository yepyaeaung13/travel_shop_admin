import React from "react";
import {
  UseFieldArrayReturn,
  UseFormReturn,
  useFieldArray,
} from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CircleXIcon, XCircleIcon } from "lucide-react";
import {
  CategoryFormType,
  VariantOptionCreateFormType,
} from "@/types/product.types";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CameraUpIcon from "@/assets/icons/CameraUpIcon";

type NestedValuesProps = {
  nestIndex: number;
  control: VariantOptionCreateFormType extends any ? any : unknown;
};

export function NestedValues({ nestIndex, control }: NestedValuesProps) {
  const { fields, append, remove } = useFieldArray<
    VariantOptionCreateFormType,
    `variantOptions.${number}.variantValues`
  >({
    control,
    name: `variantOptions.${nestIndex}.variantValues`,
  });

  const [inputValue, setInputValue] = React.useState("");

  const addTag = (val: string) => {
    const t = val.trim();
    if (t) append({ id: 0, value: t });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
      setInputValue("");
    }
  };

  const onBlur = () => {
    if (inputValue.trim() !== "") {
      addTag(inputValue);
      setInputValue("");
    }
  };

  return (
    <FormField
      control={control}
      name={`variantOptions.${nestIndex}.variantValues`}
      render={() => {
        return (
          <FormItem className="flex w-3/4 flex-col gap-2">
            <FormLabel>Option Value</FormLabel>
            {fields.length > 0 && (
              <div className="scrollbar-none bg-accent flex h-fit max-h-32 w-full flex-wrap gap-1 overflow-y-scroll rounded-[20px] border p-2">
                {fields.map((f, idx) => (
                  <Badge
                    key={f.id}
                    className="bg-primary rounded-full px-2.5 py-1 text-sm font-medium text-white"
                    asChild
                  >
                    <span className="flex gap-2 items-center ">
                      {f.value}
                      <button
                        onClick={() => remove(idx)}
                        className="no-row-click rounded-full hover:bg-black/20"
                      >
                        <XCircleIcon className="size-[18px]" />
                      </button>
                    </span>
                  </Badge>
                ))}
              </div>
            )}
            <FormControl>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={onBlur}
                placeholder="Type and press , or Enter"
                className="h-12 max-h-12 w-full min-w-[150px] flex-1 rounded-[20px] p-4"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

export default function CategoryContentDialog({
  form: catForm,
  isSubmitting,
  variantForm,
  variants,
  onSave,
  handleKeyDown,
}: {
  form: UseFormReturn<CategoryFormType>;
  variants: UseFieldArrayReturn<VariantOptionCreateFormType, "variantOptions">;
  variantForm: UseFormReturn<VariantOptionCreateFormType>;
  isSubmitting: boolean;
  onSave: (isDraft?: boolean) => void;
  handleKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  return (
    <DialogContent className="max-w-screen min-w-2xl">
      <DialogHeader>
        <DialogTitle>Add New Category</DialogTitle>
      </DialogHeader>
      <div className="max-h-[500px] space-y-4 overflow-y-auto px-4">
        <Form {...catForm}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex justify-start gap-4"
          >
            <FormField
              control={catForm.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex w-fit flex-col gap-3">
                  <FormLabel className="sr-only">Category Image</FormLabel>
                  <FormControl>
                    <label
                      htmlFor="file-upload"
                      className="w-fit cursor-pointer"
                    >
                      <Avatar className="size-12">
                        <AvatarFallback className="border- border-2 border-dashed border-[#A1A1A1]">
                          <CameraUpIcon />
                        </AvatarFallback>
                        <input
                          type="file"
                          accept="image/png, image/jpeg"
                          hidden
                          id="file-upload"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(URL.createObjectURL(file));
                            }
                          }}
                        />
                        {field.value && <AvatarImage src={field.value} />}
                      </Avatar>
                    </label>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={catForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-3 md:w-1/2">
                  <FormLabel className="sr-only">Category Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Shirts"
                      className="h-12 rounded-[20px] p-4"
                      onKeyDown={handleKeyDown}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Form {...variantForm}>
          <form onSubmit={(e) => e.preventDefault()}>
            {variants.fields.map((opt, i) => (
              <div key={opt.id} className="mb-4 flex flex-row gap-1.5 p-2">
                <FormField
                  control={variantForm.control}
                  name={`variantOptions.${i}.name`}
                  render={({ field }) => (
                    <FormItem className="flex w-1/4 flex-col items-start">
                      <FormLabel>Option Title</FormLabel>
                      <div className="relative w-full">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Color"
                            className="h-12 rounded-[20px] p-4"
                            onKeyDown={handleKeyDown}
                          />
                        </FormControl>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="absolute right-2 top-2 rounded-full"
                          onClick={() => variants.remove(i)}
                          disabled={isSubmitting}
                        >
                          <CircleXIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <NestedValues nestIndex={i} control={variantForm.control} />
              </div>
            ))}

            <FormField
              control={variantForm.control}
              name="variantOptions"
              render={() => (
                <FormItem className="w-fit">
                  <FormControl>
                    <Button
                      type="button"
                      onClick={() =>
                        variants.append({ name: "", variantValues: [] })
                      }
                      disabled={isSubmitting}
                    >
                      + Add Variant Option
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>
      <DialogFooter>
        <Button
          variant="secondary"
          type="button"
          onClick={() => onSave(true)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save as Draft"}
        </Button>
        <Button
          variant="default"
          type="button"
          onClick={() => onSave(false)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
