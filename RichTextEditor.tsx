'use client';

import { useState, useRef, useCallback } from 'react';
import clsx from 'clsx';

type Props = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: string;
  className?: string;
};

type ToolbarButton = {
  command: string;
  arg?: string;
  icon: React.ReactNode;
  title: string;
};

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  {
    command: 'bold',
    title: 'Bold',
    icon: <span className="font-bold text-sm">B</span>,
  },
  {
    command: 'italic',
    title: 'Italic',
    icon: <span className="italic text-sm">I</span>,
  },
  {
    command: 'underline',
    title: 'Underline',
    icon: <span className="underline text-sm">U</span>,
  },
  {
    command: 'strikeThrough',
    title: 'Strikethrough',
    icon: <span className="line-through text-sm">S</span>,
  },
];

const HEADING_BUTTONS: ToolbarButton[] = [
  {
    command: 'formatBlock',
    arg: 'H2',
    title: 'Heading 2',
    icon: <span className="text-xs font-bold">H2</span>,
  },
  {
    command: 'formatBlock',
    arg: 'H3',
    title: 'Heading 3',
    icon: <span className="text-xs font-bold">H3</span>,
  },
  {
    command: 'formatBlock',
    arg: 'P',
    title: 'Paragraph',
    icon: <span className="text-xs">P</span>,
  },
];

