import ExportButton from "./header/ExportButton";
import OtherButton from "./header/OtherButton";
import Title from "./header/Title";


interface ReportHeaderPros{
    totalVer:number;
    setShowVersion:()=>void;
    setShowShare:()=>void;
      pngRef: React.RefObject<HTMLDivElement | null>;
}
const ReportHeader = ({setShowVersion,setShowShare,totalVer, pngRef}:ReportHeaderPros) => {

    return (
        <div className="z-10 flex-none h-14 bg-[var(--neutral-surface)] border-b border-[var(--neutral-border)] px-8 flex items-center justify-between sticky top-0 shadow-sm">
          
            <Title totalVer ={totalVer} setShowVersion={setShowVersion}/>

            <div className="flex items-center gap-2">

                <OtherButton setShowShare={setShowShare} />

                <ExportButton pngRef={pngRef}/>

            </div>
            
        </div>
    );
};

export default ReportHeader;
