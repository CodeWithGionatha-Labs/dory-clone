import { ClearSearchParamsButton } from "@/components/buttons/ClearSearchParamsButton";
import { RefreshButton } from "@/components/buttons/RefreshButton";
import { QuestionsTabsNavigation } from "@/components/layout/QuestionsTabsNavigation";
import { Loader } from "@/components/Loader";
import {
  OpenQuestionsList,
  ResolvedQuestionsList,
} from "@/components/QuestionsList";
import { QuestionsSortBySelect } from "@/components/selects/QuestionsSortBySelect";
import { getEventOpenQuestions } from "@/lib/server/get-event-open-questions";
import { getEventResolvedQuestions } from "@/lib/server/get-event-resolved-questions";
import { QuestionsOrderBy } from "@/lib/utils/question-utils";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

type PathParams = {
  ownerId: string;
  eventSlug: string;
};

type SearchParams = {
  sortBy: QuestionsOrderBy;
  questionId: string;
  resolved: string;
};

const EventQuestionsPage = async ({
  params: { ownerId, eventSlug },
  searchParams,
}: {
  params: PathParams;
  searchParams?: SearchParams;
}) => {
  const orderBy = searchParams?.sortBy ?? "newest";
  const showResolved = searchParams?.resolved === "true";
  const questionId = searchParams?.questionId;

  const hasFilters = !!questionId;

  return (
    <>
      <div className="flex justify-between">
        {/* Open or Resolved */}
        <QuestionsTabsNavigation ownerId={ownerId} eventSlug={eventSlug} />

        <div className="inline-flex items-center lg:gap-x-5">
          <RefreshButton />

          <div className="inline-flex items-center p-0.5 lg:gap-x-2">
            <span className="hidden lg:inline-block text-nowrap text-sm text-gray-500">
              Sort By:
            </span>

            <QuestionsSortBySelect sortBy={orderBy} />
          </div>
        </div>
      </div>

      {/* Clear Filters option */}
      {hasFilters && (
        <div className="flex mt-4 items-center gap-x-2">
          <p>You have active filters:</p>

          <ClearSearchParamsButton />
        </div>
      )}

      {/* List of questions */}
      <Suspense key={Date.now()} fallback={<Loader />}>
        <Questions
          ownerId={ownerId}
          eventSlug={eventSlug}
          showResolved={showResolved}
          orderBy={orderBy}
          questionId={questionId}
        />
      </Suspense>
    </>
  );
};

const Questions = async ({
  eventSlug,
  ownerId,
  showResolved,
  orderBy = "newest",
  questionId,
}: {
  showResolved: boolean;
  ownerId: string;
  eventSlug: string;
  questionId?: string;
  orderBy?: QuestionsOrderBy;
}) => {
  const fetchQuestions = showResolved
    ? getEventResolvedQuestions
    : getEventOpenQuestions;

  // open or resolved questions
  const questions = await fetchQuestions({
    ownerId,
    eventSlug,
    orderBy,
    ...(questionId ? { filters: { questionId } } : {}),
  });

  return showResolved ? (
    <ResolvedQuestionsList
      initialQuestions={questions}
      ownerId={ownerId}
      eventSlug={eventSlug}
      questionId={questionId}
      orderBy={orderBy}
      className="mt-5"
    />
  ) : (
    <OpenQuestionsList
      initialQuestions={questions}
      ownerId={ownerId}
      eventSlug={eventSlug}
      questionId={questionId}
      orderBy={orderBy}
      className="mt-5"
    />
  );
};

export default EventQuestionsPage;
