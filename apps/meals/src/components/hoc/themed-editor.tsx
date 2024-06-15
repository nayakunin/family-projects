'use client';

import { Editor, EditorProps, Monaco } from '@monaco-editor/react';
import Color from 'color';
import { useTheme } from 'next-themes';

const getCSSVariable = (variable: string) => {
    return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export const ThemedEditor = ({ options, ...rest }: EditorProps) => {
    const { theme } = useTheme();

    const handleEditorDidMount = (monaco: Monaco) => {
        const backgroundColor = Color(`hsl(${getCSSVariable('--background')})`).hex();
        const foregroundColor = Color(`hsl(${getCSSVariable('--foreground')})`).hex();

        const base = theme === 'dark' ? 'vs-dark' : 'vs';

        monaco.editor.defineTheme('custom', {
            base,
            inherit: true,
            rules: [
                { token: 'keyword', foreground: '#65a30d' },
                { token: 'comment', foreground: '#94a3b8' },
                { token: 'variable', foreground: '#d97706' },
            ],
            colors: {
                'editor.foreground': foregroundColor,
                'editor.background': backgroundColor,
            },
        });
    };

    return (
        <Editor
            theme="custom"
            options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                quickSuggestions: false,
                contextmenu: false,
                ...options,
            }}
            {...rest}
            beforeMount={handleEditorDidMount}
        />
    );
};
