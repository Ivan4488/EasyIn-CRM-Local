import { Scrollbar } from "~/components/UI/Scrollbar/Scrollbar";
import classNames from "classnames";
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore";

interface Props {
  isDisabled?: boolean;
  children: React.ReactNode;
}


export const RightMenuPropertiesWrapper = ({ isDisabled, children }: Props) => {
  const { contactEmailsModalPropertyId, employeeCountModalPropertyId } = useRightMenuNavigationStore();

  return (
    <Scrollbar
      id="right-menu-scroll"
      everPresent={true}
      className={classNames(
        "p-[80px] w-[300px] px-[8px] pt-[8px] z-[40]",
        isDisabled && "opacity-20 pointer-events-none"
      )}
      style={{ background: "rgba(29, 30, 32, 0.60)", scrollBehavior: "smooth" }}
      onClick={contactEmailsModalPropertyId || employeeCountModalPropertyId ? (e) => {
        const target = e.target as HTMLElement;
        if (target.closest("[data-employee-count-modal='true']")) return;

        const store = useRightMenuNavigationStore.getState();
        if (store.contactEmailsModalPropertyId) {
          store.setContactEmailsModalPropertyId(null);
        }
        if (store.employeeCountModalPropertyId) {
          store.setEmployeeCountModalPropertyId(null);
        }
      } : undefined}
    >
      {children}

      {(contactEmailsModalPropertyId || employeeCountModalPropertyId) && (
        <div
          className="fixed top-[72px] right-[4px] w-[296px] h-[calc(100%-72px)] bg-[#141414] opacity-[0.8] z-[210] pointer-events-none"
        />
      )}
    </Scrollbar>
  );
};
