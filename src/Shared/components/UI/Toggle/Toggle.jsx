/**
 * Toggle Component
 * 
 * A reusable toggle/switch component.
 */

import React from 'react';
import classNames from 'classnames';

const Toggle = ({
    label,
    checked = false,
    onChange,
    disabled = false,
    help,
    className = ''
}) => {
    const toggleClasses = classNames(
        'ep-toggle',
        {
            'ep-toggle--checked': checked,
            'ep-toggle--disabled': disabled,
        },
        className
    );

    const handleChange = (e) => {
        if (!disabled) {
            onChange?.(e.target.checked, e);
        }
    };

    return (
        <div className="ep-toggle-field">
            <label className={toggleClasses}>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="ep-toggle__input"
                />
                <span className="ep-toggle__slider"></span>
                {label && (
                    <span className="ep-toggle__label">
                        {label}
                    </span>
                )}
            </label>
            
            {help && (
                <p className="ep-toggle-field__help">
                    {help}
                </p>
            )}
        </div>
    );
};

export default Toggle;
