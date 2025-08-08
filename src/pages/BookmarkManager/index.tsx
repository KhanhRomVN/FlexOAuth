import React, { useEffect, useState } from "react";
import Sidebar from "../../components/common/Sidebar";
import BookmarkGrid from "./components/BookmarkGrid";
import Header from "../../components/common/Header";
import { getBookmarks } from "../../utils/api";

const NewTabPage: React.FC = () => {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const tree = await getBookmarks();
        setBookmarks(tree[0]?.children || []);

        // Load last selected folder
        chrome.storage.local.get("lastFolderId", (result) => {
          if (result.lastFolderId) {
            setSelectedFolder(result.lastFolderId);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        setLoading(false);
      }
    };

    loadBookmarks();
  }, []);

  const handleSelectFolder = (id: string) => {
    setSelectedFolder(id);
    chrome.storage.local.set({ lastFolderId: id });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar folders={bookmarks} onSelectFolder={handleSelectFolder} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4">
          <BookmarkGrid folderId={selectedFolder} folders={bookmarks} />
        </main>
      </div>
    </div>
  );
};

export default NewTabPage;
