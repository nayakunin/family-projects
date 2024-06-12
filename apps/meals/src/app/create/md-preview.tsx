import '../../styles/github-md-theme.css';

import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export const MdPreview = async ({ content }: { content: string }) => {
    const result = await unified()
        .use(remarkParse) // Convert into markdown AST
        .use(remarkRehype) // Transform to HTML AST
        .use(rehypeSanitize) // Sanitize HTML input
        .use(rehypeStringify) // Convert AST into serialized HTML
        .process(content);

    return <div className="markdown-body" dangerouslySetInnerHTML={{ __html: String(result) }} />;
};
