
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "../../store/app.store";
import SidebarLayout from "../layout/sidebar/SidebarLayout";
import ContentLayout from "../layout/content/ContentLayout";
import { useNavigate, useParams } from "react-router-dom";
import { userToken } from "../../services/auth/userToken";
import { useLoginByEmail } from "../../services/auth/userLoginByEmail";
import { SetLanguage } from "../../shared/hooks/SetLanguage";
import { toast } from "sonner";
import { useEffect } from "react";
import { useAuth } from "../auth/auth.fetch";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { LoaderCircle } from "lucide-react";
import { isLangGraphLocal } from "../../langgraph/localMode";
import { LANGGRAPH_AGENT_ID, LANGGRAPH_SUGGESTIONS } from "../../langgraph/mockWorkspace";
import { useAgentStore } from "../../store/agent.store";

const MainPage = () => {

    const navigate = useNavigate();

    const { expandHeader, setCredential } = useAppStore();
    const { setCompany, setBranch, setWorkspace, setAgent, selectedAgent } = useAgentStore();

    const { email } = useParams<{ email?: string }>();

    const auth = useAuth();

    const decodedEmail = email ? decodeURIComponent(email) : null;

    const { mutate: checkTokenRequest, status: statusCheckToken } = userToken()

    const { mutate: loginEmailRequest } = useLoginByEmail();

    const isAuthenticated = useIsAuthenticated();

    const { accounts, inProgress } = useMsal();

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const checkQueryString = async (email: string) => {

        if (!isValidEmail(email)) {

            toast.error("Invalid email format");
            navigate("/")
            return;
        }

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

                        } else {
                            toast.error(data.message);
                            //navigate('/Login');
                        }
                    },

                }
            );
    }

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

            setCredential(creden)

        }
        else {
            toast.error(data.message);
        }
    }

    useEffect(() => {
        if (isLangGraphLocal()) {
            const tk = import.meta.env.VITE_TOKEN_KEY || "VITE_TOKEN_KEY";
            localStorage.setItem(tk, "local-dev-token");
            SetLanguage("ko");
            auth.setAuth({
                user: { name: "Local", email: "local@dev", defaultLang: "ko" },
                token: "local-dev-token",
                provider: "browser",
            });
            setCredential({
                user: { name: "Local", email: "local@dev", defaultLang: "ko" },
                accessToken: "local-dev-token",
                isAuthenticated: true,
            });
            setCompany({ companyId: "local-corp", companyName: "LangGraph Local" });
            setBranch({
                branchId: "local-branch",
                branchName: "본사",
                botName: "Ops Assistant",
                welcomePrompt: "운영 데이터에 대해 질문해 보세요.",
                logo: "",
                bgImg: "",
            });
            setWorkspace({ workspaceId: "ws-local-1" });
            setAgent({
                id: LANGGRAPH_AGENT_ID,
                agentType: "text2sql_rag",
                dataAgentSuggestion: LANGGRAPH_SUGGESTIONS,
            });
            return;
        }

        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY);

        if (decodedEmail) {
            checkQueryString(decodedEmail);
            return;
        }

        if (isAuthenticated && accounts.length > 0) {
            checkQueryString(accounts[0].username);
            return;
        }

        if (token) {
            checkToken();
            return;
        } else {
            const l = localStorage.getItem("AI_365_LOGIN");

            if (l == "az" && inProgress != "none") return;

            navigate('/Login');

        }



    }, [decodedEmail, isAuthenticated, accounts]);

    /** 회사/지점 로드 후 예전 로직이 에이전트를 비우는 경우 복구 */
    useEffect(() => {
        if (!isLangGraphLocal()) return;
        if (selectedAgent.id === LANGGRAPH_AGENT_ID && selectedAgent.agentType === "text2sql_rag") return;
        setWorkspace({ workspaceId: "ws-local-1" });
        setAgent({
            id: LANGGRAPH_AGENT_ID,
            agentType: "text2sql_rag",
            dataAgentSuggestion: LANGGRAPH_SUGGESTIONS,
        });
    }, [selectedAgent.id, selectedAgent.agentType, setAgent, setWorkspace]);


    return (

        <div className="min-h-screen w-full">
            {statusCheckToken === "pending" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    <div className="relative bg-white rounded-xl shadow-xl w-[460px] p-6 z-10">

                        {statusCheckToken === "pending" && (
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <LoaderCircle className=" animate-spin" />
                                <span>Checking authorization…</span>
                            </div>
                        )} </div>
                </div>
            )}
            {/* <LoginComponent /> */}

            <AnimatePresence initial={false}>

                <motion.div
                    key={"sidebar_1"}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className={`${expandHeader ? "h-[calc(100vh)]" : "h-[calc(100vh-1px)]"} flex`}
                >

                    <SidebarLayout />

                    <ContentLayout />

                </motion.div>

            </AnimatePresence>

        </div>
    );
}

export default MainPage;
