/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const {
    TextControl,
    SelectControl,
    RangeControl,
    ToggleControl,
} = wp.components;

export default function Youtube({attributes, setAttributes}) {

    const {
        ispagination,
        pagesize,
        columns,
        gapbetweenvideos
    } = attributes;

    return (
        <div>
            <TextControl
                label={__("Video Per Page")}
                value={pagesize}
                onChange={(pagesize) => setAttributes({ pagesize })}
                type={'number'}
                max={50}
            />
            <p>Specify the number of videos you wish to show on each page.</p>

            <SelectControl
                label={__("Column")}
                value={columns}
                options={[
                    { label: 'Auto', value: 'auto' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                    { label: '6', value: '6' },
                ]}
                onChange={(columns) => setAttributes({ columns })}
                __nextHasNoMarginBottom
            />

            <RangeControl
                label={__('Gap Between Videos')}
                value={gapbetweenvideos}
                onChange={(gap) => setAttributes({ gapbetweenvideos: gap })}
                min={1}
                max={100}
            />
            <p>Specify the gap between youtube videos.</p>

            
            <ToggleControl
                label={__("Pagination")}
                checked={ispagination}
                onChange={(ispagination) => setAttributes({ ispagination })}
            />

        </div>
    )
}
