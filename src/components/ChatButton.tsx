import React, { useState, useRef } from "react";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { PulsatingButton } from "@/components/ui/pulse-button";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

interface ChatVoiceButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
}

export function ChatVoiceButton({ onClick, ...props }: ChatVoiceButtonProps) {
  const [voiceMode, setVoiceMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dots = useAnimatedDots(true);

  // When the user presses down, start a timer.
  const handlePressStart = () => {
    timerRef.current = setTimeout(() => {
      setVoiceMode(true);
    }, 500);
  };

  // When the press ends, clear the timer.
  // If the timer did not reach 500ms, fire the onClick for a normal chat action.
  // Also reset voice mode if it was activated.
  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // If voice mode wasn't activated, treat it as a normal click.
    if (!voiceMode && onClick) {
      onClick();
    }

    // If voice mode was active, reset it on release.
    if (voiceMode) {
      setVoiceMode(false);
    }
  };

  return (
    <div
      // Using both mouse and touch events for broader device support.
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className="w-1/3"
    >
      {voiceMode ? (
        <PulsatingButton className="w-full" {...props}>
          Recording{dots}
        </PulsatingButton>
      ) : (
        <RainbowButton className="w-full" {...props}>
          Chat
        </RainbowButton>
      )}
    </div>
  );
}
