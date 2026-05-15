import React, { useState } from 'react';
import styled from 'styled-components';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { Modal } from './Modal';
import { Input, FormGroup, Label } from './Input';
import { changePassword } from '../../services/authService';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const PasswordWrapper = styled.div`
  position: relative;
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  padding: 2px;
  &:hover { color: ${({ theme }) => theme.colors.textSecondary}; }
`;

const ErrorMsg = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
`;

const SuccessMsg = styled.p`
  font-size: 12px;
  color: #4caf50;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
`;

const Btn = styled.button<{ variant?: 'primary' | 'ghost' }>`
  padding: 9px 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  ${({ variant, theme }) =>
    variant === 'primary'
      ? `
    background: ${theme.colors.accent};
    color: #fff;
    border: 1px solid ${theme.colors.accent};
    &:hover:not(:disabled) { opacity: 0.85; }
    &:disabled { opacity: 0.4; cursor: not-allowed; }
  `
      : `
    background: transparent;
    color: ${theme.colors.textSecondary};
    border: 1px solid ${theme.colors.border};
    &:hover { border-color: ${theme.colors.borderHover}; color: ${theme.colors.textPrimary}; }
  `}
`;

function mapFirebaseError(code: string): string {
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential')
    return 'Aktuelles Passwort ist falsch.';
  if (code === 'auth/too-many-requests')
    return 'Zu viele Versuche. Bitte später erneut versuchen.';
  if (code === 'auth/weak-password')
    return 'Neues Passwort ist zu schwach (mindestens 6 Zeichen).';
  return 'Ein Fehler ist aufgetreten. Bitte erneut versuchen.';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setCurrent(''); setNext(''); setConfirm('');
    setError(''); setSuccess(false); setLoading(false);
  };

  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (next.length < 6) { setError('Neues Passwort muss mindestens 6 Zeichen haben.'); return; }
    if (next !== confirm) { setError('Passwörter stimmen nicht überein.'); return; }
    setLoading(true);
    try {
      await changePassword(current, next);
      setSuccess(true);
      setTimeout(handleClose, 1400);
    } catch (err: any) {
      setError(mapFirebaseError(err?.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Passwort ändern">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Aktuelles Passwort</Label>
          <PasswordWrapper>
            <Input
              type={showCurrent ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Aktuelles Passwort"
              required
              autoComplete="current-password"
              style={{ paddingRight: 36 }}
            />
            <EyeBtn type="button" onClick={() => setShowCurrent((v) => !v)} tabIndex={-1}>
              {showCurrent ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </EyeBtn>
          </PasswordWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Neues Passwort</Label>
          <PasswordWrapper>
            <Input
              type={showNext ? 'text' : 'password'}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              autoComplete="new-password"
              style={{ paddingRight: 36 }}
            />
            <EyeBtn type="button" onClick={() => setShowNext((v) => !v)} tabIndex={-1}>
              {showNext ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </EyeBtn>
          </PasswordWrapper>
        </FormGroup>

        <FormGroup>
          <Label>Neues Passwort bestätigen</Label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Passwort wiederholen"
            required
            autoComplete="new-password"
          />
        </FormGroup>

        {error && <ErrorMsg>{error}</ErrorMsg>}
        {success && <SuccessMsg>Passwort erfolgreich geändert!</SuccessMsg>}

        <Actions>
          <Btn type="button" variant="ghost" onClick={handleClose} disabled={loading}>
            Abbrechen
          </Btn>
          <Btn type="submit" variant="primary" disabled={loading || success}>
            {loading ? 'Speichern…' : 'Speichern'}
          </Btn>
        </Actions>
      </Form>
    </Modal>
  );
};
