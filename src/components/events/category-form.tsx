import type { CreateCategoryInput } from "#/lib/validation/category";

import { createCategoryMutationOptions } from "#/lib/mutations/category";
import { createCategorySchema } from "#/lib/validation/category";
import { useForm } from "@tanstack/react-form-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

export default function CategoryForm() {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    ...createCategoryMutationOptions,
    onSuccess: () => {
      toast.success("Category added successfully");

      queryClient.invalidateQueries({
        queryKey: ["get", "categories"],
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const categoryFormDefaultValues: CreateCategoryInput = {
    name: "",
  };

  const categoryForm = useForm({
    formId: "create-category-form",
    validators: {
      onChange: createCategorySchema,
    },
    defaultValues: categoryFormDefaultValues,
    onSubmit: ({ value }) => {
      mutate(value);
    },
  });

  return (
    <Dialog>
      <form
        id="create-category-form"
        onSubmit={(e) => {
          e.preventDefault();
          categoryForm.handleSubmit();
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Add Category
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>

            <DialogDescription>
              Enter the name of the new category you want to add.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <categoryForm.Field
              name="name"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category Name</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="e.g. Technology"
                      autoComplete="off"
                      autoFocus
                      onKeyDown={(e) => e.stopPropagation()}
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" form="create-category-form" disabled={isPending}>
              {isPending ? <Spinner /> : "Add Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
