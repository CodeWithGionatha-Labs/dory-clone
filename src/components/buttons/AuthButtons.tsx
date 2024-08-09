import routes from "@/config/routes";
import { getUserInfo } from "@/lib/server/get-user-info";
import { getUserNotifications } from "@/lib/server/get-user-notifications";
import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Link from "next/link";
import { NotificationsMenu } from "../menu/NotificationsMenu";
import { UserAvatar } from "../UserAvatar";
import { PublicAuthButtons } from "./PublicAuthButtons";

export const AuthButtons = async ({ className }: PropsWithClassName) => {
  const kindeUser = await getKindeServerSession().getUser();

  const user = kindeUser && (await getUserInfo(kindeUser.id));

  const initialNotifications = kindeUser && (await getUserNotifications());

  return user ? (
    <div className={cn("inline-flex gap-x-7 items-center", className)}>
      <NotificationsMenu
        className="w-5 h-5"
        initialNotifications={initialNotifications ?? []}
      />

      <Link href={routes.dashboard} prefetch={false}>
        <UserAvatar
          className="ring-2 ring-white"
          displayName={user.displayName}
          color={user.color}
        />
      </Link>
    </div>
  ) : (
    <PublicAuthButtons className={className} />
  );
};
