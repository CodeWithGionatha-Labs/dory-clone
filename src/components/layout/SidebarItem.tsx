import { cn, PropsWithClassName } from "@/lib/utils/ui-utils";
import { ComponentType, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  isActive: boolean;
  text: string;
  icon: ComponentType<PropsWithClassName>;
}>;

export const SidebarItem = ({
  isActive,
  text,
  icon: Icon,
  children,
}: Props) => {
  return (
    <div
      role="item"
      className={cn(
        "flex p-4 rounded-lg text-sm gap-x-2 items-center text-gray-500 transition-colors duration-150 select-none",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "hover:bg-primary/10"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{text}</span>
      {children}
    </div>
  );
};
