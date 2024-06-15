import '../../styles/github-md-theme.css';

import { useRequest } from 'ahooks';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

const result = (content: string) =>
    unified()
        .use(remarkParse) // Convert into markdown AST
        .use(remarkRehype) // Transform to HTML AST
        .use(rehypeSanitize) // Sanitize HTML input
        .use(rehypeStringify) // Convert AST into serialized HTML
        .process(content);

export const MdPreview = ({ content }: { content: string }) => {
    const { data } = useRequest(() => result(content), {
        refreshDeps: [content],
        debounceLeading: true,
    });

    return (
        <div className="border-input ring-offset-background rounded-md border p-4">
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: String(data) }} />
        </div>
    );
};
