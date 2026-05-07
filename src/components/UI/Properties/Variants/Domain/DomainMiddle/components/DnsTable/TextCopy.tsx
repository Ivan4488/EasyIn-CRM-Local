import { useToast } from "~/components/UI/hooks/use-toast"
import { Copy } from "~/icons/ui/Copy"

interface TextCopyProps {
  text?: string;
  /** Truncate long text and pin copy button to the right edge */
  truncate?: boolean;
}

export const TextCopy = ({ text, truncate }: TextCopyProps) => {
  const { toast } = useToast();
  const onClick = () => {
    if (!text) return;

    navigator.clipboard.writeText(text);
    toast({
      title: "Success",
      variant: "success",
      description: "Copied to clipboard",
    });
  };

  if (!text) return <div className="w-[100%] h-[100%]"></div>;

  if (truncate) {
    return (
      <div className="flex items-center justify-between gap-[8px] w-full min-w-0">
        <p className="truncate text-display-12 text-white/80 font-[400]" title={text}>
          {text}
        </p>
        <button onClick={onClick} className="shrink-0 text-text-weak hover:text-white transition-colors">
          <Copy />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-[12px] flex-row">
      <p className="break-all">{text}</p>

      <button onClick={onClick}>
        <Copy />
      </button>
    </div>
  );
};
