"use client";

import { questionsPageQueryParams } from "@/config/queryParams";
import { QuestionsOrderBy } from "@/lib/utils/question-utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { match } from "ts-pattern";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  sortBy: QuestionsOrderBy;
};

export const QuestionsSortBySelect = ({ sortBy }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleValueChange = (value: QuestionsOrderBy) => {
    const newParams = new URLSearchParams(searchParams);

    const orderBy = match(value)
      .returnType<QuestionsOrderBy | undefined>()
      .with("most-popular", () => "most-popular")
      .with("newest", () => "newest")
      .with("oldest", () => "oldest")
      .otherwise(() => undefined);

    orderBy
      ? newParams.set(questionsPageQueryParams.sortBy, orderBy)
      : newParams.delete(questionsPageQueryParams.sortBy);

    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <Select
      key={`${pathname}${searchParams.toString()}`}
      defaultValue={sortBy}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="text-xs bg-white lg:text-sm">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={"most-popular" as QuestionsOrderBy}>
          Most Popular
        </SelectItem>
        <SelectItem value={"newest" as QuestionsOrderBy}>Newest</SelectItem>
        <SelectItem value={"oldest" as QuestionsOrderBy}>Oldest</SelectItem>
      </SelectContent>
    </Select>
  );
};
