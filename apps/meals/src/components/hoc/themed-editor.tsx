'use client';

import { Editor, EditorProps, Monaco } from '@monaco-editor/react';
import Color from 'color';

const getCSSVariable = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export const ThemedEditor = ({ options, ...rest }: EditorProps) => {
    const handleEditorDidMount = (monaco: Monaco) => {
        const backgroundColor = Color(`hsl(${getCSSVariable('--background')})`).hex();
        const foregroundColor = Color(`hsl(${getCSSVariable('--foreground')})`).hex();

        monaco.editor.defineTheme('custom', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.foreground': foregroundColor, // Example color for text
                'editor.background': backgroundColor, // Example color for background
            },
        });
    };

    return (
        <Editor
            width="100%"
            height="100vh"
            theme="custom"
            options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                quickSuggestions: false,
                ...options,
            }}
            {...rest}
            beforeMount={handleEditorDidMount}
        />
    );
};
