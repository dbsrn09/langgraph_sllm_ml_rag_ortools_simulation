import { X } from "lucide-react";

interface ChatRagPreviewPdfProps {
  filename: string;
  page: number;
  content: string;
  open: boolean;
  onClose: () => void;
}

const Preview = ({
  filename,
  page,
  content,
  open,
  onClose,
}: ChatRagPreviewPdfProps) => {

  if (!open) return null;

  const url = `${import.meta.env.VITE_BASE_API_URL}/chat/previewPdf/${filename}/${page}/${encodeURIComponent(content)}`;



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white w-[90vw] h-[90vh] rounded-lg shadow-lg relative overflow-hidden">
        

        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h2 className="text-sm font-semibold truncate">
            PDF Preview — {filename}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl"
          >
          <X />
          </button>
        </div>

 
        <iframe
          src={url}
          className="w-full h-full border-0"
          title="PDF Preview"
        />
      </div>
    </div>
  );
};

export default Preview;
