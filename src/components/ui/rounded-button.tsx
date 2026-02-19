'use client';

import React from 'react';

interface RoundedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

const RoundedButton = React.forwardRef<HTMLDivElement, RoundedButtonProps>(
    ({ children, onClick, className = '' }, ref) => {
        return (
            <div ref={ref} onClick={onClick} className={className}>
                {children}
            </div>
        );
    }
);

RoundedButton.displayName = "RoundedButton";

export default RoundedButton;
