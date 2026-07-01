import React, { useState, useId } from 'react';
import { loginUser } from '@features/auth/services';
import { Input, FormGroup, Label } from '@shared/ui/Input';
import { FormTitle, FormSubtitle, Form, ErrorMsg, ForgotLink, SubmitBtn } from './LoginForm.styles';

interface LoginFormProps {
  onForgotPassword: (email: string) => void;
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onSuccess }) => {
  const emailId = useId();
  const passwordId = useId();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser(email, password);
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? '';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setError('E-Mail oder Passwort falsch.');
      } else if (msg.includes('too-many-requests')) {
        setError('Zu viele Versuche. Bitte warten.');
      } else {
        setError('Anmeldung fehlgeschlagen.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <FormTitle>Anmelden</FormTitle>
      <FormSubtitle>Einloggen um fortzufahren</FormSubtitle>

      <Form onSubmit={handleSubmit}>
        {error && <ErrorMsg>{error}</ErrorMsg>}

        <FormGroup>
          <Label htmlFor={emailId}>E-Mail</Label>
          <Input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@beispiel.de"
            autoComplete="email"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor={passwordId}>Passwort</Label>
          <Input
            id={passwordId}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
          <ForgotLink type="button" onClick={() => onForgotPassword(email)}>
            Passwort vergessen?
          </ForgotLink>
        </FormGroup>

        <SubmitBtn type="submit" disabled={loading} $fullWidth $size="lg">
          {loading ? 'Anmelden…' : 'Einloggen'}
        </SubmitBtn>
      </Form>
    </>
  );
};
