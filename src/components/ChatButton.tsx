import React, { useState, useRef } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { PulsatingButton } from "@/components/ui/pulse-button";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

interface ChatVoiceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void; // short press => typed
  onVoiceStart?: () => void; // begin recording
  onVoiceStop?: () => void; // stop recording
  children?: React.ReactNode;
}

export function ChatVoiceButton({
  onClick,
  onVoiceStart,
  onVoiceStop,
  children,
  ...props
}: ChatVoiceButtonProps) {
  const [voiceMode, setVoiceMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dots = useAnimatedDots(true);

  // Press down => start a timer
  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // prevents default scrolling or long-press context menus
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setVoiceMode(true);
      if (onVoiceStart) {
        onVoiceStart();
      }
    }, 500);
  };
  // Press ends => check if short or long
  const handlePressEnd = () => {
    if (timerRef.current) {
      // Timer still active => short press => typed
      clearTimeout(timerRef.current);
      timerRef.current = null;
      if (!voiceMode && onClick) {
        onClick();
      }
    } else {
      // Timer fired => voiceMode = true => stop recording
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
      className="w-1/3"
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
