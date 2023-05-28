import { epAdjustHexColor, epGetColorBrightness } from "../common/helper";
const DocStyle = ({attributes}) => {
    const {
        id,
        themeMode, customColor
    } = attributes

	
	let iconsColor = '#f2f2f6';
	if(customColor) {
		let colorBrightness = epGetColorBrightness(customColor)
		if (colorBrightness > 60) {
			iconsColor = '#343434';
		}
	}

    return (
        <style>
            {
                (themeMode === 'custom') &&
                	`
					[data-id='${id}'][data-theme-mode='custom'] {
						--viewer-primary-color: ${customColor};
						--viewer-icons-color: ${iconsColor};
						--viewer-icons-hover-bgcolor: ${epAdjustHexColor(customColor, -10)};
					
					}
					`
            }
            
        </style>
    )
}

export default DocStyle;