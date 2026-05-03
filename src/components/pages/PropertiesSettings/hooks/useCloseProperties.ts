import { useRouter } from 'next/router';
import { useLeftMenuStore } from '~/stores/leftMenu';
import { usePropertiesStore } from '~/stores/propertiesStore';
import { PROPERTIES_CONTEXT_MAP, PropertiesContext } from '~/constants/propertiesConstants';

/**
 * Returns a function that fully exits the properties flow and returns the user
 * to wherever they were when they entered it (captured in sessionStorage at entry).
 * Falls back to home if no snapshot was captured (e.g. direct link navigation).
 */
export const useCloseProperties = () => {
  const router = useRouter();
  const propertiesContext = usePropertiesStore((s) => s.propertiesContext);
  const leftMenuStore = useLeftMenuStore();

  const closeAll = () => {
    if (propertiesContext) {
      const key = PROPERTIES_CONTEXT_MAP[propertiesContext as PropertiesContext];
      if (key) leftMenuStore.deactivateItem(key as any);
    }
    const returnUrl = sessionStorage.getItem('propertiesReturnUrl') || '/';
    sessionStorage.removeItem('propertiesReturnUrl');
    router.push(returnUrl);
  };

  return closeAll;
};
