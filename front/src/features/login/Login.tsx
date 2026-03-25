import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useLoginRequest } from "../../services/auth/userLogin";
import type { LoginRequest } from "../../models/auth.model";
import { toast } from "sonner";
import { useAppStore } from "../../store/app.store";
import { userToken } from "../../services/auth/userToken";
import { useNavigate, useParams } from "react-router-dom";
import { useLoginByEmail } from "../../services/auth/userLoginByEmail";
import { useAuth } from "../../app/auth/auth.fetch";
import { loginRequest, msalInstance } from "../../app/auth/msalConfig";
import LoginButton from "./components/LoginButton";
import LoginForm from "./components/LoginForm";
import { SetLanguage } from "../../shared/hooks/SetLanguage";
import { InteractionStatus } from "@azure/msal-browser";


const Login = () => {

    const navigate = useNavigate();

    const { email } = useParams<{ email?: string }>();

    const decodedEmail = email ? decodeURIComponent(email) : null;

    const auth = useAuth();

    const { accounts, inProgress } = useMsal();

    const isAuthenticated = useIsAuthenticated();

    const { selectedCredential, setCredential } = useAppStore();

    const [loadingAd, setloadingAd] = useState(false);

    const [login, setLogin] = useState<LoginRequest>({ email: "", password: "" });

    const { mutate: loginCredenRequest, status: statusLoginCredenRequest } = useLoginRequest();

    const { mutate: loginEmailRequest, status: statusloginEmailRequest } = useLoginByEmail();

    const { mutate: checkTokenRequest, status: statusCheckToken } = userToken()


    const onSuccess = (data: any) => {
        if (data.success && data.result.accessToken) {
            SetLanguage(data.result.defaultLanguage)
            localStorage.setItem(
                import.meta.env.VITE_TOKEN_KEY,
                data.result.accessToken
            );

            auth.setAuth({
                user: data.result.user,
                token: data.result.accessToken,
                provider: "browser",
            });

            const creden = {
                user: data.result.user,
                accessToken: data.result.accessToken,
                isAuthenticated: true
            }
            localStorage.setItem("AI_365_LOGIN", "cd");
            setCredential(creden)
            navigate('/');
        }
        else {
            toast.error(data.message);
        }
    }

    const loginWitCreden = async () => {

        if (!login.email || !login.password) {
            toast.error("Email and password are required");
            return;
        }

        localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY);

        loginCredenRequest(
            {
                email: login.email,
                password: login.password,
            },
            {
                onSuccess,

                onError: (error: any) => {
                    toast.error(error?.response?.data?.message ?? "Login failed");
                },
            }
        );

    };

    const loginWithAzure = async () => {
        setloadingAd(true)
        localStorage.setItem("AI_365_LOGIN", "az");
        await msalInstance.loginRedirect(loginRequest);
    };

    const checkQueryString = async (email: string) => {

        if (email)
            loginEmailRequest(
                {
                    email: email
                },
                {
                    onSuccess,

                    onError: (error: any) => {
                        toast.error(error?.response?.data?.message ?? "Login failed");
                    },
                }
            );
    }


    const checkToken = async () => {

        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);

        if (token)
            checkTokenRequest(undefined,
                {
                    onSuccess: (data) => {
                        if (data.success && data.result.accessToken) {

                            auth.setAuth({
                                user: data.result.user,
                                token: token,
                                provider: "browser",
                            });

                            SetLanguage(data.result.defaultLanguage)
                            setCredential({
                                user: data.result.user,
                                accessToken: data.result.accessToken,
                                isAuthenticated: true,
                            });
                            navigate('/');
                        } else {
                            toast.error(data.message);
                        }
                    },

                }
            );
    }



    useEffect(() => {

        //if (selectedCredential.isAuthenticated) return;
        if (inProgress !== InteractionStatus.None) return;
        if (decodedEmail) {
            checkQueryString(decodedEmail);
            return;
        }

        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);

        if (token) {
            checkToken();
            return;
        }


        if (isAuthenticated && accounts.length > 0) {
            checkQueryString(accounts[0].username);
        }

    }, [decodedEmail, isAuthenticated, accounts, inProgress]);

    if (selectedCredential.isAuthenticated) return;

    const isLoading =
        inProgress !== InteractionStatus.None ||
        statusCheckToken === "pending" ||
        loadingAd ||
        statusLoginCredenRequest === "pending" ||
        statusloginEmailRequest === "pending";
    if (isLoading)
        return (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 rounded-xl">
                <LoaderCircle className="h-8 w-8 animate-spin text-black" />
            </div>)
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <div className="relative bg-white rounded-xl shadow-xl w-[460px] p-6 z-10">

                <LoginForm statusCheckToken={statusCheckToken} login={login} setLogin={setLogin} />
                <LoginButton loginWitCreden={loginWitCreden} loginWithAzure={loginWithAzure} />

            </div>

        </div>

    );
};

export default Login;
