import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeMode } from "./hooks/useThemeMode";
import AppLayout from "@/components/layout/AppLayout";
import { AlertProvider } from "@/context/AlertContext";
import Wallet from "@/pages/Wallet";

function App() {
  useThemeMode();

  return (
    <AlertProvider>
      <Router>
        <AppLayout>
          <Routes>
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chat" element={<Wallet />} />

            <Route path="*" element={<Wallet />} />
          </Routes>
        </AppLayout>
      </Router>
    </AlertProvider>
  );
}

export default App;
