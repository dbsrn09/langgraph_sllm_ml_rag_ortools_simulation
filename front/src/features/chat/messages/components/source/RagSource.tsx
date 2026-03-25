import { useState } from "react";
import type { RagReference, RagReferenceDetail } from "../../../../../models/chat.model";
import Preview from "./rag/preview";
import ToggleSourceButton from "./ToggleSourceButton";

interface MessageSourceProps {
    ragSource: RagReference[]
}

const RagSource = ({ ragSource }: MessageSourceProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openPreview, setOpenPreview] = useState({ show: false, file: "", page: 0, content: "" });

    const preview = (file: string, page: number, content: string) => {

        setOpenPreview({ show: true, file: file, page: page, content: content })

    }


    return (
        <div
            className={`text-sm  transition-all duration-500 ease-in-out overflow-hidden`}
        >
            <div className="w-full border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm">
            <ToggleSourceButton isOpen={isOpen} setIsOpen={setIsOpen} source={"rag"} />
            {isOpen && (
                ragSource?.map((data: RagReference, index: number) => (
                    <div key={index} className="p-7">
                        <div className="w-full font-bold truncate">
                            <span
       
                                className="border-b border-blue-600 hover:border-blue-800 cursor-pointer"
                            >
                                {data?.file_reference}
                            </span>
                        </div>
                        <div className="w-full ">
                            {data.file_detail_reference?.map((dataDetail: RagReferenceDetail, indexDetail: number) => (
                                <div key={indexDetail} className="mb-3 my-2 py-1">
                                    <div className="w-full overflow-hidden line-clamp-5">
                                        {dataDetail.snippet_text?.map((e, indexSnippet) => (

                                            <div key={`${indexDetail}-${indexSnippet}`} className="cursor-pointer px-3 py-1 rounded hover:bg-gray-100 transition-colors duration-200"
                                                onClick={() => preview(data?.file_reference, dataDetail.file_reference_page, e)}> - {e}</div>
                                        ))}
                                    </div>
                                    Page: {dataDetail.file_reference_page}
                                </div>))}
                        </div>
                        {/* <div className="w-full text-sm text-gray-500">Page: {data?.page}</div> */}
                    </div>
                )))}
            <Preview
                filename={openPreview.file}
                page={openPreview.page}
                content={openPreview.content}
                open={openPreview.show}
                onClose={() => { setOpenPreview({ show: false, file: "", page: 0, content: "" }) }} />
        </div></div>
    );
};

export default RagSource;
