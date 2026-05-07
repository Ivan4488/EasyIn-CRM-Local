import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BackHeaderRound } from "~/components/UI/BackHeaderRound/BackHeaderRound";
import { Button } from "~/components/UI/Buttons/Button";
import { useToast } from "~/components/UI/hooks/use-toast";
import { Input } from "~/components/UI/Input/Input";
import { InputGroup } from "~/components/UI/InputGroup/InputGroup";
import { Loader } from "~/components/UI/Loader/Loader";
import { MiddleSection } from "~/components/UI/MiddleSection/MiddleSection";
import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import { Company } from "~/icons/records/Company";
import { axiosClient } from "~/service/axios";
import { RecordsResponse } from "~/service/types";
import { useLeftMenuStore } from "~/stores/leftMenu";

export const CreateForm = () => {
  const queryClient = useQueryClient();

  const router = useRouter();

  const onBackButtonClick = () => {
    router.back();
  };

  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: {
      name: string;
      domain: string;
      linkedInCompanyUrl: string;
    }) => {
      return axiosClient.post("/companies/create", data);
    },
    onMutate: async (newData) => {
      // Snapshot the previous value
      const previousRecordsList = queryClient.getQueryData(["recordsList", []]);
      // Optimistically update to the new value
      queryClient.setQueryData(
        ["recordsList", []],
        (
          oldQueryData: InfiniteData<
            AxiosResponse<RecordsResponse, any>,
            unknown
          >
        ) => {
          if (!oldQueryData) {
            return oldQueryData;
          }

          const newItem = {
            data: {
              id: "new",
              name: newData.name,
              domain: newData.domain,
              created_at: new Date().toISOString(),
            },
            type: "company",
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

            const newFirstPage = {
              ...oldQueryData.pages[0],
              data: {
                ...oldQueryData.pages[0].data,
                records: updatedFirstPage,
              },
            };

            return {
              pageParams: oldQueryData.pageParams,
              pages: [newFirstPage, ...oldQueryData.pages.slice(1)],
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
        description: "An error occurred while creating the company",
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["recordsList", []],
      });
    },
    onSuccess: (data) => {
      useLeftMenuStore.getState().clearMenu();
      const id = data.data.id;
      toast({
        title: "Success",
        description: "Company created",
        variant: "success",
      });
      router.push(`/companies/${id}`);
    },
  });

  const onSubmit = () => {
    handleSubmit((data) => {
      mutation.mutate({
        domain: data.domainName || "",
        name: data.companyName || "",
        linkedInCompanyUrl: data.linkedInCompanyUrl || "",
      });
    })();
  };

  const domainNameRegex = /^(?!:\/\/)([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;

  const CompanySchema = z
    .object({
      linkedInCompanyUrl: z
        .string()
        .url("Invalid URL")
        .optional()
        .or(z.literal("")),
      companyName: z
        .string()
        .min(1, "Company name is required")
        .optional()
        .or(z.literal("")),
      domainName: z
        .string()
        .min(1, "Domain name is required")
        .regex(domainNameRegex, {
          message: "Invalid domain name",
        })
        .optional()
        .or(z.literal("")),
    })
    .refine(
      (data) => {
        return (
          (data.linkedInCompanyUrl && data.linkedInCompanyUrl.length > 0) ||
          (data.companyName && data.domainName)
        );
      },
      {
        message:
          "Either LinkedIn URL or all other fields (Company Name, Domain Name) must be filled",
        path: ["linkedInCompanyUrl"],
      }
    );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CompanySchema>>({
    mode: "onSubmit",
    resolver: zodResolver(CompanySchema),
  });

  return (
    <MiddleSection>
      <BackHeaderRound
        title="Create new company"
        onClick={onBackButtonClick}
        Icon={Company}
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
              placeholder="https://www.linkedin.com/company"
              {...register("linkedInCompanyUrl")}
              error={errors.linkedInCompanyUrl?.message}
            />

            <div className="flex justify-center items-center gap-[8px] mb-[24px] mt-[4px]">
              <div className="text-[14px] text-gray-2">OR</div>
            </div>

            <InputGroup>
              <Input
                label="Domain name"
                placeholder="Type domain name"
                {...register("domainName")}
                error={errors.domainName?.message}
              />
              <Input
                label="Company name"
                placeholder="Type company name"
                {...register("companyName")}
                error={errors.companyName?.message}
              />
            </InputGroup>

            <div className="flex justify-end gap-[8px] mt-[32px]">
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  router.back();
                }}
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
