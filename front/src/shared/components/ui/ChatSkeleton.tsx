import { AiIcon } from "../icon/AiIcon";

export const ChatSkeletonList = ({ rows = 6 }) => {
  return (
    <div className="animate-pulse space-y-5 p-8">
      {Array.from({ length: rows }).map((_, i) => {
        const ai = i % 2 === 1;

        return (
          <div
            key={i}
            className={`flex items-end gap-2 relative ${ai ? "justify-start" : "justify-end"}`}
          >
            {ai && (
              <AiIcon size={21}    className=" mt-1 absolute top-0"/>
            )}
            <div
              className={`
                rounded-2xl px-4 py-3 
                ${ai ? "w-1/2 ml-4" : "w-1/3  bg-[#F3F4F6]"}
                ${ai ? "" : "flex flex-col items-end"}
              `}
            >
              <div className={`h-3 bg-gray-300 rounded   ${ai ? "w-1/2" : "w-full"}  mb-2`} />
              <div className={`h-3 bg-gray-300 rounded  ${ai ? "w-3/4" : "w-full"} `} />

            </div>


          </div>
        );
      })}
    </div>
  );
};
