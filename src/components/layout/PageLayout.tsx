import React from "react";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  promptInput?: React.ReactNode; // NEW
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  actionButton,
  promptInput,
}) => {
  return (
    <div className="flex flex-col h-full" data-aos="fade-in">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-scroll px-4 py-4">
        {/* Header */}
        <div className="shrink-0 text-center p-4">
          <h1 className="text-2xl font-bold text-[theme(colors.text.primary)]">
            {title}
          </h1>
        </div>

        {children}
      </div>

      {/* Prompt Input (optional) */}
      {promptInput && (
        <div className="shrink-0 sticky bottom-0 px-4 py-4 border-t border-[theme(colors.separator.primary)] z-10">
          {promptInput}
        </div>
      )}

      {/* Action Button (optional) */}
      {actionButton && (
        <div className="shrink-0 sticky bottom-0 px-4 py-4 border-t border-[theme(colors.separator.primary)] z-10">
          {actionButton}
        </div>
      )}
    </div>
  );
};
