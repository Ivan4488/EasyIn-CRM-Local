import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useToast } from "~/components/UI/hooks/use-toast";
import { axiosClient } from "~/service/axios";
import { usePropertiesStore } from "~/stores/propertiesStore";
import { PropertyLockType } from "./useProperties";

type LockUpdatePayload = {
  id: string;
  lock_type: PropertyLockType;
};

export const usePropertiesLockTypeMutation = () => {
  const router = useRouter();
  const itemId = router.query.id as string | undefined;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const propertiesContext = usePropertiesStore.getState().propertiesContext;

  return useMutation<
    unknown,
    unknown,
    { properties: LockUpdatePayload[] },
    { previous?: unknown }
  >({
    mutationKey: ["setPropertiesLockType", propertiesContext],
    mutationFn: ({ properties }: { properties: LockUpdatePayload[] }) => {
      if (propertiesContext === "contacts") {
        return axiosClient.post(`/contacts/properties/lock`, { properties });
      }
      if (propertiesContext === "companies") {
        return axiosClient.post(`/companies/properties/lock`, { properties });
      }
      return Promise.reject(new Error("Lock-type editing is not supported for this context"));
    },
    onMutate: async ({ properties }) => {
      if (propertiesContext === "contacts" && itemId) {
        await queryClient.cancelQueries({ queryKey: ["contactProperties", itemId] });
        const previous = queryClient.getQueryData(["contactProperties", itemId]);
        queryClient.setQueryData(["contactProperties", itemId], (old) => {
          if (!old) return old;
          const resp = old as { data?: Array<{ id: string; lock_type?: PropertyLockType }> };
          const current = Array.isArray(resp.data) ? resp.data : [];
          const updates = new Map(properties.map((p) => [p.id, p.lock_type]));
          const updated = current.map((prop) =>
            updates.has(prop.id) ? { ...prop, lock_type: updates.get(prop.id) } : prop
          );
          return { ...(old as object), data: updated } as typeof old;
        });
        return { previous };
      }
      if (propertiesContext === "companies" && itemId) {
        await queryClient.cancelQueries({ queryKey: ["companyProperties", itemId] });
        const previous = queryClient.getQueryData(["companyProperties", itemId]);
        queryClient.setQueryData(["companyProperties", itemId], (old) => {
          if (!old) return old;
          const resp = old as { data?: Array<{ id: string; lock_type?: PropertyLockType }> };
          const current = Array.isArray(resp.data) ? resp.data : [];
          const updates = new Map(properties.map((p) => [p.id, p.lock_type]));
          const updated = current.map((prop) =>
            updates.has(prop.id) ? { ...prop, lock_type: updates.get(prop.id) } : prop
          );
          return { ...(old as object), data: updated } as typeof old;
        });
        return { previous };
      }
      return {};
    },
    onSuccess: () => {
      toast({
        title: "Success",
        variant: "success",
        description: "Update controls modified",
      });
      if (itemId) {
        if (propertiesContext === "contacts") {
          queryClient.invalidateQueries({ queryKey: ["contactProperties", itemId] });
        }
        if (propertiesContext === "companies") {
          queryClient.invalidateQueries({ queryKey: ["companyProperties", itemId] });
        }
      }
    },
    onError: (e: unknown, _vars, context) => {
      if (propertiesContext === "contacts" && itemId && context?.previous) {
        queryClient.setQueryData(["contactProperties", itemId], context.previous);
      }
      if (propertiesContext === "companies" && itemId && context?.previous) {
        queryClient.setQueryData(["companyProperties", itemId], context.previous);
      }
      console.log(e);
      toast({
        title: "Error",
        variant: "destructive",
        description:
          (typeof e === "object" && e && (e as { response?: { data?: { message?: string } } }).response?.data?.message) ||
          "An error occurred while updating lock settings",
      });
    },
    onSettled: () => {
      if (itemId) {
        if (propertiesContext === "contacts") {
          queryClient.invalidateQueries({ queryKey: ["contactProperties", itemId] });
        }
        if (propertiesContext === "companies") {
          queryClient.invalidateQueries({ queryKey: ["companyProperties", itemId] });
        }
      }
    },
  });
};


