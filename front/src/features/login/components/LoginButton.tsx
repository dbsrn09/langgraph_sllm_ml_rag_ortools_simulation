
import ms_img from "@/assets/img/microsoft.png";
import { LoaderCircle } from "lucide-react";


interface LoginButtonProps {
  loginWitCreden:()=>void;
  loginWithAzure:()=>void;
}
const LoginButton = ({loginWitCreden,loginWithAzure}:LoginButtonProps) => {



  return (
    <>
      <button
        className="w-full mb-3 py-2 rounded-lg bg-black text-white"
        onClick={loginWitCreden}
        disabled={status === "pending"}
      >
        {status === "pending" ? <LoaderCircle className="animate-spin m-auto" /> : "Sign in"}
      </button>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300" />
        <span className="mx-3 text-xs text-gray-500">OR CONTINUE WITH</span>
        <div className="flex-grow border-t border-gray-300" />
      </div>

      <button
        disabled={status === "pending"}
        onClick={loginWithAzure}
        className="w-full py-2 rounded-lg bg-white text-black border border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-900 hover:text-white transition"
      >
        <img src={ms_img} className="h-4" />
        <span>Sign in with Microsoft</span>
      </button>
    </>

  );
};

export default LoginButton;
