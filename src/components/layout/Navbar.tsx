import routes from "@/config/routes";
import { Flame } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AuthButtons } from "../buttons/AuthButtons";
import { AuthLoader } from "../Loader";

export const NavBar = () => {
  return (
    <header className="bg-blue-600 text-primary-foreground h-16 flex items-center px-4 lg:px-8 shrink-0 grow-0">
      <Link href={routes.home} className="inline-flex items-end gap-x-2">
        <Logo />
        <span className="text-base tracking-wide font-bold">Pulse</span>
      </Link>

      <Suspense fallback={<AuthLoader className="ml-auto" />}>
        <AuthButtons className="ml-auto" />
      </Suspense>
    </header>
  );
};

const Logo = () => <Flame color="white" size={28} />;
