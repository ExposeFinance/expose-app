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
  const startSound = new Audio("/sounds/beep-up.wav");
  const endSound = new Audio("/sounds/beep-down.wav");

  // Press down => start a timer
  const handlePressStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault(); // prevents default scrolling or long-press context menus

    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setVoiceMode(true);

      startSound
        .play()
        .then(() => {
          // Wait until after the audio starts playing to begin recording
          setTimeout(() => {
            if (onVoiceStart) {
              onVoiceStart();
            }
          }, 300);
        })
        .catch((error) => {
          console.error("Error playing recording start sound:", error);
        });
    }, 100);
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
          endSound.play();
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
