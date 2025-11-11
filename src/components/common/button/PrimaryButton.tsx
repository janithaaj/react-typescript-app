import type { ButtonHTMLAttributes } from 'react';
import Button from './index';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

/**
 * Primary button component.
 */
const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => {
  return (
    <Button variant="primary" {...props}>
      {children}
    </Button>
  );
};

export default PrimaryButton;
