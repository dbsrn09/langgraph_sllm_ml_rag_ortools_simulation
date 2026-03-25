import { CircleSlash2 } from "lucide-react";


const EmptyWorkspace = ({}) => {

        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <CircleSlash2 size={44} className="text-[#347298]" />
                <div className="text-md font-medium text-gray-500 mt-8">
                    No Workspace found
                </div>
                <div className="mt-1 text-sm text-gray-400">
                    Please add a new Workspace
                </div>
            </div>
        )

  
};

export default EmptyWorkspace;
