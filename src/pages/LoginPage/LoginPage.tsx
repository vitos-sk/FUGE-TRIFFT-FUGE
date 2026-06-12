import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { ResetForm } from './components/ResetForm';
import {
  Page,
  LeftPanel,
  BigLogo,
  BigLogoText,
  Tagline,
  AccentLine,
  RightPanel,
  FormCard,
  MobileLogo,
  MobileLogoText,
} from './LoginPage.styles';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [resetMode, setResetMode] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState('');

  const handleForgotPassword = (email: string) => {
    setPrefillEmail(email);
    setResetMode(true);
  };

  const handleBack = () => {
    setResetMode(false);
    setPrefillEmail('');
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

          {!resetMode ? (
            <LoginForm
              onForgotPassword={handleForgotPassword}
              onSuccess={() => navigate('/')}
            />
          ) : (
            <ResetForm
              initialEmail={prefillEmail}
              onBack={handleBack}
            />
          )}
        </FormCard>
      </RightPanel>
    </Page>
  );
};

export default LoginPage;
