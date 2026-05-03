import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useToast } from "~/components/UI/hooks/use-toast";
import { getContactName } from "~/lib/utils/getContactName";
import { axiosClient } from "~/service/axios";
import { ContactData } from "~/service/types";

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  const { id } = router.query;

  return useMutation({
    mutationFn: async ({
      text,
      html,
      subject,
      platform,
      contact_id,
      sender_id,
    }: {
      text: string;
      html: string;
      subject: string;
      platform: string;
      contact_id: string;
      sender_id?: string;
    }) => {
      await axiosClient.post("/messages/create", {
        text: platform?.startsWith("linkedin") ? text : html,
        subject: subject,
        platform: platform,
        sender: "user",
        receiver: "contact",
        contact_id: contact_id,
        sender_id: sender_id,
      });
    },
    onSuccess: (data, variables) => {
      const idStr = id as string;

      queryClient.invalidateQueries({
        queryKey: ["messages", idStr],
      });

      queryClient.invalidateQueries({
        queryKey: ["requiresResponseMessages"],
      });

      const platform = variables.platform;

      toast({
        title: "Success",
        description: platform.includes("note") ? "Note created" : "Message sent",
        variant: "success",
      });
    },
    onError: (error, data) => {
      toast({
        title: "Error",
        description: "An error occurred while " + (data?.platform === "note" ? "saving the note" : "sending the message"),
        variant: "destructive",
      });
    },
    onMutate: (data) => {
      const idStr = id as string;

      const contactData = queryClient.getQueryData<ContactData>([
        "contacts",
        idStr,
      ]);

      const senderName =
        data.platform.startsWith('linkedin') ?
          contactData?.linkedinAccounts?.find(acc => acc.id === data.sender_id)?.name ||
            contactData?.linkedinAccounts?.[0]?.name :
          contactData?.userName;

      queryClient.setQueryData(["messages", idStr], (oldData: any) => {
        if (!oldData) {
          return oldData;
        }
        const messageText =
          data.platform?.startsWith("linkedin") ?
            `<i><small>sending message...</small></i><br>${data.html}` :
            data.html;

        return [
          {
            text: messageText,
            subject: data.subject,
            platform: data.platform,
            sender: "user",
            receiver: "contact",
            sender_name: senderName,
            user_id: contactData?.user_id,
            contact_id: id,
            account_id: contactData?.account_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            id: "new",
            User: {
              id: contactData?.user_id,
              email: "",
              name: contactData?.userName,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              account_id: contactData?.account_id,
            },
            Contact: {
              id: id,
              name: contactData ? getContactName(contactData) : "",
              email: "",
              phone: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: contactData?.user_id || "",
              account_id: contactData?.account_id || "",
              company_id: "",
            },
          },
          ...oldData,
        ];
      });
    },
  });
};
