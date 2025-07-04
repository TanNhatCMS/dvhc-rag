// This file contains ambient module declarations for external libraries
// that are loaded via an import map in index.html. This allows the
// TypeScript compiler and IDEs to recognize these modules without them
// needing to be installed in node_modules, resolving "Cannot find module" errors.

declare module 'antd';
declare module 'react-markdown';
declare module 'remark-gfm';
declare module 'react-syntax-highlighter';

/**
 * We need to specifically declare the sub-path for the highlighter style
 * because TypeScript's module resolution doesn't automatically understand it
 * when loaded from a CDN.
 */
declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
    export const vscDarkPlus: any;
}