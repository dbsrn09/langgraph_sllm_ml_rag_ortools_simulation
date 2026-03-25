import { LayoutGrid, List, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface WorskspaceSearchProps {
    setTab: (val: "grid" | "list") => void;
    tab: "grid" | "list";
    search: string;
    setSearch: (val: string) => void;
}

const WorskspaceSearch = ({ setTab, tab, search, setSearch }: WorskspaceSearchProps) => {
    const { t } = useTranslation();

    const tabButtonclass = (va: "grid" | "list") => {
        return `
    p-2 rounded-lg
    transition-all duration-300 ease-in-out
    transform
    ${tab === va
                ? "bg-white shadow-md text-[#111111] scale-105"
                : "text-[#9A9A9A] hover:text-[#555555] hover:scale-105"
            }
  `;
    };

    return (

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A0A0A0]" />
                <input type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('reportAgent.search')}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E6E6E6] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A1E]/20 focus:border-[#FF8A1E] transition-all placeholder:text-[#9A9A9A] text-[#3C3C3C]" />
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-[#F5F5F5] p-1 rounded-lg border border-[#EAEAEA]">
                    <button className={tabButtonclass("list")} onClick={() => setTab("list")}>
                        <List className=" w-5 h-5" />
                    </button>
                    <button className={tabButtonclass("grid")} onClick={() => setTab("grid")}>
                        <LayoutGrid className="w-5 h-5" />

                    </button>
                </div>
            </div>
        </div>

    )
}

export default WorskspaceSearch;
