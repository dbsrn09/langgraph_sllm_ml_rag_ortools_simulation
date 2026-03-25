interface DialogProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog = ({
  children,
  className = "p-6"
}: DialogProps) => {
  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className={`border border-gray-200 relative bg-white rounded-xl shadow-xl z-60 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};