const LIST_BUTTONS: ToolbarButton[] = [
  {
    command: 'insertUnorderedList',
    title: 'Bullet List',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    command: 'insertOrderedList',
    title: 'Numbered List',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.242 5.992h12m-12 6.003h12m-12 5.999h12M4.117 7.495v-3.75H2.99m1.125 3.75H2.99m1.125 0H5.24m-1.92 2.577a1.125 1.125 0 111.591 1.59l-1.83 1.83h2.16M2.99 15.745h1.125a1.125 1.125 0 010 2.25H3.74m0-.002h.375a1.125 1.125 0 010 2.25H2.99" />
      </svg>
    ),
  },
];

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = 'Start writing...',
  minHeight = 'min-h-[200px]',
  className,
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showEmbedInput, setShowEmbedInput] = useState(false);
  const [embedUrl, setEmbedUrl] = useState('');

  const execCommand = useCallback((command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    editorRef.current?.focus();
    // Trigger onChange
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const insertEmbed = () => {
    if (!embedUrl) return;

    let embedHtml = '';

    // YouTube
    const ytMatch = embedUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (ytMatch) {
      embedHtml = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:16px 0;border-radius:4px;"><iframe src="https://www.youtube.com/embed/${ytMatch[1]}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>`;
    }

    // Spotify
    if (embedUrl.includes('spotify.com')) {
      const spotifyUrl = embedUrl.replace('/track/', '/embed/track/').replace('/episode/', '/embed/episode/');
      embedHtml = `<div style="margin:16px 0;"><iframe src="${spotifyUrl}" width="100%" height="152" frameBorder="0" allowfullscreen allow="encrypted-media"></iframe></div>`;
    }

    // SoundCloud (use their oembed or direct embed URL)
    if (embedUrl.includes('soundcloud.com')) {
      embedHtml = `<div style="margin:16px 0;"><iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(embedUrl)}&color=%23C4918A&auto_play=false"></iframe></div>`;
    }

    // Generic iframe
    if (!embedHtml && embedUrl.startsWith('http')) {
      embedHtml = `<div style="margin:16px 0;"><a href="${embedUrl}" target="_blank" rel="noopener noreferrer">${embedUrl}</a></div>`;
    }

    if (embedHtml) {
      execCommand('insertHTML', embedHtml);
    }

    setEmbedUrl('');
    setShowEmbedInput(false);
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      execCommand(
        'insertHTML',
        `<img src="${url}" alt="" style="max-width:100%;height:auto;border-radius:4px;margin:12px 0;" />`
      );
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium tracking-wider uppercase text-brand-charcoal/40 mb-2">
          {label}
        </label>
      )}

      <div className="border border-brand-sky/40 rounded-brand overflow-hidden focus-within:border-brand-rose focus-within:ring-1 focus-within:ring-brand-rose/30 transition-all">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50/80 border-b border-brand-sky/30">
          {/* Text formatting */}
          {TOOLBAR_BUTTONS.map((btn) => (
            <button
              key={btn.command + (btn.arg || '')}
              type="button"
              onClick={() => execCommand(btn.command, btn.arg)}
              className="p-1.5 rounded hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}

          <span className="w-px h-5 bg-brand-charcoal/10 mx-1" />

          {/* Headings */}
          {HEADING_BUTTONS.map((btn) => (
            <button
              key={btn.arg}
              type="button"
              onClick={() => execCommand(btn.command, btn.arg)}
              className="p-1.5 rounded hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}

          <span className="w-px h-5 bg-brand-charcoal/10 mx-1" />

          {/* Lists */}
          {LIST_BUTTONS.map((btn) => (
            <button
              key={btn.command}
              type="button"
              onClick={() => execCommand(btn.command)}
              className="p-1.5 rounded hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
              title={btn.title}
            >
              {btn.icon}
            </button>
          ))}

          <span className="w-px h-5 bg-brand-charcoal/10 mx-1" />

          {/* Link */}
          <button
            type="button"
            onClick={() => { setShowLinkInput(!showLinkInput); setShowEmbedInput(false); }}
            className={clsx(
              'p-1.5 rounded transition-colors',
              showLinkInput
                ? 'bg-brand-rose/10 text-brand-rose'
                : 'hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal'
            )}
            title="Insert Link"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </button>

          {/* Image */}
          <button
            type="button"
            onClick={insertImage}
            className="p-1.5 rounded hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
            title="Insert Image"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </button>

          {/* Embed (YouTube/Spotify/SoundCloud) */}
          <button
            type="button"
            onClick={() => { setShowEmbedInput(!showEmbedInput); setShowLinkInput(false); }}
            className={clsx(
              'p-1.5 rounded transition-colors',
              showEmbedInput
                ? 'bg-brand-rose/10 text-brand-rose'
                : 'hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal'
            )}
            title="Embed Video/Audio"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
          </button>

          <span className="w-px h-5 bg-brand-charcoal/10 mx-1" />

          {/* Clear formatting */}
          <button
            type="button"
            onClick={() => execCommand('removeFormat')}
            className="p-1.5 rounded hover:bg-brand-charcoal/10 text-brand-charcoal/60 hover:text-brand-charcoal transition-colors"
            title="Clear Formatting"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
            </svg>
          </button>
        </div>

        {/* Link input bar */}
        {showLinkInput && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/50 border-b border-brand-sky/20">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="flex-1 px-3 py-1.5 text-sm bg-white border border-brand-sky/40 rounded focus:outline-none focus:border-brand-rose"
              onKeyDown={(e) => e.key === 'Enter' && insertLink()}
              autoFocus
            />
            <button
              type="button"
              onClick={insertLink}
              className="px-3 py-1.5 text-xs font-medium bg-brand-charcoal text-white rounded hover:bg-brand-forest transition-colors"
            >
              Insert
            </button>
          </div>
        )}

        {/* Embed input bar */}
        {showEmbedInput && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/50 border-b border-brand-sky/20">
            <input
              type="url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="YouTube, Spotify, or SoundCloud URL..."
              className="flex-1 px-3 py-1.5 text-sm bg-white border border-brand-sky/40 rounded focus:outline-none focus:border-brand-rose"
              onKeyDown={(e) => e.key === 'Enter' && insertEmbed()}
              autoFocus
            />
            <button
              type="button"
              onClick={insertEmbed}
              className="px-3 py-1.5 text-xs font-medium bg-brand-charcoal text-white rounded hover:bg-brand-forest transition-colors"
            >
              Embed
            </button>
          </div>
        )}

        {/* Editor area */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={clsx(
            'px-4 py-3 text-sm text-brand-charcoal leading-relaxed focus:outline-none',
            minHeight,
            'prose prose-sm max-w-none',
            '[&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2',
            '[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1',
            '[&_a]:text-brand-rose [&_a]:underline',
            '[&_img]:rounded [&_img]:max-w-full',
            '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
            '[&_iframe]:rounded [&_iframe]:w-full'
          )}
          onInput={handleInput}
          dangerouslySetInnerHTML={{ __html: value }}
          data-placeholder={placeholder}
          role="textbox"
          aria-multiline="true"
        />
      </div>
    </div>
  );
}
