// @ts-ignore
const chrome = window.chrome;

export const getBookmarks = (): Promise<any[]> => {
    return new Promise(resolve => {
        chrome.bookmarks.getTree(resolve);
    });
};

export const createBookmark = (bookmark: any): Promise<any> => {
    return new Promise(resolve => {
        chrome.bookmarks.create(bookmark, resolve);
    });
};

export const createFolder = (folder: any): Promise<any> => {
    return new Promise(resolve => {
        chrome.bookmarks.create(folder, resolve);
    });
};

export const removeBookmark = (id: string): Promise<void> => {
    return new Promise(resolve => {
        chrome.bookmarks.remove(id, resolve);
    });
};