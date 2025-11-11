import type { ButtonHTMLAttributes } from 'react';
import Button from './index';

interface SecondaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

/**
 * Secondary button component.
 */
const SecondaryButton = ({ children, ...props }: SecondaryButtonProps) => {
  return (
    <Button variant="secondary" {...props}>
      {children}
    </Button>
  );
};

export default SecondaryButton;
