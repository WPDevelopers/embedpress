/**
 * Shared Button Component
 * 
 * A reusable button component that can be used across
 * Gutenberg blocks, Elementor widgets, and Admin UI.
 */

import React from 'react';
import classNames from 'classnames';
// import './Button.scss'; // Commented out to avoid Vite processing issues

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon = null,
    iconPosition = 'left',
    fullWidth = false,
    onClick,
    type = 'button',
    className = '',
    ...props
}) => {
    const buttonClasses = classNames(
        'ep-button',
        `ep-button--${variant}`,
        `ep-button--${size}`,
        {
            'ep-button--disabled': disabled,
            'ep-button--loading': loading,
            'ep-button--full-width': fullWidth,
            'ep-button--icon-right': icon && iconPosition === 'right',
        },
        className
    );

    const handleClick = (e) => {
        if (disabled || loading) {
            e.preventDefault();
            return;
        }
        onClick?.(e);
    };

    return (
        <button
            type={type}
            className={buttonClasses}
            disabled={disabled || loading}
            onClick={handleClick}
            {...props}
        >
            {loading && (
                <span className="ep-button__spinner">
                    <svg className="ep-spinner" viewBox="0 0 24 24">
                        <circle
                            className="ep-spinner__path"
                            cx="12"
                            cy="12"
                            r="10"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray="31.416"
                            strokeDashoffset="31.416"
                        />
                    </svg>
                </span>
            )}
            
            {icon && iconPosition === 'left' && !loading && (
                <span className="ep-button__icon ep-button__icon--left">
                    {icon}
                </span>
            )}
            
            <span className="ep-button__text">
                {children}
            </span>
            
            {icon && iconPosition === 'right' && !loading && (
                <span className="ep-button__icon ep-button__icon--right">
                    {icon}
                </span>
            )}
        </button>
    );
};

export default Button;
