import type { BranchList } from "./branch.model";

export interface CompanyList {
    companyId: string;
    companyName: string;
    branch: BranchList[]

}