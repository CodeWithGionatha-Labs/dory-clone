import { createQuestionAction } from "@/lib/actions/create-question-action";
import { QuestionDetail } from "@/lib/prisma/validators/question-validators";
import { cn } from "@/lib/utils/ui-utils";
import { question } from "@/lib/validations/constants";
import {
  createQuestionSchema,
  CreateQuestionSchema,
} from "@/lib/validations/question-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Event, User } from "@prisma/client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { useAction } from "next-safe-action/hooks";
import { FormProvider, useForm } from "react-hook-form";
import { TextAreaWithCounter } from "../TextAreaWithCounter";
import { Button, buttonVariants } from "../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { toast } from "../ui/use-toast";

type Props = {
  ownerId: User["id"];
  eventSlug: Event["slug"];
  onSuccess: (data: QuestionDetail) => void;
};

export const CreateQuestionForm = ({
  ownerId,
  eventSlug,
  onSuccess: handleSuccess,
}: Props) => {
  const { isAuthenticated } = useKindeBrowserClient();

  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      body: "",
      ownerId,
      eventSlug,
    },
    mode: "onSubmit",
  });

  const { execute, isExecuting } = useAction(createQuestionAction, {
    onSuccess: ({ data }) => {
      if (data) {
        handleSuccess(data);
      }

      toast({
        title: "Your question has been posted! 🎉",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to post your question. Please retry.",
      });
    },
    onSettled: () => form.reset(),
  });

  const isFieldDisabled = form.formState.isSubmitting || isExecuting;

  const onSubmit = async (values: CreateQuestionSchema) => execute(values);

  return (
    <FormProvider {...form}>
      <form
        className="py-2 px-3 border border-dashed border-primary/60 rounded-lg"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="body"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Question</FormLabel>

              <FormControl>
                <TextAreaWithCounter
                  disabled={isFieldDisabled}
                  placeholder="What do you want to ask about?"
                  maxLength={question.maxLength}
                  {...field}
                />
              </FormControl>

              <FormMessage className="error-msg">
                {form.formState.errors.body?.message}
              </FormMessage>
            </FormItem>
          )}
        />

        <div className="flex justify-end -mt-3">
          <div className="flex justify-end">
            {isAuthenticated ? (
              <Button type="submit" size="lg" disabled={isFieldDisabled}>
                <ChatBubbleIcon className="w-4 h-4 mr-2" />

                <span className="text-xs lg:text-sm">
                  {isExecuting ? "Posting..." : "Ask"}
                </span>
              </Button>
            ) : (
              <RegisterLink
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" })
                )}
              >
                <ChatBubbleIcon className="w-4 h-4 mr-2" />

                <span className="text-xs lg:text-sm">Ask</span>
              </RegisterLink>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
