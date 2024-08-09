"use client";

import { createEventAction } from "@/lib/actions/create-event-action";
import { event as eventValidation } from "@/lib/validations/constants";
import {
  createEventSchema,
  CreateEventSchema,
} from "@/lib/validations/event-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { TextAreaWithCounter } from "../TextAreaWithCounter";
import { Button } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

type Props = {
  onSuccess?: () => void;
};

export const CreateEventForm = ({ onSuccess: handleSuccess }: Props) => {
  const form = useForm<CreateEventSchema>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      title: "",
    },
    mode: "onSubmit",
  });

  const { execute, isExecuting } = useAction(createEventAction, {
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Failed to create the event!",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({ title: "Your event has been created 🎉" });
    },
    onSettled: () => form.reset(),
  });

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  const onSubmit = async (values: CreateEventSchema) => execute(values);

  return (
    <FormProvider {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Name</FormLabel>

              <FormControl>
                <Input
                  type="text"
                  disabled={isFieldDisabled}
                  placeholder="e.g. Engineering Meeting"
                  maxLength={eventValidation.displayName.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.title?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <FormField
          name="shortDescription"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Description</FormLabel>

              <FormControl>
                <TextAreaWithCounter
                  disabled={isFieldDisabled}
                  placeholder="What is your event about?"
                  maxLength={eventValidation.shortDescription.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.shortDescription?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full mt-10"
          disabled={isFieldDisabled}
        >
          {isExecuting ? "Creating event..." : "Create Event"}
        </Button>
      </form>
    </FormProvider>
  );
};
