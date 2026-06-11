import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";

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

export default function Details() {
  const [mangaFeed, setMangaFeed] = useState([]);
  const [mangaInfo, setMangaInfo] = useState<MangaItem>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = "https://api.mangadex.org";

  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFeed() {
      setIsLoading(true);
      setError(null);

      try {
        const titleResponse = await axios.get(
          `https://api.mangadex.org/manga/${id}`,
          {
            timeout: 5000,
            signal: controller.signal,
          },
        );

        const feedResponse = await axios.get(`${baseUrl}/manga/${id}/feed`, {
          timeout: 5000,
          params: {
            "translatedLanguage[]": "en",
            limit: 10,
            order: { chapter: "asc" },
          },
          signal: controller.signal,
        });

        setMangaFeed(feedResponse.data.data);
        setMangaInfo(titleResponse.data.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled because user typed something new!");
        } else {
          setError("Failed to fetch mangas. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchFeed();

    return () => {
      controller.abort();
    };
  }, [id]);

  console.log(mangaFeed);
  console.log(mangaInfo?.attributes?.title);

  return (
    <div className="container">
      <Header />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState error={error} /> : null}

      {!isLoading && mangaInfo && Object.keys(mangaInfo).length === 0 && (
        <RenderEmptyState />
      )}
    </div>
  );
}
