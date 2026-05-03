import { useLocation, useNavigate, useParams } from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const query: Record<string, string> = { ...params } as Record<string, string>;
  const searchParams = new URLSearchParams(location.search);
  for (const [k, v] of searchParams.entries()) query[k] = v;

  return {
    query,
    pathname: location.pathname,
    asPath: `${location.pathname}${location.search}`,
    push: (to: string) => navigate(to),
    replace: (to: string) => navigate(to, { replace: true }),
    back: () => navigate(-1),
  };
}

export default { useRouter };
