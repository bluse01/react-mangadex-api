import axios from "axios";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import MangaList from "../components/MangaList";

// state imports
import LoadingState from "../components/states/LoadingState";
import RenderEmptyState from "../components/states/EmptyState";
import ErrorState from "../components/states/ErrorState";

interface Relationships {
  id: string;
  type: string;
  attributes?: {
    fileName: string;
  };
}

interface MangaItem {
  id: string;
  relationships?: Relationships[];
  attributes?: {
    title: {
      [key: string]: string;
    };
  };
}

interface DataMangaItem {
  data: MangaItem[];
  total: number;
}

export default function Home() {
  const [mangaID, setMangaID] = useState<DataMangaItem>();
  const [title, setTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [mangaCache, setMangaCache] = useState<{
    [page: number]: DataMangaItem;
  }>({});

  // why this matters is expalin in PageSwitcher.tsx component
  const pageChpTarget = 15;

  const baseUrl = "https://api.mangadex.org";

  function handleSearch(mangaTitle: string) {
    setTitle(mangaTitle);
    setCurrentPage(0);
    setMangaCache({});
  }

  function setPage(current: number, total: number) {
    if (total <= current || current < 0) return;

    setCurrentPage(current);
  }

  useEffect(() => {
    const checkCache = async () => setMangaID(mangaCache[currentPage]);

    if (mangaCache[currentPage]) {
      checkCache();
      return;
    }

    const controller = new AbortController();

    const mangaFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${baseUrl}/manga`, {
          timeout: 5000,
          params: {
            title: title,
            limit: pageChpTarget,
            offset: currentPage * pageChpTarget,
            "includes[]": "cover_art",
          },
          signal: controller.signal,
        });

        console.log(response.data);
        setMangaID(response.data);
        setMangaCache((prev) => ({
          ...prev,
          [currentPage]: response.data,
        }));
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled because user typed something new!");
        } else {
          setError("Failed to fetch mangas. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    mangaFetch();

    return () => {
      controller.abort();
    };
  }, [title, currentPage, mangaCache]);

  console.log("cache", mangaCache);
  return (
    <div className="container">
      <Header />

      <SearchBar onSearch={handleSearch} />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState error={error} /> : null}

      {mangaID ? (
        <MangaList
          isLoading={isLoading}
          error={error}
          mangaID={mangaID}
          contentTarget={pageChpTarget}
          total={mangaID.total}
          current={currentPage}
          onSetPage={setPage}
        />
      ) : null}

      {!isLoading && mangaID && mangaID.data.length === 0 && (
        <RenderEmptyState />
      )}
    </div>
  );
}
