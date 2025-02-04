import React, { createContext, useCallback, useState } from "react";
import { AlertType, CustomAlert } from "@/components/ui/custom-alert";

type AlertContextType = {
  showAlert: (type: AlertType, title: string, description: string) => void;
};

export const AlertContext = createContext<AlertContextType | undefined>(
  undefined
);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alert, setAlert] = useState<{
    type: AlertType;
    title: string;
    description: string;
  } | null>(null);

  const showAlert = useCallback(
    (type: AlertType, title: string, description: string) => {
      setAlert({ type, title, description });
      setTimeout(() => setAlert(null), 5000); // Automatically dismiss after 5 seconds
    },
    []
  );

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      {alert && (
        <div className="fixed bottom-4 right-4">
          <CustomAlert
            type={alert.type}
            title={alert.title}
            description={alert.description}
            onClose={() => setAlert(null)}
          />
        </div>
      )}
    </AlertContext.Provider>
  );
};
