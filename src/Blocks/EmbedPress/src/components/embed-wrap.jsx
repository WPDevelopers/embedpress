/**
 * EmbedWrap Component
 * 
 * Wrapper component for embedded content
 */
export default function EmbedWrap({ children, className, style, dangerouslySetInnerHTML, ...props }) {
    if (dangerouslySetInnerHTML) {
        return (
            <div 
                className={`embedpress-embed-wrap ${className || ''}`}
                style={style}
                dangerouslySetInnerHTML={dangerouslySetInnerHTML}
                {...props}
            />
        );
    }

    return (
        <div 
            className={`embedpress-embed-wrap ${className || ''}`}
            style={style}
            {...props}
        >
            {children}
        </div>
    );
}
