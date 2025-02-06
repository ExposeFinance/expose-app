import React, { useState, useRef } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { PulsatingButton } from "@/components/ui/pulse-button";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

interface ChatButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void; // short press => typed
  onVoiceStart?: () => void; // begin recording
  onVoiceStop?: () => void; // stop recording
  children?: React.ReactNode;
}

export function ChatButton({
  onClick,
  onVoiceStart,
  onVoiceStop,
  children,
  ...props
}: ChatButtonProps) {
  const [voiceMode, setVoiceMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dots = useAnimatedDots(true);

  // Press down => start a timer
  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // prevents default scrolling or long-press context menus
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setVoiceMode(true);

      // **New Code: Play the recording start sound**
      const audio = new Audio("/sounds/recording-start.mp3");
      audio.play().catch((error) => {
        console.error("Error playing recording start sound:", error);
      });

      if (onVoiceStart) {
        onVoiceStart();
      }
    }, 500);
  };

  // Press ends => check if short or long press
  const handlePressEnd = () => {
    if (timerRef.current) {
      // Timer still active => short press => typed
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!voiceMode && onClick) {
        onClick();
      }
    } else {
      // Timer fired => voiceMode is active => stop recording
      if (voiceMode) {
        if (onVoiceStop) {
          onVoiceStop();
        }
        setVoiceMode(false);
      }
    }
  };

  return (
    <div
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      onTouchCancel={handlePressEnd}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onPointerLeave={handlePressEnd}
      style={{
        touchAction: "none",
        userSelect: "none", // for modern browsers
        WebkitUserSelect: "none", // iOS Safari
        WebkitTouchCallout: "none", // iOS Safari
      }}
    >
      {voiceMode ? (
        <PulsatingButton className="w-full" {...props}>
          Recording{dots}
        </PulsatingButton>
      ) : (
        <RainbowButton className="w-full" {...props}>
          {children || "Chat"}
        </RainbowButton>
      )}
    </div>
  );
}
