import styled from 'styled-components';

export const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  /* Horizontal padding is handled by PageWrapper; no extra needed here */
`;

export const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 40px 0;
`;

/* Fotos/Chat switcher — same max-width as the content below so both align */
export const TabBarWrapper = styled.div`
  max-width: 680px;
  width: 100%;
  margin: 0 auto 20px;
`;

/* Single-column content: only one section (Fotos or Chat) is visible at a time */
export const ContentGrid = styled.div`
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
`;

export const SectionBlock = styled.section`
  padding: 20px 0;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

/* Section label with a 4×4 accent red square bullet */
export const SectionLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 7px;

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 4px;
    background: ${({ theme }) => theme.colors.accent};
    flex-shrink: 0;
  }
`;

export const NotesBadge = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 99px;
  padding: 1px 8px;
  line-height: 1.6;
  margin-left: auto;
`;
