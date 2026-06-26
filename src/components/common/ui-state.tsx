import { AlertTriangle, Inbox, Loader2, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

type StateAction = {
  label: string;
  onClick?: () => void;
};

type UiStateProps = {
  action?: StateAction;
  className?: string;
  description?: string;
  icon?: ReactNode;
  title: string;
};

function joinClassNames(...classNames: Array<string | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

function StateShell({ action, className, description, icon, title }: UiStateProps) {
  return (
    <div
      className={joinClassNames(
        "grid min-h-[220px] place-items-center rounded-2xl border border-white/10 bg-white/[0.07] px-6 py-10 text-center text-white",
        className
      )}
    >
      <div>
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white/[0.09] text-white/58">
          {icon}
        </div>
        <h3 className="mt-4 text-lg font-black tracking-normal">{title}</h3>
        {description ? <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/48">{description}</p> : null}
        {action ? (
          <button
            className="mt-5 inline-flex h-9 items-center justify-center rounded-full bg-white/[0.13] px-5 text-sm font-semibold text-white transition hover:bg-hnb hover:text-ink"
            onClick={action.onClick}
            type="button"
          >
            {action.label}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function EmptyState({
  description = "当前暂无数据，请稍后再查看。",
  title = "暂无内容",
  ...props
}: Partial<UiStateProps>) {
  return <StateShell description={description} icon={<Inbox className="h-6 w-6" />} title={title} {...props} />;
}

export function LoadingState({
  description = "正在加载数据，请稍候。",
  title = "加载中",
  ...props
}: Partial<UiStateProps>) {
  return (
    <StateShell
      description={description}
      icon={<Loader2 className="h-6 w-6 animate-spin" />}
      title={title}
      {...props}
    />
  );
}

export function ErrorState({
  action,
  description = "数据请求失败，请稍后重试。",
  title = "加载失败",
  ...props
}: Partial<UiStateProps>) {
  return (
    <StateShell
      action={action || { label: "重新加载" }}
      description={description}
      icon={action ? <RefreshCw className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
      title={title}
      {...props}
    />
  );
}
