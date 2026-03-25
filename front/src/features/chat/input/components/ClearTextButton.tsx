import { X } from "lucide-react";


interface ClearTextButtonProps {
    message:string;
    setMessage: (message: string) => void;

}

const ClearTextButton = ({message, setMessage }: ClearTextButtonProps) => {

    const isEmpty = message.trim().length === 0;

    const CLearButton = `p-[8px] mr-2 text-[var(--neutral-fg-subtle)] 
    hover:text-[var(--neutral-ink)] hover:bg-[var(--neutral-elevated)]
    rounded-full transition-colors`

    return (

        !isEmpty && (
            <button onClick={() => setMessage("")}
                className={CLearButton}>
                <X size={18} />
            </button>)

    );
}

export default ClearTextButton;
