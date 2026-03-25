import { useQuery } from "@tanstack/react-query";
import type { IFetchApiResult } from "../../models/api.models";
import type { BranchLogoResponse } from "../../models/branch.model";
import { isLangGraphLocal } from "../../langgraph/localMode";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

/** 1×1 투명 PNG — 로컬 모드에서 배경 요청 생략 */
const TINY_PNG =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

export const useGetBranchLogo = (branchId: string | null | undefined) =>
  useQuery<IFetchApiResult<BranchLogoResponse>>({
    queryKey: ["branchLogo", branchId],
    queryFn: async () => {
      if (isLangGraphLocal()) {
        return {
          success: true,
          message: "",
          result: { logo: "", bgImg: TINY_PNG }
        };
      }
      const res = await fetch(`${BASE_API_URL}/branch/getLogo/${branchId}`);
      if (!res.ok) throw new Error("Failed to fetch branch logo");
      return res.json();
    },
    enabled: !!branchId && branchId.trim() !== ""
  });