import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { Button } from '../components/ui/Button';
import { Input, FormGroup, Label } from '../components/ui/Input';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.bgPrimary};
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftPanel = styled.div`
  background: #0a0a0a;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: -120px;
    left: -120px;
    width: 480px;
    height: 480px;
    background: radial-gradient(circle, rgba(204,34,34,0.07) 0%, transparent 65%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -100px;
    right: -100px;
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, rgba(204,34,34,0.04) 0%, transparent 65%);
    pointer-events: none;
  }
`;

const BigLogo = styled.div`
  text-align: center;
  z-index: 1;
`;

const BigLogoText = styled.div`
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};
  line-height: 1.15;
  margin-bottom: 6px;

  span {
    color: ${({ theme }) => theme.colors.accent};
    display: block;
  }
`;

const Tagline = styled.p`
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-top: 22px;
`;

const AccentLine = styled.div`
  width: 36px;
  height: 2px;
  background: ${({ theme }) => theme.colors.accent};
  margin: 18px auto;
  border-radius: 9999px;
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: ${({ theme }) => theme.colors.bgPrimary};
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 360px;
  animation: ${fadeIn} 0.35s ease;
`;

const MobileLogo = styled.div`
  text-align: center;
  margin-bottom: 40px;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileLogoText = styled.div`
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textPrimary};

  span { color: ${({ theme }) => theme.colors.accent}; }
`;

const FormTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: 6px;
  letter-spacing: -0.01em;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ErrorMsg = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.accentDim};
  border: 1px solid ${({ theme }) => theme.colors.accent}44;
  border-radius: ${({ theme }) => theme.borderRadiusSm};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.accent};
  line-height: 1.4;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginUser(email, password);
      navigate('/');
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
    <Page>
      <LeftPanel>
        <BigLogo>
          <BigLogoText>
            Fuge
            <span>trifft</span>
            Fuge
          </BigLogoText>
          <AccentLine />
          <Tagline>Internes Arbeitssystem</Tagline>
        </BigLogo>
      </LeftPanel>

      <RightPanel>
        <FormCard>
          <MobileLogo>
            <MobileLogoText>Fuge <span>trifft</span> Fuge</MobileLogoText>
          </MobileLogo>

          <FormTitle>Anmelden</FormTitle>
          <FormSubtitle>Einloggen um fortzufahren</FormSubtitle>

          <Form onSubmit={handleSubmit}>
            {error && <ErrorMsg>{error}</ErrorMsg>}

            <FormGroup>
              <Label>E-Mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                autoComplete="email"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Passwort</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </FormGroup>

            <Button
              type="submit"
              disabled={loading}
              fullWidth
              $size="lg"
              style={{ marginTop: 10 }}
            >
              {loading ? 'Anmelden…' : 'Einloggen'}
            </Button>
          </Form>
        </FormCard>
      </RightPanel>
    </Page>
  );
};

export default LoginPage;
