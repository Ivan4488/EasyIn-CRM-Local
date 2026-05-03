import { useToast } from "~/components/UI/hooks/use-toast"
import { Copy } from "~/icons/ui/Copy"

interface TextCopyProps {
  text?: string;
}

export const TextCopy = ({ text }: TextCopyProps) => {
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

  return (
    <div className="flex items-center gap-[12px] flex-row">
      <p className="break-all">{text}</p>

      <button onClick={onClick}>
        <Copy />
      </button>
    </div>
  );
};
