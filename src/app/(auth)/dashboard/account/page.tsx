import { UserAvatar } from "@/components/UserAvatar";
import { getUserInfo } from "@/lib/server/get-user-info";
import { onlyDateFormatter } from "@/lib/utils/date-utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const AccountPage = async () => {
  const kindeUser = await getKindeServerSession().getUser();

  const user = kindeUser && (await getUserInfo(kindeUser.id));

  if (!user) {
    throw new Error("Invalid user!");
  }

  return (
    <div className="w-full h-full flex flex-col items-center mt-32">
      <UserAvatar
        className="w-14 h-14 ring ring-white"
        displayName={user.displayName}
        color={user.color}
      />

      <h1 className="text-2xl font-bold mt-3">{user.displayName}</h1>

      <time className="text-xs text-gray-500" suppressHydrationWarning>
        Member since {onlyDateFormatter.format(user.createdAt)}
      </time>

      <ul className="text-sm text-muted-foreground mt-6 space-y-1">
        <li>Events: {user._count.events}</li>
        <li>Questions Asked: {user._count.questions}</li>
        <li>Participating: {user._count.participations}</li>
        <li>Bookmarked Events: {user._count.bookmarks}</li>
      </ul>
    </div>
  );
};

export default AccountPage;
