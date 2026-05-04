import type { EventFormInput, EventResponse } from "#/lib/validation/event";

import { createEventMutationOptions, updateEventMutationOptions } from "#/lib/mutations/event";
import { getCategoriesQueryOptions } from "#/lib/query/category";
import { eventFormSchema } from "#/lib/validation/event";
import { useForm } from "@tanstack/react-form-start";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Link, MapPin } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import DatePicker from "../shared/date-picker";
import ImageUploader from "../shared/image-uploader";
import { Button } from "../ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "../ui/field";
import { Input } from "../ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import CategoryForm from "./category-form";

type EventFormProps = {
  clerkUserId: string | null | undefined;
  type: "create" | "update";
  eventData?: EventResponse;
};

export default function EventForm({ clerkUserId, type, eventData }: EventFormProps) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { data: categories } = useSuspenseQuery(getCategoriesQueryOptions);

  const { mutate: createEventMutate, isPending: isCreatingEvent } = useMutation({
    ...createEventMutationOptions,
    onSuccess: ({ _id }) => {
      toast.success("Event added successfully");

      queryClient.invalidateQueries({
        queryKey: ["get", "events"],
      });

      navigate({ to: "/events/$id", params: { id: _id } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: updateEventMutate, isPending: isUpdatingEvent } = useMutation({
    ...updateEventMutationOptions(eventData ? eventData._id : ""),
    onSuccess: ({ _id }) => {
      toast.success("Event updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["get", "events"],
      });

      queryClient.invalidateQueries({
        queryKey: ["get", "event", _id],
      });

      navigate({ to: "/events/$id", params: { id: _id } });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const dateNow = useMemo(() => new Date(), []);

  const eventFormDefaultValues: EventFormInput = useMemo(
    () => ({
      title: eventData ? eventData.title : "",
      description: eventData ? eventData.description : "",
      location: eventData ? eventData.location : "",
      imageUrl: eventData ? eventData.imageUrl : "",
      startDate: eventData ? new Date(eventData.startDate) : dateNow,
      endDate: eventData ? new Date(eventData.endDate) : dateNow,
      price: eventData ? eventData.price : 0,
      isFree: eventData ? eventData.isFree : true,
      url: eventData ? eventData.url : "",
      organizer: eventData ? eventData.organizer._id : "",
      category: eventData ? eventData.category.name : "",
    }),
    [eventData, dateNow],
  );

  const eventForm = useForm({
    formId: type === "create" ? "create-event-form" : "update-event-form",
    validators: {
      onChange: eventFormSchema,
    },
    defaultValues: eventFormDefaultValues,
    onSubmit: async ({ value }) => {
      if (type === "create") {
        createEventMutate({ ...value, organizer: clerkUserId ?? "" });
      } else {
        updateEventMutate({ ...value, organizer: clerkUserId ?? "" });
      }
    },
  });

  return (
    <form
      id={type === "create" ? "create-event-form" : "update-event-form"}
      onSubmit={(e) => {
        e.preventDefault();
        eventForm.handleSubmit();
      }}
      className="mx-auto mt-6 max-w-sm"
    >
      <FieldGroup>
        <FieldSet>
          <FieldLegend>{type === "create" ? "Add New Event" : "Edit Event"}</FieldLegend>

          <FieldDescription>
            {type === "create"
              ? "Fill out the form below to create a new event. All fields are required unless marked as optional."
              : "Edit the details of your event. Make sure to save your changes when you're done."}
          </FieldDescription>

          <FieldGroup>
            <eventForm.Field
              name="title"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter event title"
                      autoComplete="off"
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="category"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>

                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>

                      <SelectContent position="item-aligned" className="p-1.5">
                        <SelectItem value="auto">Select a category</SelectItem>

                        <SelectSeparator />

                        {categories.length !== 0 ? (
                          categories.map((category) => (
                            <SelectItem key={category._id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-categories" disabled>
                            No categories available
                          </SelectItem>
                        )}

                        <SelectSeparator />

                        <CategoryForm />
                      </SelectContent>
                    </Select>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="description"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>

                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Enter event description"
                      autoComplete="off"
                      className="min-h-40"
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="imageUrl"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return <ImageUploader field={field} isInvalid={isInvalid} />;
              }}
            />

            <eventForm.Field
              name="location"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <MapPin />
                      </InputGroupAddon>

                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter event location or Online"
                        autoComplete="off"
                      />
                    </InputGroup>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="startDate"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>

                    <DatePicker field={field} text="Pick a Start Date" />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="endDate"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>End Date</FieldLabel>

                    <DatePicker field={field} text="Pick an End Date" />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="url"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>URL</FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <Link />
                      </InputGroupAddon>

                      <InputGroupInput
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter event URL"
                        autoComplete="off"
                      />
                    </InputGroup>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="price"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Price</FieldLabel>

                    <InputGroup>
                      <InputGroupAddon>
                        <span>NRs.</span>
                      </InputGroupAddon>

                      <InputGroupInput
                        id={field.name}
                        type="string"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const value = Number(e.target.value);

                          if (isNaN(value)) {
                            return;
                          }

                          if (value === 0) {
                            eventForm.setFieldValue("isFree", true);
                          } else {
                            eventForm.setFieldValue("isFree", false);
                          }

                          field.handleChange(value);
                        }}
                        aria-invalid={isInvalid}
                        placeholder="Enter event price"
                        autoComplete="off"
                      />
                    </InputGroup>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <eventForm.Field
              name="isFree"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <FieldLabel htmlFor={field.name}>
                    <Field data-invalid={isInvalid} className="cursor-pointer">
                      <FieldContent>
                        <div className="flex items-center justify-between">
                          <FieldTitle>Free Ticket?</FieldTitle>

                          <Switch
                            id={field.name}
                            name={field.name}
                            aria-invalid={isInvalid}
                            checked={field.state.value}
                            onCheckedChange={(checked) => {
                              if (checked === true) {
                                eventForm.setFieldValue("price", 0);
                              }

                              field.handleChange(checked === true);
                            }}
                          />
                        </div>

                        <FieldDescription>
                          Toggle this on if your event offers free tickets. If enabled, the price
                          field will be set to 0.
                        </FieldDescription>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                );
              }}
            />

            <Field>
              <Button
                type="submit"
                form={type === "create" ? "create-event-form" : "update-event-form"}
                disabled={isCreatingEvent || isUpdatingEvent}
              >
                {isCreatingEvent || isUpdatingEvent ? (
                  <Spinner />
                ) : type === "create" ? (
                  "Create Event"
                ) : (
                  "Save Changes"
                )}
              </Button>

              <Button
                type="reset"
                variant={"outline"}
                disabled={isCreatingEvent || isUpdatingEvent}
                onClick={() => {
                  eventForm.reset();
                  toast.success("Form reset successfully");
                }}
              >
                Reset
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </form>
  );
}
