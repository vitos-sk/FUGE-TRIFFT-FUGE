import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import { GlobalStyles } from '../../styles/GlobalStyles';
import { AuthProvider } from '@features/auth/context';
import { ToastProvider } from '@shared/ui/Toast';
import { ConfirmProvider } from '@shared/ui/ConfirmDialog';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <ToastProvider>
        <ConfirmProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  </BrowserRouter>
);
