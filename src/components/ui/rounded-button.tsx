'use client';

import React from 'react';

interface RoundedButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function RoundedButton({ children, onClick, className = '' }: RoundedButtonProps) {
    return (
        <div onClick={onClick} className={className}>
            {children}
        </div>
    );
}
