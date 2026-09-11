import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useEffect, useCallback, useState } from 'react';

interface RichTextEditorProps {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

function ToolbarButton({ 
    isActive = false, 
    onClick, 
    title, 
    children,
    disabled = false,
}: { 
    isActive?: boolean; 
    onClick: () => void; 
    title: string; 
    children: React.ReactNode;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded-md transition-colors text-xs font-semibold leading-none ${
                isActive
                    ? 'bg-[#5B3E93] text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const [isFocused, setIsFocused] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
                link: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-indigo-600 underline',
                },
            }),
        ],
        content: value || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[240px] px-4 py-3 text-slate-800',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    });

    // Sync value from outside (e.g. when editing an existing article)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '');
        }
    }, [value]);

    const setLink = useCallback(() => {
        if (!editor) return;
        
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL:', previousUrl || 'https://');

        if (url === null) return; // cancelled
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    if (!editor) {
        return (
            <div className="mt-1 border border-gray-300 rounded-xl bg-white overflow-hidden animate-pulse">
                <div className="h-10 bg-slate-50 border-b border-slate-100"></div>
                <div className="h-60 p-4">
                    <div className="h-3 bg-slate-100 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`mt-1 border rounded-xl bg-white overflow-hidden transition-all ${
            isFocused ? 'border-[#5B3E93] ring-2 ring-[#5B3E93]/20' : 'border-gray-300'
        }`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50/80 border-b border-slate-100">
                {/* Text formatting */}
                <ToolbarButton
                    isActive={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    title="Bold (Ctrl+B)"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"/></svg>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    title="Italic (Ctrl+I)"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z"/></svg>
                </ToolbarButton>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                {/* Headings */}
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    title="Heading 2"
                >
                    <span className="text-[11px] font-bold tracking-tight">H2</span>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('heading', { level: 3 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    title="Heading 3"
                >
                    <span className="text-[11px] font-bold tracking-tight">H3</span>
                </ToolbarButton>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                {/* Lists */}
                <ToolbarButton
                    isActive={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    title="Bullet List"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/></svg>
                </ToolbarButton>
                <ToolbarButton
                    isActive={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    title="Numbered List"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>
                </ToolbarButton>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                {/* Link */}
                <ToolbarButton
                    isActive={editor.isActive('link')}
                    onClick={setLink}
                    title="Insert Link"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>
                </ToolbarButton>

                <div className="w-px h-5 bg-slate-200 mx-1"></div>

                {/* Blockquote / HR */}
                <ToolbarButton
                    isActive={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    title="Quote"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    title="Horizontal Rule"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="11" width="20" height="2" rx="1"/></svg>
                </ToolbarButton>
            </div>

            {/* Editor content */}
            <EditorContent editor={editor} />
            
            {/* Character count hint */}
            <div className="px-3 py-1.5 border-t border-slate-50 bg-slate-50/50 text-[10px] text-slate-400 flex justify-between">
                <span>{placeholder || 'Tulis isi berita di sini...'}</span>
                <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} karakter</span>
            </div>
        </div>
    );
}
