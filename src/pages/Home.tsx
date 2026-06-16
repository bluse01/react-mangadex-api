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
  const [offset, setOffset] = useState(0);

  const baseUrl = "https://api.mangadex.org";

  function handleSearch(mangaTitle: string) {
    setTitle(mangaTitle);
  }

  function loadMore(total: number) {
    const offsetCalc = offset + 10;
    if (offsetCalc > total) return;

    setOffset(offsetCalc);
  }

  useEffect(() => {
    const controller = new AbortController();

    const mangaFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${baseUrl}/manga`, {
          timeout: 5000,
          params: {
            title: title,
            limit: 10,
            offset: offset,
            "includes[]": "cover_art",
          },
          signal: controller.signal,
        });

        console.log(response.data);
        setMangaID(response.data);
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
  }, [title, offset]);

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
          onLoadMore={loadMore}
        />
      ) : null}

      {!isLoading && mangaID && mangaID.data.length === 0 && (
        <RenderEmptyState />
      )}
    </div>
  );
}
