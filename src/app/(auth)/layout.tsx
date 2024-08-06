import { NavBar } from "@/components/layout/Navbar";
import { PropsWithChildren } from "react";

export const dynamic = "force-dynamic";

const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <NavBar />

      <main className="h-[calc(100vh-68px)]">{children}</main>
    </>
  );
};

export default AuthLayout;
