import routes from "@/app/config/routes";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: PropsWithChildren) => {
  const isAuthenticated = await getKindeServerSession().isAuthenticated();

  if (!isAuthenticated) {
    redirect(routes.login);
  }

  return <div>{children}</div>;
};

export default DashboardLayout;
