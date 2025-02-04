import React from "react";

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional title
  header?: React.ReactNode; // Custom header
  footer?: React.ReactNode; // Custom footer
  children?: React.ReactNode; // Main content
};

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  header,
  footer,
}) => {
  return (
    <>
      {/* Background Overlay (Backdrop) */}
      <div
        className={`fixed inset-0 z-40 bg-background-inverse transition-opacity duration-300 ${
          isOpen ? "opacity-70" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Bottom Sheet Container */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-background-primary brightness-125 rounded-t-2xl p-6 shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } border-t border-[theme(colors.separator.primary)]`}
      >
        {/* Header */}
        {header ||
          (title && (
            <h2 className="text-2xl font-bold text-[theme(colors.text.primary)] text-center">
              {title}
            </h2>
          ))}

        {/* Content */}
        <div className="text-center text-[theme(colors.text.primary)] mt-4">
          {children}
        </div>

        {/* Footer */}
        {footer || (
          <div className="mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-background rounded-lg"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default BottomSheet;
