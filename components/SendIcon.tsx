
import React from 'react';

const SendSvg = () => (
    <svg viewBox="64 64 896 896" focusable="false" data-icon="send" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M931.4 498.9L424.7 76.6c-19.8-16.2-48.6-14.6-66.5 4.2L244 193.7c-17.9 18.7-19.4 47.5-3.2 67.3l154.5 189.7-154.5 189.7c-16.2 19.8-14.6 48.6 4.2 66.5l114.2 112.9c17.9 18.7 47.5 19.4 67.3 3.2l506.7-422.3c19.8-16.2 21.4-45.9 3.2-65.7zM294.2 245.3l50.8-52.9 414.9 339.4-414.9 339.4-50.8-52.9 201.7-248.3H224c-17.7 0-32-14.3-32-32s14.3-32 32-32h271.9L294.2 245.3z"></path>
    </svg>
);

const SendIcon = React.forwardRef((props: any, ref: React.Ref<HTMLSpanElement>) => (
    <span role="img" aria-label="send" {...props} ref={ref} className={`anticon ${props.className || ''}`}>
        <SendSvg />
    </span>
));
SendIcon.displayName = 'SendIcon';

export default SendIcon;