import React, { useState } from "react";
// import "./EPSelectControl.scss";

const EPSelectControl = ({ multiple, label, value, options, onChange }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleSelectOption = (option) => {
        if (!multiple) {
            onChange([option]);
            setIsDropdownOpen(false); // Close dropdown for single select
        } else {
            if (value.includes(option)) {
                onChange(value.filter((item) => item !== option));
            } else {
                const updatedSelection = [...value, option];
                if (updatedSelection.includes("") && updatedSelection.length > 1) {
                    // Remove "Any" if other options are selected
                    onChange(updatedSelection.filter((item) => item !== ""));
                } else {
                    onChange(updatedSelection);
                }
            }
        }
    };

    return (
        <div className="ep-select-control">
            <label className="ep-select-control-label">{label}</label>
            <div className="dropdown">
                <div className="dropdown-header" onClick={toggleDropdown}>
                    {value.length > 0
                        ? options
                            .filter((option) => value.includes(option.value))
                            .map((option) => option.label)
                            .join(", ")
                        : "Select options..."}

                    <span className="arrow-dropdown">
                        {!isDropdownOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1e1e1e"><path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1e1e1e"><path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" /></svg>
                        )}

                    </span>
                </div>
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.value}
                                    className={`dropdown-item ${value.includes(option.value) ? "selected" : ""
                                        }`}
                                    onClick={() => handleSelectOption(option.value)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={value.includes(option.value)}
                                        onChange={() => handleSelectOption(option.value)}
                                    />
                                    <label>{option.label}</label>
                                </div>
                            ))
                        ) : (
                            <div className="no-options">No options found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EPSelectControl;
