import { PopoverArrow } from "@radix-ui/react-popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast } from "~/components/UI/hooks/use-toast"
import {
  Command,
  CommandGroup,
  CommandItem,
} from "~/components/UI/Popover/Command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/UI/Popover/Popover";
import { Tabs, TabsList, TabsTrigger } from "~/components/UI/Tabs/Tabs";
import { axiosClient } from "~/service/axios";
import { ContactData, ConversationStatus } from "~/service/types";

const items = [
  {
    value: "pt1h",
    label: "1 hour",
    shortValue: "1h",
  },
  {
    value: "p1d",
    label: "1 day",
    shortValue: "1d",
  },
  {
    value: "p1w",
    label: "1 week",
    shortValue: "1w",
  },
  {
    value: "p1m",
    label: "1 month",
    shortValue: "1m",
  },
];

interface Props {
  status?: ConversationStatus;
  snoozeUntil?: string;
}

export const ConvoStatus = ({ status, snoozeUntil }: Props) => {
  const [isSnoozedOpen, setIsSnoozedOpen] = useState(false);
  const [tabValue, setTabValue] = useState<ConversationStatus>(
    status || "default"
  ); // ["active", "closed", "snoozed"]
  const [snoozeValue, setSnoozeValue] = useState<undefined | string>();

  useEffect(() => {
    setTabValue(status || "default");
  }, [status]);

  const router = useRouter();
  const contactId = router.query.id as string;

  const queryClient = useQueryClient();

  const { toast } = useToast();

  const changeStatusMutation = useMutation({
    mutationKey: ["changeStatus", contactId],
    mutationFn: ({
      status,
      isoValue,
    }: {
      status: string;
      isoValue?: string;
    }) => {
      return axiosClient.post(`/contacts/${contactId}/status`, {
        conversation_status: status,
        snooze_period: isoValue,
      });
    },
    onMutate: async ({ status }) => {
      queryClient.setQueryData(["contacts", contactId], (data: ContactData) => {
        return {
          ...data,
          conversation_status: status,
        };
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["requiresResponseMessages"],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", contactId],
      });
      toast({
        title: "Success",
        description: "Conversation status changed",
        variant: "success",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "An error occurred while changing the conversation status",
        variant: "destructive",
      });
    },
  });

  const getIsoValue = (value: string) => {
    return value.toUpperCase();
  };

  const onSnoozeChange = (value: string) => {
    setSnoozeValue(value);
    setTabValue("snoozed");
    changeStatusMutation.mutate({
      status: "snoozed",
      isoValue: getIsoValue(value),
    });
  };

  const onTabChange = (value: string) => {
    if (value === "snoozed") return;
    setTabValue(value as ConversationStatus);
    const isoValue = snoozeValue ? getIsoValue(snoozeValue) : undefined;
    changeStatusMutation.mutate({
      status: value,
      isoValue: value === "snoozed" ? isoValue : undefined,
    });
  };

  const handleSnoozeClick = () => {
    setIsSnoozedOpen(!isSnoozedOpen);
  };

  return (
    <div className="px-[12px] mb-[16px]">
      <Tabs value={tabValue} onValueChange={onTabChange} className="w-full">
        <TabsList className="w-full">
          <Popover open={isSnoozedOpen} onOpenChange={setIsSnoozedOpen}>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>

            <PopoverTrigger
              onClick={handleSnoozeClick}
            >
              <TabsTrigger
                value="snoozed"
                onClick={(e) => {
                  e.preventDefault();
                  handleSnoozeClick();
                }}
              >
                Snooze
              </TabsTrigger>
            </PopoverTrigger>

            <PopoverContent
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              className="w-[255px]"
              side="bottom"
              align="end"
              sideOffset={0}
              alignOffset={-7}
            >
              <PopoverArrow asChild>
                <div className="w-[80px] h-[9px] bg-white invisible"></div>
              </PopoverArrow>
              <Command>
                <CommandGroup>
                  {items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={(currentValue) => {
                        onSnoozeChange(
                          currentValue === snoozeValue ? "" : currentValue
                        );
                        setIsSnoozedOpen(false);
                      }}
                      className={classNames(
                        "font-semibold cursor-pointer",
                        snoozeValue === item.value && "text-strong-green"
                      )}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </TabsList>
      </Tabs>
    </div>
  );
};
