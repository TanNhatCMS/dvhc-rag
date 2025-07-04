
import React from 'react';

const LoadingSvg = () => (
    <svg 
        viewBox="0 0 24 24" 
        width="1em" 
        height="1em" 
        fill="none"
    >
        <style>
            {`
                .spinner_path {
                    transform-origin: center;
                    animation: spinner_spin 1s linear infinite;
                }
                @keyframes spinner_spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}
        </style>
        <g className="spinner_path" stroke="currentColor">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeWidth="2" strokeLinecap="round"/>
        </g>
    </svg>
);

const LoadingIcon = React.forwardRef((props: any, ref: React.Ref<HTMLSpanElement>) => (
    <span role="img" aria-label="loading" {...props} ref={ref} className={`anticon ${props.className || ''}`}>
        <LoadingSvg />
    </span>
));
LoadingIcon.displayName = 'LoadingIcon';

export default LoadingIcon;