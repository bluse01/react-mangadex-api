import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header";

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

  const baseUrl = "https://api.mangadex.org";

  const { id } = useParams();

  useEffect(() => {
    async function fetchFeed() {
      try {
        const titleResponse = await axios.get(
          `https://api.mangadex.org/manga/${id}`,
          {
            timeout: 5000,
          },
        );

        const feedResponse = await axios.get(`${baseUrl}/manga/${id}/feed`, {
          timeout: 5000,
          params: {
            "translatedLanguage[]": "en",
            limit: 10,
            order: { chapter: "asc" },
          },
        });

        setMangaFeed(feedResponse.data.data);
        setMangaInfo(titleResponse.data.data);
      } catch {
        console.log("fetchFeed error");
      }
    }

    fetchFeed();
  }, [id]);

  console.log(mangaFeed);
  console.log(mangaInfo?.attributes?.title);

  return <Header />;
}
