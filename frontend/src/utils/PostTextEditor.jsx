// CONVERTED tsx to JSX
// https://tiptap.dev/docs/examples/basics/default-text-editor
// STRAIGHT RIPPED FROM DOCUMENTATION

import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const extensions = [StarterKit]

function MenuBar({ editor }) {
    if (!editor) {
        return null;
    }

    const editorState = useEditorState({
        editor,
        selector: ctx => ({
            isBold: ctx.editor.isActive('bold') ?? false,
            canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
            isItalic: ctx.editor.isActive('italic') ?? false,
            canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
            isStrike: ctx.editor.isActive('strike') ?? false,
            canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
            isCode: ctx.editor.isActive('code') ?? false,
            canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
            canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
            isParagraph: ctx.editor.isActive('paragraph') ?? false,
            isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
            isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
            isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
            isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
            isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
            isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
            isBulletList: ctx.editor.isActive('bulletList') ?? false,
            isOrderedList: ctx.editor.isActive('orderedList') ?? false,
            isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
            isBlockquote: ctx.editor.isActive('blockquote') ?? false,
            canUndo: ctx.editor.can().chain().undo().run() ?? false,
            canRedo: ctx.editor.can().chain().redo().run() ?? false,
        }),
    })

    if (!editorState) {
        return null
    }

    const btnClass = (active) =>
        `px-2 py-1 ${active ? 'bg-green-600 text-white cursor-pointer' : 'bg-white text-gray-600 hover:bg-gray-100 cursor-pointer'
        }`

    return (
        <div className="control-group mb-3 flex flex-wrap gap-1">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editorState.canBold}
                className={btnClass(editorState.isBold)}
            >
                Bold
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editorState.canItalic}
                className={btnClass(editorState.isItalic)}
            >
                Italic
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editorState.canStrike}
                className={btnClass(editorState.isStrike)}
            >
                Strike
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editorState.canCode}
                className={btnClass(editorState.isCode)}
            >
                Code
            </button>
            <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()} className={btnClass(false)}>
                Clear marks
            </button>
            <button type="button" onClick={() => editor.chain().focus().clearNodes().run()} className={btnClass(false)}>
                Clear nodes
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={btnClass(editorState.isParagraph)}
            >
                Paragraph
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={btnClass(editorState.isHeading1)}
            >
                H1
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={btnClass(editorState.isHeading2)}
            >
                H2
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={btnClass(editorState.isHeading3)}
            >
                H3
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                className={btnClass(editorState.isHeading4)}
            >
                H4
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                className={btnClass(editorState.isHeading5)}
            >
                H5
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
                className={btnClass(editorState.isHeading6)}
            >
                H6
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={btnClass(editorState.isBulletList)}
            >
                Bullet list
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={btnClass(editorState.isOrderedList)}
            >
                Ordered list
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={btnClass(editorState.isCodeBlock)}
            >
                Code block
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={btnClass(editorState.isBlockquote)}
            >
                Blockquote
            </button>
            <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)}>
                Horizontal rule
            </button>
            <button type="button" onClick={() => editor.chain().focus().setHardBreak().run()} className={btnClass(false)}>
                Hard break
            </button>
            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo} className={btnClass(false)}>
                Undo
            </button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo} className={btnClass(false)}>
                Redo
            </button>
        </div>
    )
}

/* 
    FUNC COMPONENT CAN'T RECEIVE A REF AS A PROP,
    MUST USE FORWARD REF TO DRILL IT DOWN

    IMPERATIVE HANDLE USED FOR THE PARENT TO SEE THE METHODS!
    EVEN THOUGH IT'S USELESS FOR ONLY ONE METHOD LOL BUT I CAN'T
    SET THE CONTENT OF THE TEXT EDITOR TO '' ON THE PARENT COMPONENT
*/
const PostTextEditor = forwardRef(({ content, onChange }, ref) => {
    const editor = useEditor({
        extensions,
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        coreExtensionOptions: {
            clipboardTextSerializer: {
                blockSeparator: '\n',
            },
        },
        autofocus: true,
    });

    useImperativeHandle(ref, () => ({
        clear() {
            editor && editor.commands.setContent('');
        },
        setContent(targetContent) {
            editor && editor.commands.setContent(targetContent);
        },
    }));

    return (
        <div>
            <MenuBar editor={editor} className="border" />
            <EditorContent editor={editor} className="tiptap border" />
        </div>
    );
});

export default PostTextEditor
