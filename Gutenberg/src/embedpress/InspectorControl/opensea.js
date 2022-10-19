/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    SelectControl,
    RangeControl,
    ToggleControl,
} = wp.components;



export default function OpenSea({ attributes, setAttributes }) {
    const {
        limit,
        orderby,
        nftperrow,
        nftimage,
        nftcreator,
        nfttitle,
        nftprice, 
        nftlastsale,
        nftbutton,
    } = attributes;

    return (
        <div>
            <RangeControl
                label={__("Limit", "embedpress")}
                value={limit}
                onChange={(limit) => setAttributes({ limit })}
                min={1}
                max={100}
            />

            <SelectControl
                label={__("Order By", "embedpress")}
                value={orderby}
                options={[
                    { label: 'ASC', value: 'asc' },
                    { label: 'DESC', value: 'desc' },
                ]}
                onChange={(orderby) => setAttributes({ orderby })}
                __nextHasNoMarginBottom
            />

            <RangeControl
                label={__("NFT Per Row", "embedpress")}
                value={nftperrow || 3}
                onChange={(nftperrow) => setAttributes({ nftperrow })}
                min={1}
                max={6}
            />

            <ToggleControl
                label={__("NFT Thumbnail", "embedpress")}
                checked={nftimage}
                onChange={(nftimage) => setAttributes({ nftimage })}
            />
            <ToggleControl
                label={__("NFT Title", "embedpress")}
                checked={nfttitle}
                onChange={(nfttitle) => setAttributes({ nfttitle })}
            />
            <ToggleControl
                label={__("NFT Creator", "embedpress")}
                checked={nftcreator}
                onChange={(nftcreator) => setAttributes({ nftcreator })}
            />
            
            <ToggleControl
                label={__("Show NFT Price", "embedpress")}
                checked={nftprice}
                onChange={(nftprice) => setAttributes({ nftprice })}
            />

            <ToggleControl
                label={__("NFT Last Sale", "embedpress")}
                checked={nftlastsale}
                onChange={(nftlastsale) => setAttributes({ nftlastsale })}
            />

            <ToggleControl
                label={__("Show NFT Button", "embedpress")}
                checked={nftbutton}
                onChange={(nftbutton) => setAttributes({ nftbutton })}
            />

        </div>
    )
}