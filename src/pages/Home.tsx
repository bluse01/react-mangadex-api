import axios from "axios";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import MangaList from "../components/MangaList";

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

function LoadingElements() {
  return (
    <div className="loading-container">
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
}

function RenderEmptyState() {
  return (
    <div className="empty-state">
      <i className="fa-solid fa-cloud-showers-heavy"></i>
      <p>search result return empty</p>
    </div>
  );
}

function RenderError({ error }: { error: string }) {
  return (
    <div className="error">
      <i className="fa-solid fa-circle-exclamation"></i>
      <p>{error}</p>
    </div>
  );
}

export default function Home() {
  const [mangaID, setMangaID] = useState<MangaItem[] | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = "https://api.mangadex.org";

  function handleSearch(mangaTitle: string) {
    setTitle(mangaTitle);
  }

  useEffect(() => {
    const controller = new AbortController();

    const mangaFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios({
          method: "GET",
          url: `${baseUrl}/manga`,
          params: {
            title: title,
            "includes[]": "cover_art",
          },

          signal: controller.signal,
        });

        console.log(response.data.data);
        setMangaID(response.data.data);
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
  }, [title]);

  return (
    <div className="container">
      <Header />

      <SearchBar onSearch={handleSearch} />

      {isLoading ? <LoadingElements /> : null}
      {error ? <RenderError error={error} /> : null}

      <MangaList isLoading={isLoading} error={error} mangaID={mangaID} />

      {!isLoading && mangaID && mangaID?.length === 0 && <RenderEmptyState />}
    </div>
  );
}
