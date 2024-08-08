import routes from "@/config/routes";
import { getUserInfo } from "@/lib/server/get-user-info";
import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Bell } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "../UserAvatar";
import { PublicAuthButtons } from "./PublicAuthButtons";

export const AuthButtons = async ({ className }: PropsWithClassName) => {
  const kindeUser = await getKindeServerSession().getUser();

  console.log(kindeUser);

  const user = kindeUser && (await getUserInfo(kindeUser.id));

  console.log(user);

  // TODO retrieve user notifications

  return user ? (
    <div className={cn("inline-flex gap-x-7 items-center", className)}>
      {/* TODO replace with real implementation */}
      <Bell className="w-5 h-5" />

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
