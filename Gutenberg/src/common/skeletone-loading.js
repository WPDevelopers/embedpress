import Skeleton from "./skeleton";

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;


export default function SkeletonLoaading({columns, limit, gapbetweenitem }) {

    console.log(columns);

    let repeatCol = `repeat(auto-fit, minmax(250px, 1fr))`;

    if (columns > 0) {
        repeatCol = `repeat(auto-fit, minmax(calc(${100 / columns}% - ${gapbetweenitem}px), 1fr))!important`;
    }
    const items = [];
    for (let i = 0; i < limit; i++) {
        items.push(<Skeleton/>);
    }
    return (
        <div className="wp-block-embed is-loading text-center" style={{ gridTemplateColumns: `${repeatCol}`, display: 'grid' }}>
            <div class="ep_nft_content_wrap ep_nft_grid nft_items preset-1">
                { items }
            </div>
        </div>
    )
}