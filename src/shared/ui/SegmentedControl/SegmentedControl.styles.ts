import styled, { css } from 'styled-components';

type Variant = 'default' | 'tabs';

export const SegGroup = styled.div<{ $cols?: number; $variant?: Variant }>`
  ${({ $variant, $cols }) =>
    $variant === 'tabs'
      ? css`
          display: inline-flex;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          padding: 3px;
          gap: 2px;

          @media (max-width: 560px) {
            display: flex;
            width: max-content;
            margin-left: auto;
            margin-right: auto;
            padding: 2px;
            border-radius: 8px;
          }
        `
      : css`
          display: grid;
          grid-template-columns: ${$cols !== undefined
            ? `repeat(${$cols}, 1fr)`
            : 'repeat(auto-fit, minmax(3rem, 1fr))'};
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 4px;
        `}
`;

export const SegBtn = styled.button<{ $active: boolean; $variant?: Variant }>`
  ${({ $variant, $active, theme }) =>
    $variant === 'tabs'
      ? css`
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          font-size: 12px;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          border-radius: 7px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;

          ${$active
            ? css`
                background: rgba(204, 34, 34, 0.28);
                border: 1px solid rgba(204, 34, 34, 0.55);
                color: #ff6060;
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
              `
            : css`
                background: transparent;
                border: 1px solid transparent;
                color: rgba(255, 255, 255, 0.3);
                &:hover {
                  color: rgba(255, 255, 255, 0.55);
                }
              `}

          @media (max-width: 560px) {
            padding: 5px 14px;
            font-size: 10px;
            gap: 4px;
            font-weight: 600;
            letter-spacing: 0.05em;
          }
        `
      : css`
          flex: 1;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.4;
          font-family: inherit;
          border-radius: 6px;
          border: 1px solid transparent;
          transition: all ${theme.transitions.fast};
          cursor: pointer;
          white-space: nowrap;
          min-width: 0;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;

          ${$active
            ? css`
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.14);
                color: rgba(255, 255, 255, 0.9);
                box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
              `
            : css`
                background: transparent;
                color: rgba(255, 255, 255, 0.35);
              `}

          &:hover:not(:disabled) {
            color: rgba(255, 255, 255, 0.65);
            background: rgba(255, 255, 255, 0.05);
          }

          @media (max-width: 480px) {
            font-size: 10px;
            padding: 5px 4px;
            letter-spacing: 0;
          }
        `}
`;
