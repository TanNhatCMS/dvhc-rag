
import React from 'react';

const HamburgerSvg = () => (
    <svg viewBox="0 0 1024 1024" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z"></path>
    </svg>
);

const HamburgerIcon = React.forwardRef((props: any, ref: React.Ref<HTMLSpanElement>) => (
    <span role="img" aria-label="menu" {...props} ref={ref} className={`anticon ${props.className || ''}`}>
        <HamburgerSvg />
    </span>
));
HamburgerIcon.displayName = 'HamburgerIcon';

export default HamburgerIcon;