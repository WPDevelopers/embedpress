const Check = ({ className = '' }) => {
    return (
        <svg
            className={className}
            width={16}
            height={16}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_554_2502)">
                <path
                    d="M3.33203 7.99984L6.66536 11.3332L13.332 4.6665"
                    stroke="#5B4E96"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_554_2502">
                    <rect width={16} height={16} fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default Check;