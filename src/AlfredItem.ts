// work flow item
export interface AlfredItem {
    uid?: string;
    type?: 'default' | 'file' | 'file:skipcheck';
    title: string;
    subtitle?: string;
    icon?: { type?: 'fileicon' | 'filetype' | undefined; path: string; };
    valid?: boolean;
    match?: string;
    mods?: {};
    arg?: string;
    text?: { copy?: string; largetype?: string; };
    quicklookurl?: string;
    autocomplete?: string;
}
