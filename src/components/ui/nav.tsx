import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Lock, MessageCircle, ArrowLeftRight, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { ComingSoonSheet } from "../ComingSoonBottomSheet";

const navItems = [
  { name: "Wallet", icon: <Lock />, path: "/wallet" },
  { name: "Chat", icon: <MessageCircle />, path: "/chat" },
  { name: "Orders", icon: <ArrowLeftRight />, path: "/orders" },
  { name: "Settings", icon: <Settings />, path: "/settings" },
];

export default function NavBar() {
  const location = useLocation();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetContent, setBottomSheetContent] = useState("");

  const openBottomSheet = (content: string) => {
    setBottomSheetContent(content);
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    setIsBottomSheetOpen(false);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="border-t border-[theme(colors.separator.primary)]">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;

            if (item.path === "/orders" || item.path === "/settings") {
              // Show Bottom Sheet for not launched features
              return (
                <div
                  key={item.name}
                  onClick={() =>
                    openBottomSheet(
                      `Soon you'll be able to mange your agent settings and monitor automated orders made by your agent!`
                    )
                  }
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 text-sm px-3 py-1 transition-all duration-200",
                    isActive
                      ? "text-[theme(colors.text.accent)]"
                      : "text-[theme(colors.text.primary)] hover:text-[theme(colors.text.accent)]"
                  )}
                >
                  <div className="w-6 h-6">{item.icon}</div>
                  <span>{item.name}</span>
                </div>
              );
            }

            // Navigate normally for other paths
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-sm px-3 py-1 transition-all duration-200",
                  isActive
                    ? "text-[theme(colors.text.accent)]"
                    : "text-[theme(colors.text.primary)] hover:text-[theme(colors.text.accent)]"
                )}
              >
                <div className="w-6 h-6">{item.icon}</div>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Sheet */}
      <ComingSoonSheet isOpen={isBottomSheetOpen} onClose={closeBottomSheet}>
        <p className="">{bottomSheetContent}</p>
      </ComingSoonSheet>
    </>
  );
}
