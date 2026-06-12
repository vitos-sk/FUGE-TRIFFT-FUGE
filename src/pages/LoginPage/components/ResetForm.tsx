import React, { useState } from 'react';
import { sendPasswordReset } from '@shared/services/authService';
import { Input, FormGroup, Label } from '@shared/ui/Input';
import { FormTitle, FormSubtitle, Form, ErrorMsg, SuccessMsg, BackLink, SubmitBtn } from './ResetForm.styles';

interface ResetFormProps {
  initialEmail: string;
  onBack: () => void;
}

export const ResetForm: React.FC<ResetFormProps> = ({ initialEmail, onBack }) => {
  const [resetEmail, setResetEmail] = useState(initialEmail);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);
    try {
      await sendPasswordReset(resetEmail);
      setResetSent(true);
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      if (msg.includes('user-not-found') || msg.includes('invalid-email')) {
        setResetError('E-Mail-Adresse nicht gefunden.');
      } else if (msg.includes('too-many-requests')) {
        setResetError('Zu viele Versuche. Bitte später erneut versuchen.');
      } else {
        setResetError('Fehler beim Senden. Bitte erneut versuchen.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <FormTitle>Passwort zurücksetzen</FormTitle>
      <FormSubtitle>
        {resetSent
          ? 'E-Mail gesendet'
          : 'Gib deine E-Mail ein — wir schicken dir einen Link'}
      </FormSubtitle>

      {!resetSent ? (
        <Form onSubmit={handleReset}>
          {resetError && <ErrorMsg>{resetError}</ErrorMsg>}

          <FormGroup>
            <Label>E-Mail</Label>
            <Input
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="name@beispiel.de"
              autoComplete="email"
              required
            />
          </FormGroup>

          <SubmitBtn type="submit" disabled={resetLoading} $fullWidth $size="lg">
            {resetLoading ? 'Senden…' : 'Link senden'}
          </SubmitBtn>
        </Form>
      ) : (
        <SuccessMsg>
          Wir haben einen Passwort-Reset-Link an <strong>{resetEmail}</strong> gesendet. Bitte prüfe dein Postfach.
        </SuccessMsg>
      )}

      <BackLink type="button" onClick={onBack}>← Zurück zum Login</BackLink>
    </>
  );
};
