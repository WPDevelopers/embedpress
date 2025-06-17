/**
 * Input Component
 * 
 * A reusable input component.
 */

import React from 'react';
import classNames from 'classnames';

const Input = ({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    help,
    error,
    disabled = false,
    className = '',
    style = {},
    ...props
}) => {
    const inputClasses = classNames(
        'ep-input',
        {
            'ep-input--error': error,
            'ep-input--disabled': disabled,
        },
        className
    );

    const handleChange = (e) => {
        onChange?.(e.target.value, e);
    };

    return (
        <div className="ep-input-field" style={style}>
            {label && (
                <label className="ep-input-field__label">
                    {label}
                </label>
            )}
            
            <input
                type={type}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                className={inputClasses}
                {...props}
            />
            
            {help && !error && (
                <p className="ep-input-field__help">
                    {help}
                </p>
            )}
            
            {error && (
                <p className="ep-input-field__error">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
