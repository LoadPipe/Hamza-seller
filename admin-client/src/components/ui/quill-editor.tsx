import * as React from 'react';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

const ReactQuill = React.lazy(() => import('react-quill'));
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
    ],
};

const formats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
];

interface QuillEditorProps {
    className?: string;
    value: string;
    onChange: (content: string) => void;
}

export const QuillEditor = React.forwardRef<HTMLDivElement, QuillEditorProps>(
    ({ className, value, onChange, ...props }, ref) => {
        const handleChange = (content: string) => {
            const sanitizedContent = DOMPurify.sanitize(content, {
                ALLOWED_TAGS: [
                    'strong','em','u','s',       
                    'ul', 'ol', 'li',
                    'p', 'div', 'br',
                ],
                ALLOWED_ATTR: [],
            });
            onChange(sanitizedContent);
        };



        return (
            <>
                <style>
                    {`
                        .quill-editor-wrapper .ql-toolbar.ql-snow {
                            border: 1px solid rgb(30, 41, 59);
                            border-radius: 6px 6px 0 0;
                        }

                        .quill-editor-wrapper .ql-container.ql-snow {
                            border: 1px solid rgb(30, 41, 59);
                            border-radius: 0 0 6px 6px;
                        }

                        .quill-editor-wrapper .ql-toolbar.ql-snow button .ql-stroke {
                            stroke: rgb(255, 255, 255);
                        }
                        .quill-editor-wrapper .ql-toolbar.ql-snow button .ql-fill {
                            fill: rgb(255, 255, 255);
                        }
                    `}
                </style>
                <div
                    ref={ref}
                    className={cn("quill-editor-wrapper", className)}
                >
                    <React.Suspense fallback={<div>Loading editor...</div>}>
                        <ReactQuill
                            theme="snow"
                            value={value}
                            onChange={handleChange}
                            modules={modules}
                            formats={formats}
                            {...props}
                        />
                    </React.Suspense>
                </div>
            </>
        );

    }
);

QuillEditor.displayName = 'QuillEditor';
