/**
 * WordPress dependencies
 */

export default function ContentShare({ attributes }) {

    const {
        sharePosition,
        shareFacebook,
        shareTwitter,
        sharePinterest,
        shareLinkedin,
        pageUrl, // e.g., "https://yourdomain.com/page?hash=..." 
        customTitle = '',
        customDescription = '',
        customThumbnail = ''
    } = attributes;

    const encodedUrl = encodeURIComponent(pageUrl || window.location.href);
    const encodedTitle = encodeURIComponent(customTitle);
    const encodedDescription = encodeURIComponent(customDescription);
    const encodedThumbnail = encodeURIComponent(customThumbnail);

    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    const pinterestUrl = `http://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedThumbnail}&description=${encodedDescription}`;
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`;

    return (
        <div className={`ep-social-share share-position-${sharePosition}`}>
            {shareFacebook !== false && (
                <a href={facebookUrl} className="ep-social-icon facebook" target="_blank" rel="noopener noreferrer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 -6 512 512"
                    >
                        <g>
                            <path fill="#475a96" d="M0 0h512v500H0z"></path>
                            <path
                                fill="#fff"
                                d="M375.717 112.553H138.283c-8.137 0-14.73 6.594-14.73 14.73v237.434c0 8.135 6.594 14.73 14.73 14.73h127.826V276.092h-34.781v-40.28h34.781v-29.705c0-34.473 21.055-53.244 51.807-53.244 14.73 0 27.391 1.097 31.08 1.587v36.026l-21.328.01c-16.725 0-19.963 7.947-19.963 19.609v25.717h39.887l-5.193 40.28h-34.693v103.355h68.012c8.135 0 14.73-6.596 14.73-14.73V127.283c-.001-8.137-6.596-14.73-14.731-14.73z"
                            ></path>
                        </g>
                    </svg>
                </a>
            )}

            {shareTwitter !== false && (
                <a href={twitterUrl} className="ep-social-icon twitter" target="_blank" rel="noopener noreferrer">
                    <svg viewBox="0 0 24 24" aria-hidden="true" fill="#fff" class="r-4qtqp9 r-yyyyoo r-dnmrzs r-bnwqim r-lrvibr r-m6rgpd r-lrsllp r-1nao33i r-16y2uox r-8kz0gk"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                </a>
            )}

            {sharePinterest !== false && (
                <a href={pinterestUrl} className="ep-social-icon pinterest" target="_blank" rel="noopener noreferrer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1200"
                        height="800"
                        viewBox="-36.42 -60.8 315.641 364.8"
                    >
                        <path
                            fill="#fff"
                            d="M121.5 0C54.4 0 0 54.4 0 121.5 0 173 32 217 77.2 234.7c-1.1-9.6-2-24.4.4-34.9 2.2-9.5 14.2-60.4 14.2-60.4s-3.6-7.3-3.6-18c0-16.9 9.8-29.5 22-29.5 10.4 0 15.4 7.8 15.4 17.1 0 10.4-6.6 26-10.1 40.5-2.9 12.1 6.1 22 18 22 21.6 0 38.2-22.8 38.2-55.6 0-29.1-20.9-49.4-50.8-49.4-34.6 0-54.9 25.9-54.9 52.7 0 10.4 4 21.6 9 27.7 1 1.2 1.1 2.3.8 3.5-.9 3.8-3 12.1-3.4 13.8-.5 2.2-1.8 2.7-4.1 1.6-15.2-7.1-24.7-29.2-24.7-47.1 0-38.3 27.8-73.5 80.3-73.5 42.1 0 74.9 30 74.9 70.2 0 41.9-26.4 75.6-63 75.6-12.3 0-23.9-6.4-27.8-14 0 0-6.1 23.2-7.6 28.9-2.7 10.6-10.1 23.8-15.1 31.9 11.4 3.5 23.4 5.4 36 5.4 67.1 0 121.5-54.4 121.5-121.5C243 54.4 188.6 0 121.5 0z"
                        ></path>
                    </svg>
                </a>
            )}

            {shareLinkedin !== false && (
                <a href={linkedinUrl} className="ep-social-icon linkedin" target="_blank" rel="noopener noreferrer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="800"
                        height="800"
                        fill="#fff"
                        version="1.1"
                        viewBox="0 0 310 310"
                        xmlSpace="preserve"
                    >
                        <g>
                            <path d="M72.16 99.73H9.927a5 5 0 00-5 5v199.928a5 5 0 005 5H72.16a5 5 0 005-5V104.73a5 5 0 00-5-5z"></path>
                            <path d="M41.066.341C18.422.341 0 18.743 0 41.362 0 63.991 18.422 82.4 41.066 82.4c22.626 0 41.033-18.41 41.033-41.038C82.1 18.743 63.692.341 41.066.341z"></path>
                            <path d="M230.454 94.761c-24.995 0-43.472 10.745-54.679 22.954V104.73a5 5 0 00-5-5h-59.599a5 5 0 00-5 5v199.928a5 5 0 005 5h62.097a5 5 0 005-5V205.74c0-33.333 9.054-46.319 32.29-46.319 25.306 0 27.317 20.818 27.317 48.034v97.204a5 5 0 005 5H305a5 5 0 005-5V194.995c0-49.565-9.451-100.234-79.546-100.234z"></path>
                        </g>
                    </svg>
                </a>
            )}
        </div>
    )
}
