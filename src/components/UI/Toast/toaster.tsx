import { useToast } from "~/components/UI/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "~/components/UI/Toast/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="left">
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="flex flex-col gap-[4px] pr-[80px] w-full">
              {/* Top row: icon + title */}
              <div className="flex flex-row items-center gap-[12px]">
                <ToastIcon variant={props.variant || "default"} />
                {title && <ToastTitle variant={props.variant || "default"}>{title}</ToastTitle>}
              </div>
              {/* Description spans full width — starts at same X as icon */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
