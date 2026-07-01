import React, { useState, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { addNote } from '@features/notes/services';
import { useAuth } from '@features/auth/hooks';
import { useToast } from "@shared/ui/Toast";
import { useAuthContext } from '@features/auth/context';
import { Form, ChatBar, ChatInput, CharCount, SendBtn, ErrorBox } from "./AddNoteForm.styles";

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
