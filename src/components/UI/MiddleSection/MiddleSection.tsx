import classNames from "classnames"
import { useRouter } from "next/router"
import { useRightMenuNavigationStore } from "~/stores/rightMenuNavigationStore"
import { useEffect } from "react"

interface Props {
  noLeftBorder?: boolean;
  noRightBorder?: boolean;
  children: React.ReactNode;
}

export const MiddleSection = ({
  children,
  noLeftBorder,
  noRightBorder,
}: Props) => {
  const router = useRouter();
  const query = router.query;
  const rightMenuNavigationStore = useRightMenuNavigationStore();

  // Handle URL parameters on load
  useEffect(() => {
    if (query.section === "photo" && query.photoId) {
      const photoId = query.photoId as string;
      rightMenuNavigationStore.setSelectedPhotoPropertyId(photoId);
      rightMenuNavigationStore.setMiddleSection("photo-input");
    }
  }, [query.section, query.photoId]);

  return (
    <div
      className={classNames(
        "relative border-x border-x-gray-moderate flex flex-col overflow-hidden",
        {
          "border-l-0": noLeftBorder,
          "border-r-0": noRightBorder
        }
      )}
    >
      {children}
    </div>
  );
};
