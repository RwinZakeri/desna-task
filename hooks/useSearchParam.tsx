import { useRouter, useSearchParams } from "next/navigation";

export default function useSearchParam(pathName: string) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchParam = new URLSearchParams(searchParams.toString());
  // func to find the search param
  const find = (param: string) => {
    const params = searchParams.getAll(param);
    if (params.length === 0) {
      return null;
    }
    if (params.length === 1) {
      return params[0];
    }
    return params;
  };
  // func to set the search param
  const set = <T,>(param: string, value: T) => {
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((value) => {
        searchParam.append(param, value);
      });
    } else {
      searchParam.set(param, String(value));
    }
    router.push(`${pathName}?${searchParam.toString()}`);
  };
  // func to remove the search param
  const remove = (param: string, value: string | number) => {
    if (!searchParam.has(param)) {
      return;
    }
    searchParam.delete(param, value.toString());
    router.push(`${pathName}?${searchParam.toString()}`);
  };
  // func to clear the search param
  const clear = () => {
    for (const [key, value] of searchParam.entries()) {
      searchParam.delete(key, value);
    }
    router.push(`${pathName}`);
  };
  return { find, set, remove, clear };
}
