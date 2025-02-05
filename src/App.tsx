import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeMode } from "./hooks/useThemeMode";
import AppLayout from "@/components/layout/AppLayout";
import { AlertProvider } from "@/context/AlertContext";
import Wallet from "@/pages/Wallet";
import Chat from "./pages/Chat";
import { ThirdwebProvider } from "./context/ThirdwebContext";

function App() {
  useThemeMode();

  return (
    <ThirdwebProvider>
      <AlertProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/chat" element={<Chat />} />

              <Route path="*" element={<Chat />} />
            </Routes>
          </AppLayout>
        </Router>
      </AlertProvider>
    </ThirdwebProvider>
  );
}

export default App;
