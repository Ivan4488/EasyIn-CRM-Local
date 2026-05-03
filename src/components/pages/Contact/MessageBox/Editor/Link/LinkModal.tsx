import { Input } from "~/components/UI/Input/Input";
import { Modal } from "~/components/UI/Modal/Modal/Modal";

export type LinkOptions = {
  text: string;
  url: string;
};

interface LinkModalProps {
  showLinkModal: boolean;
  setShowLinkModal: (show: boolean) => void;
  linkObj: LinkOptions;
  setLinkObj: React.Dispatch<
    React.SetStateAction<{
      text: string;
      url: string;
    }>
  >;
  handleSetLink: () => void;
}

export const LinkModal = ({
  showLinkModal,
  setShowLinkModal,
  linkObj,
  setLinkObj,
  handleSetLink,
}: LinkModalProps) => {
  return (
    <Modal
      title="Add link"
      showModal={showLinkModal}
      closeModal={() => {
        setShowLinkModal(false);
      }}
      onConfirm={handleSetLink}
      submitBtnProps={{
        disabled: !linkObj.url,
      }}
      content={
        <div className="min-w-[400px]">
          <div className="flex flex-col gap-[16px]">
            <Input
              label="Text"
              value={linkObj.text}
              onChange={(e) =>
                setLinkObj((linkObj) => ({
                  ...linkObj,
                  text: e.target.value,
                }))
              }
            />

            <Input
              label="Link"
              value={linkObj.url}
              onChange={(e) =>
                setLinkObj((linkObj) => ({
                  ...linkObj,
                  url: e.target.value,
                }))
              }
              autoFocus
            />
          </div>
        </div>
      }
    />
  );
};
