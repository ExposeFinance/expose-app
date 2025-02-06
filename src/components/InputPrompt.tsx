import React, { forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ChatButton } from "./ChatButton";

export interface TextareaWithButtonProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleSend: () => void;
  loading: boolean;
  dots: string;
  startRecording: () => void;
  stopRecording: () => void;
}

export const TextareaWithButton = forwardRef<
  HTMLTextAreaElement,
  TextareaWithButtonProps
>(
  (
    {
      prompt,
      setPrompt,
      handleSend,
      loading,
      dots,
      startRecording,
      stopRecording,
    },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-2 space-y-2">
        <Textarea
          ref={ref}
          placeholder="Enter your message"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            // Send message on Enter (but allow Shift+Enter for new lines)
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <ChatButton
          onClick={handleSend} // short press: send typed message
          onVoiceStart={startRecording} // long press: start voice recording
          onVoiceStop={stopRecording} // release: stop recording
          disabled={loading}
          className="flex w-full"
        >
          {loading ? `Reasoning${dots}` : "Chat"}
        </ChatButton>
      </div>
    );
  }
);

TextareaWithButton.displayName = "TextareaWithButton";
