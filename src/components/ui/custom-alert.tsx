import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
// import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

type AlertProps = {
  type: AlertType;
  title: string;
  description: string;
  onClose?: () => void;
};

// const alertIcons = {
//   success: <CheckCircle className="text-green-500 w-5 h-5" />,
//   error: <X className="text-red-500 w-5 h-5" />,
//   warning: <AlertTriangle className="text-yellow-500 w-5 h-5" />,
//   info: <Info className="text-blue-500 w-5 h-5" />,
// };

export const CustomAlert: React.FC<AlertProps> = ({
  type,
  title,
  description,
  onClose,
}) => {
  return (
    <div
      data-aos="fade-down"
      data-aos-duration="300" //Faster animation than global for this one
      className="fixed top-4 left-0 w-full z-50 flex justify-center px-4"
    >
      <Alert
        className={cn(
          "flex items-center gap-3 p-4 rounded-md shadow-md max-w-md w-full",
          type === "success" && "bg-green-100 text-green-800",
          type === "error" && "bg-red-400 text-red-800",
          type === "warning" && "bg-yellow-100 text-yellow-800",
          type === "info" && "bg-blue-100 text-blue-800"
        )}
      >
        {/*<div className="flex items-center">{alertIcons[type]}</div>*/}
        <div className="flex-1">
          <AlertTitle className="font-medium">{title}</AlertTitle>
          <AlertDescription className="text-sm">{description}</AlertDescription>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </Alert>
    </div>
  );
};
