import React from "react";
import Lottie from "react-lottie-player";
import boxes from "../assets/lottie/boxes.json";
import { ActionButton } from "@/components/ui/action-button";
import { BottomSheet } from "./ui/bottom-sheet";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

export const ComingSoonSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const dots = useAnimatedDots(isOpen);

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`Shipping soon${dots}`}
      footer={
        <div className="pt-4">
          <ActionButton label="Continue" onClick={onClose} />
        </div>
      }
    >
      <Lottie
        loop
        animationData={boxes}
        play={isOpen}
        className="w-32 h-32 mx-auto pb-8"
      />
      {children}
    </BottomSheet>
  );
};
