"use client";

import { questionsPageQueryParams } from "@/config/queryParams";
import routes from "@/config/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { NavTabButton } from "../buttons/NavTabButton";

type QuestionsTabs = "open" | "resolved";

type Props = {
  ownerId: string;
  eventSlug: string;
};

export const QuestionsTabsNavigation = ({ eventSlug, ownerId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showResolved =
    searchParams.get(questionsPageQueryParams.resolved) === "true";

  const eventQuestionsRoute = routes.event({
    eventSlug,
    ownerId,
  });

  const activeTab: QuestionsTabs =
    pathname === eventQuestionsRoute && !showResolved ? "open" : "resolved";

  const handleTabChange = (tab: QuestionsTabs) => {
    const newParams = new URLSearchParams();

    if (tab === "resolved") {
      newParams.set(questionsPageQueryParams.resolved, "true");
    }

    router.replace(`${eventQuestionsRoute}?${newParams.toString()}`);
  };

  return (
    <nav className="inline-flex">
      <NavTabButton
        isActive={activeTab === "open"}
        onClick={() => handleTabChange("open")}
      >
        Open
      </NavTabButton>

      <NavTabButton
        isActive={activeTab === "resolved"}
        onClick={() => handleTabChange("resolved")}
      >
        Resolved
      </NavTabButton>
    </nav>
  );
};
