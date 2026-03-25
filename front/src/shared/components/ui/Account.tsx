import { useState, useRef, useEffect } from "react";
import { User, LogOut } from "lucide-react";
import { initialCredential, useAppStore } from "../../../store/app.store";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

const Account = () => {

    const { selectedCredential, setCredential } = useAppStore();
    const navigate = useNavigate();
    const { instance, accounts } = useMsal();
    const [open, setOpen] = useState(false);
    const isMsalLogin = accounts.length > 0;
    const dropdownRef = useRef<HTMLDivElement>(null);

    const logOut = async () => {

        setOpen(false);

        setCredential(initialCredential);

        localStorage.clear();

        if (isMsalLogin) {

            instance.setActiveAccount(null);

            await instance.logoutRedirect({
                account: accounts[0],
                postLogoutRedirectUri: "/Login",
            });

            return;
        }

        navigate("/Login");
    };
    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);

    }, []);


    return (
        <div className={` relative inline-block  pl-1  truncate  z-150`} ref={dropdownRef}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full hover:bg-gray-100 transition flex items-center gap-2  text-gray-500  text-sm"
            >
                <User className="w-5 h-5" />
            </button>

            {open && (
                <div className="text-sm fixed right-5 mt-2 w-40 bg-white border rounded-xl shadow-lg p-2 z-150 animate-in fade-in zoom-in-95 duration-100">
                    <div className="border-b px-2 py-2 truncate">{selectedCredential.user.name}</div>
                    <button
                        onClick={logOut}
                        className="flex items-center  w-full px-3 py-2 rounded-lg hover:bg-gray-100 transition pt-3 mt-2"
                    >
                        <LogOut className="w-4 h-4 mr-2" /> Log Out
                    </button>

                </div>
            )}
        </div>
    );
};

export default Account;
