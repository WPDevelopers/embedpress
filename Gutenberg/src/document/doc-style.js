const DocStyle = ({attributes}) => {
    const {
        id,
        themeMode, customColor
    } = attributes
    return (
        <style>
            {
                (themeMode === 'custom') &&
                `.ep-doc-${id} .ep-file-download-option-masked::after, .ep-doc-${id} .ep-external-doc-icons{
									background: ${customColor}
								}
								.ep-external-doc-icons svg:hover svg path{
									fill: ${customColor};
									stroke: ${customColor};
								}
								.ep-external-doc-icons svg:hover{
									background-color: ${customColor};
								}
								.ep-doc-draw-icon.active svg{
									background-color: ${customColor};
								}
								`
            }
            {
                (themeMode === 'light') &&
                `.ep-doc-${id} .ep-file-download-option-masked::after, .ep-doc-${id} .ep-external-doc-icons{
								background: #f2f2f6;
							}
							.ep-doc-${id} .ep-external-doc-icons svg path{
								fill: #343434;
							}
							.ep-doc-${id} .ep-doc-draw-icon svg path{
								fill: #f2f2f6;
								stroke: #343434;
							}
							.ep-external-doc-icons svg:hover svg path{
								fill: #343434;
								stroke: #343434;
							}
							.ep-external-doc-icons svg:hover{
								background-color: #e5e1e9;
							}
							`
            }
        </style>
    )
}

export default DocStyle;