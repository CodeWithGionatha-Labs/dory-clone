import { createLivePollAction } from "@/lib/actions/create-live-poll-action";
import { poll } from "@/lib/validations/constants";
import {
  createLivePollSchema,
  CreateLivePollSchema,
} from "@/lib/validations/poll-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Event } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
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
  eventId: Event["id"];
  onSuccess?: () => void;
};

export const CreatePollForm = ({
  eventId,
  onSuccess: handleSuccess,
}: Props) => {
  const form = useForm<CreateLivePollSchema>({
    resolver: zodResolver(createLivePollSchema),
    defaultValues: {
      body: "",
      options: ["option 1", "option 2"],
      eventId,
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    // @ts-ignore
    name: "options",
  });

  const { execute, isExecuting } = useAction(createLivePollAction, {
    onError: (err) => {
      console.error(err);

      toast({
        title: "Something went wrong",
        description: `Failed to create the poll. ${err.error.serverError}`,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      handleSuccess?.();

      toast({
        title: "Your poll has been created 🎉",
      });
    },
    onSettled: () => form.reset(),
  });

  const onSubmit = async (values: CreateLivePollSchema) => execute(values);

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="body"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>

              <FormControl>
                <TextAreaWithCounter
                  disabled={isFieldDisabled}
                  placeholder="e.g. What is your favorite color?"
                  maxLength={poll.body.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.body?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <div role="list" className="mt-8 space-y-4">
          <FormLabel className="block">
            Options (max {poll.options.maxCount})
          </FormLabel>

          <FormMessage className="error-msg">
            {form.formState.errors.options?.root?.message}
          </FormMessage>

          {fields.map((field, index) => (
            <FormField
              key={field.id}
              name={`options.${index}`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-x-2 items-center">
                      <span className="grow-0">{index + 1}.</span>

                      <Input
                        placeholder="e.g. Blue"
                        maxLength={poll.options.maxLength}
                        {...field}
                      />

                      <Button
                        size={"sm"}
                        type="button"
                        variant={"outline"}
                        disabled={isFieldDisabled}
                        onClick={() => remove(index)}
                      >
                        <Trash size={12} />
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage className="error-msg">
                    {form.formState.errors.options?.[index]?.message}
                  </FormMessage>
                </FormItem>
              )}
            />
          ))}

          <Button
            type="button"
            variant={"outline"}
            size={"sm"}
            disabled={isFieldDisabled || fields.length >= poll.options.maxCount}
            className="mt-4"
            onClick={() => append(`option ${fields.length + 1}`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add option
          </Button>
        </div>

        <Button
          disabled={isFieldDisabled}
          type="submit"
          className="w-full mt-10"
        >
          {isExecuting ? "Launching poll..." : "Launch Poll"}
        </Button>
      </form>
    </FormProvider>
  );
};
