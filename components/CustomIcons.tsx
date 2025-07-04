
import React from 'react';

// Common props for SVG to ensure consistency with a stroke-based icon style.
const svgStrokeProps = {
    viewBox: "0 0 24 24",
    width: "1em", 
    height: "1em",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

const createIcon = (SvgComponent: React.ComponentType<any>, displayName: string) => {
    const IconComponent = React.forwardRef((props: any, ref: React.Ref<HTMLSpanElement>) => (
        <span role="img" aria-label={displayName.toLowerCase()} {...props} ref={ref} className={`anticon ${props.className || ''}`}>
            <SvgComponent />
        </span>
    ));
    IconComponent.displayName = displayName;
    return IconComponent;
};

const UserOutlinedSvg = () => (
    <svg {...svgStrokeProps}>
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
);
export const CustomUserOutlined = createIcon(UserOutlinedSvg, 'UserOutlined');

const SettingOutlinedSvg = () => (
    <svg {...svgStrokeProps}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
    </svg>
);
export const CustomSettingOutlined = createIcon(SettingOutlinedSvg, 'SettingOutlined');

const DeleteOutlinedSvg = () => (
     <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
        <path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200-80h-296v-48c0-4.4 3.6-8 8-8h280c4.4 0 8 3.6 8 8v48zM731.4 855.2l-24.7-523H317.3l-24.7 523H731.4z"></path>
    </svg>
);
export const CustomDeleteOutlined = createIcon(DeleteOutlinedSvg, 'DeleteOutlined');


const SunOutlinedSvg = () => (
    <svg {...svgStrokeProps}>
        <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m4.93 19.07 1.41-1.41"/><path d="m17.66 6.34 1.41-1.41"/>
    </svg>
);
export const CustomSunOutlined = createIcon(SunOutlinedSvg, 'SunOutlined');


const MoonOutlinedSvg = () => (
    <svg {...svgStrokeProps}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
);
export const CustomMoonOutlined = createIcon(MoonOutlinedSvg, 'MoonOutlined');

const LaptopOutlinedSvg = () => (
    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
       <path d="M896 160H128c-17.7 0-32 14.3-32 32v448c0 17.7 14.3 32 32 32h288v64H320c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h416c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32H608v-64h288c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-32 448H160V224h704v384z"></path>
    </svg>
);
export const CustomLaptopOutlined = createIcon(LaptopOutlinedSvg, 'LaptopOutlined');