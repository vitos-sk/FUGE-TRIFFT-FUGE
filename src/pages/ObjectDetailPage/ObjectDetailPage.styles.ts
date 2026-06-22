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

/* Desktop 2-column grid: Photos left (60%) | Notes right (40%) */
export const ContentGrid = styled.div`
  @media (min-width: 1025px) {
    display: grid;
    grid-template-columns: 60fr 40fr;
    gap: 40px;
    align-items: start;
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 1024px) {
    max-width: 680px;
    margin: 0 auto;
    width: 100%;
  }
`;

/* On desktop: Notes moves to the RIGHT column (order 2) */
export const LeftCol = styled.div`
  @media (min-width: 1025px) {
    order: 2;
  }
`;

/* On desktop: Photos moves to the LEFT column (order 1) */
export const RightCol = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 1025px) {
    order: 1;
  }

  /* Mobile: separate visually from notes above */
  @media (max-width: 1024px) {
    padding-top: 4px;
  }
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

/* The "Fuge" double-line divider: two 1px lines with a 2px gap (like a grout joint) */
export const SectionDivider = styled.div`
  height: 4px;
  position: relative;
  margin: 4px 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }

  &::before {
    top: 0;
  }

  &::after {
    bottom: 0;
  }

  /* Hidden on desktop when inside the 2-col grid (columns visually separate) */
  @media (min-width: 1025px) {
    display: none;
  }
`;

export const AdminSection = styled.section`
  padding: 20px 0;

  /* On mobile, add a Fuge divider above the admin section */
  @media (max-width: 1024px) {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: inset 0 3px 0 ${({ theme }) => theme.colors.border};
    padding-top: 24px;
    margin-top: 4px;
  }

  /* On desktop: no top border (right column context provides separation) */
  @media (min-width: 1025px) {
    padding-top: 0;
  }
`;
