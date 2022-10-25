/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    SelectControl,
    RangeControl,
    ToggleControl,
    TextControl,
} = wp.components;



export default function OpenSea({ attributes, setAttributes }) {
    const {
        limit,
        orderby,
        nftperrow,
        nftimage,
        nftcreator,
        prefix_nftcreator,
        nfttitle,
        nftprice,
        prefix_nftprice,
        nftlastsale,
        prefix_nftlastsale,
        nftbutton,
        label_nftbutton,
    } = attributes;


    const isProPluginActive = embedpressObj.is_pro_plugin_active;

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
                label={__("Item Per Row", "embedpress")}
                value={nftperrow || 3}
                onChange={(nftperrow) => setAttributes({ nftperrow })}
                min={1}
                max={6}
            />

            <ToggleControl
                label={__("Thumbnail", "embedpress")}
                checked={nftimage}
                onChange={(nftimage) => setAttributes({ nftimage })}
            />
            <ToggleControl
                label={__("Title", "embedpress")}
                checked={nfttitle}
                onChange={(nfttitle) => setAttributes({ nfttitle })}
            />

            <ToggleControl
                label={__("Creator", "embedpress")}
                checked={nftcreator}
                onChange={(nftcreator) => setAttributes({ nftcreator })}
            />
            {
                nftcreator && (
                    <TextControl
                        label={__("Creator Prefix", "embedpress")}
                        value={prefix_nftcreator}
                        onChange={(prefix_nftcreator) => setAttributes({ prefix_nftcreator })}
                    />
                )
            }

            <ToggleControl
                label={__("Show Price", "embedpress")}
                checked={nftprice}
                onChange={(nftprice) => setAttributes({ nftprice })}
            />
            {
                nftprice && (
                    <TextControl
                        label={__("Price Prefix", "embedpress")}
                        value={prefix_nftprice}
                        onChange={(prefix_nftprice) => setAttributes({ prefix_nftprice })}
                    />
                )
            }

            <ToggleControl
                label={__("Last Sale", "embedpress")}
                checked={nftlastsale}
                onChange={(nftlastsale) => setAttributes({ nftlastsale })}
            />
            {
                nftlastsale && (
                    <div className={isProPluginActive ? "pro-control-active" : "pro-control"} onClick={(e) => { this.addProAlert(e, isProPluginActive) }}>
                        <TextControl
                            label={__("Last Sale Prefix", "embedpress")}
                            value={prefix_nftlastsale}
                            onChange={(prefix_nftlastsale) => setAttributes({ prefix_nftlastsale })}
                        />

                        {
                            (!isProPluginActive) && (
                                <span className='isPro'>{__('pro', 'embedpress')}</span>
                            )
                        }
                    </div>
                )
            }

            <ToggleControl
                label={__("Show Button", "embedpress")}
                checked={nftbutton}
                onChange={(nftbutton) => setAttributes({ nftbutton })}
            />
            {
                nftbutton && (
                    <TextControl
                        label={__("Button Label", "embedpress")}
                        value={label_nftbutton}
                        onChange={(label_nftbutton) => setAttributes({ label_nftbutton })}
                    />
                )
            }


        </div>
    )
}