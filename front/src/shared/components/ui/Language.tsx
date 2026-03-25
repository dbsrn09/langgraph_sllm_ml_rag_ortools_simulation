import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import i18n from "../../../app/i18n/i18n";
import { useAppStore } from "../../../store/app.store";


const Language = () => {

    const { selectedCredential } = useAppStore();

    const getInitialLang = () => {
        const saved = selectedCredential.user.defaultLang
        return saved === "kr" ? "한국어" : "English";
    };

    const { i18n: i18next } = useTranslation();

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const [_, setLang] = useState<"English" | "한국어">(getInitialLang());

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);

    const currentLang = i18next.language;

    return (
        <div className={` relative inline-block border-l-2 pl-2  truncate  z-150`} ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full hover:bg-gray-100 transition flex items-center gap-2  text-gray-500  text-sm"
            >
                <Globe className="w-5 h-5" />
            </button>

            {open && (
                <div className="text-sm fixed right-5 mt-2 w-40 bg-white border rounded-xl shadow-lg p-2 z-150 animate-in fade-in zoom-in-95 duration-100">

                    <button
                        onClick={() => {
                            i18n.changeLanguage("en");
                            setLang("English")
                            setOpen(false);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇺🇸</span>
                            <span>English</span>
                        </div>
                        {currentLang === "en" && <Check className="w-4 h-4 text-blue-500" />}
                    </button>

                    <button
                        onClick={() => {
                            i18n.changeLanguage("kr");
                            setOpen(false);
                            setLang("한국어")
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🇰🇷</span>
                            <span>한국어</span>
                        </div>
                        {currentLang === "kr" && <Check className="w-4 h-4 text-blue-500" />}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Language;
