import { User ,Lock} from "lucide-react";
import type { LoginRequest } from "../../../models/auth.model";
import type { Dispatch, SetStateAction } from "react";


interface LoginFormProps {
    statusCheckToken: string
    login:LoginRequest;
    setLogin: Dispatch<SetStateAction<LoginRequest>>;
}
const LoginForm = ({ statusCheckToken,login,setLogin }: LoginFormProps) => {



    return (
    
            <div className={`${statusCheckToken === "pending" ? "hidden" : ""}`}>
                <h2 className="text-lg font-semibold mb-1 text-center">Data Agent</h2>
                <h2 className="text-sm mb-4 text-center text-gray-500">
                    Enter your credentials to access your account
                </h2>

                <h1 className="py-1">Email</h1>
                <div className="relative mb-3 bg-[#f4f4f4] rounded-md">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Enter your email"
                        value={login.email}
                        onChange={(e) =>
                            setLogin((prev) => ({ ...prev, email: e.target.value }))
                        }
                        className="w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none text-sm"
                    />
                </div>

                <h1 className="py-1">Password</h1>
                <div className="relative mb-3 bg-[#f4f4f4] rounded-md">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-3 py-2 rounded-lg focus:outline-none text-sm"
                        value={login.password}
                        onChange={(e) =>
                            setLogin((prev) => ({ ...prev, password: e.target.value }))
                        }
                    />
                </div>
             </div>

            );
};

            export default LoginForm;
