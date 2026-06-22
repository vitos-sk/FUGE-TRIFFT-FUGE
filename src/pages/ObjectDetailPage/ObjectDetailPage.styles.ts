import styled from 'styled-components';

export const PageBody = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
`;

export const NotFoundText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  padding: 40px 0;
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

export const SectionLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.textMuted};
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
`;

export const SectionDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
`;

export const AdminSection = styled.section`
  padding: 20px 0;
`;
