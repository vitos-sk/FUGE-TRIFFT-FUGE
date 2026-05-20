import React, { useState, useRef } from "react";
import styled from "styled-components";
import { FiSend } from "react-icons/fi";
import { addNote } from "@shared/services/notesService";
import { useAuth } from "@shared/hooks/useAuth";
import { useToast } from "@shared/ui/Toast";
import { useAuthContext } from "@shared/context/AuthContext";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;


const ChatBar = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 6px 6px 6px 16px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.12);
  }
`;

const ChatInput = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  box-shadow: none;
  resize: none;
  font-size: 14px;

  &:focus,
  &:focus-visible {
    box-shadow: none;
    outline: none;
  }
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.5;
  min-height: 22px;
  max-height: 120px;
  padding: 5px 0;
  overflow-y: auto;
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const CharCount = styled.span<{ $warn: boolean }>`
  font-size: 10px;
  color: ${({ $warn, theme }) => ($warn ? theme.colors.accent : theme.colors.textMuted)};
  align-self: flex-end;
  padding-bottom: 10px;
  flex-shrink: 0;
  transition: color 0.15s;
`;

const SendBtn = styled.button<{ $active: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.accent : "rgba(255,255,255,0.05)"};
  color: ${({ $active }) => ($active ? "#fff" : "rgba(255,255,255,0.25)")};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.accent};
    color: #fff;
    transform: scale(1.07);
  }
  &:disabled {
    cursor: default;
  }
`;

const ErrorBox = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
`;

const MAX_CHARS = 600;

interface Props {
  objectId: string;
  objectTitle?: string;
}

export const AddNoteForm: React.FC<Props> = ({ objectId, objectTitle }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, uid } = useAuth();
  const { firebaseUser } = useAuthContext();
  const toast = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const authorName =
    user?.name || firebaseUser?.displayName || firebaseUser?.email || uid || "Unbekannt";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
    }
  };

  const submit = async () => {
    setError("");
    if (!text.trim() || !uid) return;

    setLoading(true);
    try {
      await addNote(objectId, text.trim(), "general", uid, authorName, objectTitle);
      setText("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      toast.success("Notiz hinzugefügt");
      inputRef.current?.focus();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? "";
      if (msg.includes("permission") || msg.includes("PERMISSION_DENIED")) {
        setError("Keine Berechtigung. Bitte neu einloggen.");
      } else if (
        msg.includes("offline") ||
        msg.includes("network") ||
        msg.includes("unavailable")
      ) {
        setError("Keine Verbindung. Bitte prüfe das Internet.");
      } else {
        setError("Fehler beim Speichern. Bitte erneut versuchen.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (text.trim() && !loading) submit();
    }
  };

  const charsLeft = MAX_CHARS - text.length;
  const nearLimit = charsLeft < 60;
  const canSend = !!text.trim() && !loading && text.length <= MAX_CHARS;

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {error && <ErrorBox>{error}</ErrorBox>}

      <ChatBar>
        <ChatInput
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Notiz schreiben…"
          rows={1}
        />
        {nearLimit && text.length > 0 && (
          <CharCount $warn={nearLimit}>{charsLeft}</CharCount>
        )}
        <SendBtn type="submit" $active={canSend} disabled={!canSend}>
          <FiSend size={16} />
        </SendBtn>
      </ChatBar>
    </Form>
  );
};
