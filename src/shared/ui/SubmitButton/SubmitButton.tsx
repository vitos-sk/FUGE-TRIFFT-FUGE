import React from "react";
import { Button } from "../Button";
import { Spinner } from "../Spinner";

interface Props {
  loading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  /** Shows this text while loading. Defaults to children + '…' */
  loadingText?: string;
  fullWidth?: boolean;
  onClick?: () => void;
  /** Default: 'submit' */
  type?: "submit" | "button";
}

export const SubmitButton: React.FC<Props> = ({
  loading,
  disabled,
  children,
  loadingText,
  fullWidth,
  onClick,
  type = "submit",
}) => (
  <Button
    type={type}
    disabled={loading || disabled}
    $fullWidth={fullWidth}
    onClick={onClick}
  >
    {loading ? (
      <>
        <Spinner size={13} />
        {loadingText ?? null}
      </>
    ) : (
      children
    )}
  </Button>
);
