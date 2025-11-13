import type { ButtonHTMLAttributes } from 'react';
import Button from './index';

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

/**
 * Outline button component.
 */
const OutlineButton = ({ children, ...props }: OutlineButtonProps) => {
  return (
    <Button variant="outline" {...props}>
      {children}
    </Button>
  );
};

export default OutlineButton;
