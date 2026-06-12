import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
`;

export const PageTitle = styled.h1`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};

  @media (max-width: 768px) {
    align-self: flex-start;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Empty = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
  letter-spacing: 0.04em;

  &::before {
    content: "—";
    display: block;
    font-size: 28px;
    margin-bottom: 14px;
    color: ${({ theme }) => theme.colors.border};
  }
`;

export const FAB = styled.button`
  position: fixed;
  bottom: 24px;
  right: 22px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(204, 34, 34, 0.75);
  border: 1px solid rgba(204, 34, 34, 0.4);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(204, 34, 34, 0.25),
    0 2px 6px rgba(0, 0, 0, 0.4);
  transition: all ${({ theme }) => theme.transitions.spring};
  z-index: 100;

  &:hover {
    transform: scale(1.08);
    background: rgba(204, 34, 34, 0.9);
    box-shadow:
      0 6px 22px rgba(204, 34, 34, 0.35),
      0 2px 8px rgba(0, 0, 0, 0.4);
  }

  &:active {
    transform: scale(0.96);
  }

  @media (max-width: 768px) {
    bottom: 76px;
    width: 38px;
    height: 38px;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 0;
`;
