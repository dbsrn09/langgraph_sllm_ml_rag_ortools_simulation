
import { useTranslation } from "react-i18next";
import { useAgentStore } from "../../../../store/agent.store";
import { AiIcon } from "../../../../shared/components/icon/AiIcon";


interface MessageWelcomeProps {
  children?: React.ReactNode;
}


const MessageWelcome = ({ children }: MessageWelcomeProps) => {

  const { t } = useTranslation();

  const { selectedBranch, selectedAgent } = useAgentStore();

  const welcome = selectedAgent.agentType == "powerbi" ? t("powerBi.welcome") : t("chatWelcome")

  return (
    <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500 p-6 pb-20">

      <div className="w-16 h-16  flex items-center justify-center mb-6">
        <AiIcon size={40} />

      </div>
      <h2 className="text-2xl font-bold text-[var(--neutral-ink)] mb-3 text-center">{welcome}</h2>
      <p className="text-[#6c737f] mb-10 text-center max-w-md">{selectedBranch.welcomePrompt}</p>
      {children}
    </div>

  );
}

export default MessageWelcome;
