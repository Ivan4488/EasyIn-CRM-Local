import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "~/service/axios";
import { Property2, PropertyBackend } from "~/components/UI/Properties/RightMenuPropertiesList/hooks/useProperties";
import { getPropertyDisplayValue } from "../utils/getPropertyDisplayValue";

export function useDuplicateConflictCount(sourceId: string, targetId: string): number {
  const { data: sourceProps } = useQuery({
    queryKey: ["contactProperties", sourceId],
    queryFn: () => axiosClient.get<PropertyBackend>(`/contacts/${sourceId}/properties`),
    enabled: !!sourceId,
  });

  const { data: targetProps } = useQuery({
    queryKey: ["contactProperties", targetId],
    queryFn: () => axiosClient.get<PropertyBackend>(`/contacts/${targetId}/properties`),
    enabled: !!targetId,
  });

  return useMemo(() => {
    const src: Property2[] = sourceProps?.data ?? [];
    const tgt: Property2[] = targetProps?.data ?? [];
    if (!src.length || !tgt.length) return 0;
    let count = 0;
    for (const sp of src) {
      if (!sp.is_active) continue;
      const tp = tgt.find((t) => t.id === sp.id);
      if (!tp) continue;
      const sv = getPropertyDisplayValue(sp);
      const tv = getPropertyDisplayValue(tp);
      if (sv && tv && sv !== tv) count++;
    }
    return count;
  }, [sourceProps, targetProps]);
}
