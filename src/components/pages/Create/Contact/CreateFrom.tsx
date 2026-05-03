import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/UI/Buttons/Button";
import { Input } from "~/components/UI/Input/Input";
import { Contact } from "~/icons/records/Contact";
import { axiosClient } from "~/service/axios";
import { ContactData, RecordsResponse } from "~/service/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Loader } from "~/components/UI/Loader/Loader";
import { InputGroup } from "~/components/UI/InputGroup/InputGroup";

export const CreateForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const onBackButtonClick = () => {
    router.back();
  };

  const mutation = useMutation({
    mutationFn: (data: {
      linkedin_url?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    }) => {
      return axiosClient.post<ContactData>("/contacts/create", data);
    },
    onMutate: async (newData) => {
      const previousRecordsList = queryClient.getQueryData(["recordsList", []]);
      queryClient.setQueryData(
        ["recordsList", []],
        (
          oldQueryData: InfiniteData<
            AxiosResponse<RecordsResponse, any>,
            unknown
          >
        ) => {
          if (!oldQueryData) return oldQueryData;

          const newItem = {
            data: {
              id: "new",
              name: newData.firstName,
              firstName: newData.firstName,
              lastName: newData.lastName,
              email: newData.email,
              created_at: new Date().toISOString(),
            },
            type: "contact",
          };

          if (
            oldQueryData &&
            oldQueryData.pages.length > 0 &&
            oldQueryData.pages[0]
          ) {
            const updatedFirstPage = [
              newItem,
              ...oldQueryData.pages[0].data.records,
            ];
            return {
              pageParams: oldQueryData.pageParams,
              pages: [
                {
                  ...oldQueryData.pages[0],
                  data: {
                    ...oldQueryData.pages[0].data,
                    records: updatedFirstPage,
                  },
                },
                ...oldQueryData.pages.slice(1),
              ],
            };
          }

          return oldQueryData;
        }
      );
      return { previousRecordsList };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(
        ["recordsList", []],
        context?.previousRecordsList
      );
      toast({
        title: "Error",
        description: "An error occurred while creating the contact",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["recordsList", []] });
    },
    onSuccess: (data) => {
      const id = data.data.id;
      queryClient.setQueryData(["contacts", id], data.data);
      toast({
        title: "Contact created",
        description: "Contact saved successfully.",
        variant: "success",
      });
      if ((data.data as any).potentialDuplicate) {
        setTimeout(() => {
          toast({
            title: "Potential duplicate detected",
            description: "A review has been added to your duplicate list.",
            variant: "default",
          });
        }, 1200);
      }
      router.push(`/contacts/${id}`);
    },
  });

  const ContactSchema = z
    .object({
      linkedin_url: z
        .string()
        .regex(
          /^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]{1,30}\/?$/,
          "Invalid LinkedIn URL"
        )
        .optional()
        .or(z.literal("")),
      firstName: z
        .string()
        .min(1, "First name is required")
        .optional()
        .or(z.literal("")),
      lastName: z
        .string()
        .min(1, "Last name is required")
        .optional()
        .or(z.literal("")),
      email: z.string().email("Invalid email").optional().or(z.literal("")),
    })
    .refine(
      (data) => {
        return (
          (data.linkedin_url && data.linkedin_url.length > 0) ||
          (data.firstName && data.lastName && data.email)
        );
      },
      {
        message:
          "Either LinkedIn URL or all other fields (First Name, Last Name, Email) must be filled",
        path: ["linkedin_url"],
      }
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof ContactSchema>>({
    mode: "onSubmit",
    resolver: zodResolver(ContactSchema),
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <MiddleSection>
      <BackHeaderRound
        title="Create new contact"
        onClick={onBackButtonClick}
        Icon={Contact}
      />

      {mutation.isPending ? (
        <div className="flex justify-center items-center mt-[180px] w-full">
          <Loader />
        </div>
      ) : (
        <Scrollbar className="flex flex-col items-center h-full w-full py-[60px]">
          <div className="flex flex-col max-w-[500px] w-full gap-[0px]">
            <Input
              label="LinkedIn URL"
              placeholder="https://www.linkedin.com/in/username"
              {...register("linkedin_url")}
              error={errors.linkedin_url?.message}
            />

            <div className="flex justify-center items-center gap-[8px] mb-[24px] mt-[4px]">
              <div className="text-[14px] text-gray-2">OR</div>
            </div>

            <InputGroup>
              <Input
                label="First Name"
                placeholder="Type first name"
                {...register("firstName")}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                placeholder="Type last name"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
              <Input
                label="Email"
                placeholder="Type email"
                {...register("email")}
                error={errors.email?.message}
              />
            </InputGroup>

            <div className="flex justify-end gap-[8px] mt-[32px]">
              <Button
                variant="secondary"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button onClick={onSubmit}>Save</Button>
            </div>
          </div>
        </Scrollbar>
      )}
    </MiddleSection>
  );
};
