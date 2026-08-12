import * as React from "react";
import { Button } from "../ui/button";

type LucideIconElement = React.ReactElement<{ className?: string }>;

interface HeaderCompProps {
  title: string;
  description: string;
  icon?: LucideIconElement;
  actionLabel?: string;
  onAction?: React.MouseEventHandler<HTMLButtonElement>;
}

const HeaderComp = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}: HeaderCompProps) => {
  const iconElement =
    icon &&
    React.cloneElement(icon, {
      className: [icon.props.className, "h-4 w-4"].filter(Boolean).join(" "),
    });

  const hasActionButton = Boolean(actionLabel && onAction);

  return (
    <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {hasActionButton ? (
        <div>
          <Button variant="green" onClick={onAction}>
            {iconElement}
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default HeaderComp;
