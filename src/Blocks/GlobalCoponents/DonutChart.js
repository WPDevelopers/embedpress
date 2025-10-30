import React from "react";

const DonutChart = ({ size = 70 }) => {
    const viewBoxSize = 100; // internal coordinate system
    const center = 50;
    const radius = 35;
    const strokeWidth = 14;

    // Calculate scale factor based on the size prop
    const scale = size / viewBoxSize;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            className="donut-chart"
            style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
        >
            {/* Background circle */} <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#E8E5F1"
                strokeWidth={strokeWidth}
            />
            {/* Desktop 60% - Purple */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#5B4E96"
                strokeWidth={strokeWidth}
                strokeDasharray="131.94 219.91"
                strokeDashoffset="0"
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="round"
            />
            {/* Mobile 40% - Light Purple */}
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#C4B5E8"
                strokeWidth={strokeWidth}
                strokeDasharray="87.96 219.91"
                strokeDashoffset="-131.94"
                transform={`rotate(-90 ${center} ${center})`}
                strokeLinecap="round"
            />
            {/* Center content */} <g> <text
                x={center}
                y="45"
                textAnchor="middle"
                fontSize="6"
                fill="#9CA3AF"
            > <tspan>•</tspan> </text> <text
                x={center}
                y="53"
                textAnchor="middle"
                fontSize="16"
                fontWeight="600"
                fill="#092161"
            >
                    15,754 </text> <text
                        x={center}
                        y="59"
                        textAnchor="middle"
                        fontSize="6"
                        fill="#778095"
                    >
                    Total Visitor </text> </g> </svg>
    );
};

export default DonutChart;
