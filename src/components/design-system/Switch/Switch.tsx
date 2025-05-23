'use client';

import { useState } from 'react';
import clsx from 'clsx';

interface SwitchProps {
    checked?: boolean;
    onChange?: (value: boolean) => void;
}

export default function Switch({ checked = false, onChange }: SwitchProps) {
    const [isOn, setIsOn] = useState(checked);

    const toggle = () => {
        const next = !isOn;
        setIsOn(next);
        onChange?.(next);
    };

    return (
        <div
            role="switch"
            aria-checked={isOn}
            tabIndex={0}
            onClick={toggle}
            className={clsx(
                'w-9 h-5 cursor-pointer rounded-full p-[2px] transition-colors duration-300',
                'focus:outline-none focus:ring-0',
                isOn ? 'bg-blue-500' : 'bg-gray-300'
            )}
        >
            <div
                className={clsx(
                    'w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300',
                    isOn ? 'translate-x-4' : 'translate-x-0'
                )}
            />
        </div>
    );
}
