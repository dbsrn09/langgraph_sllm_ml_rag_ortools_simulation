
import { Ellipsis } from "lucide-react";


interface ShowAllSuggestionButtonProps {
    total: number;
    setShowAll: (value: boolean) => void;
    showAll:boolean;
}

const ShowAllSuggestionButton = ({ total, showAll, setShowAll }: ShowAllSuggestionButtonProps) => {



    return (
      
            total > 2 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    title="더보기"
                >
                    <Ellipsis className="w-4 h-4" />
                </button>
            )

     
    );
};

export default ShowAllSuggestionButton;
