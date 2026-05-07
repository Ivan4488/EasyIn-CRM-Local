import { useEffect } from "react";
import { PropertiesContext, usePropertiesStore } from "../propertiesStore";

export const useSetPropertiesContext = ({
  context,
  copyState,
}: {
  context: PropertiesContext;
  copyState: () => void;
}) => {
  useEffect(() => {
    usePropertiesStore.getState().setPropertiesContext(context);
    copyState();
  }, [context]);
};
