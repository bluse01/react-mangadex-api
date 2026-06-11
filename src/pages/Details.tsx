import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Details() {
  const [mangaFeed, setMangaFeed] = useState([]);

  const baseUrl = "https://api.mangadex.org";

  const { id } = useParams();

  useEffect(() => {
    async function fetchFeed() {
      try {
        const response = await axios({
          method: "GET",
          url: `${baseUrl}/manga/${id}/feed`,
          params: {
            translatedLanguage: ["en"],
            limit: 10,
          },
        });
        console.log(response.data.data);
        setMangaFeed(response.data.data);
      } catch {
        console.log("fetchFeed error");
      }
    }

    fetchFeed();
  }, [id]);

  return (
    <Link to="/" style={{ color: "var(--blush-rose)", textDecoration: "none" }}>
      <i className="fa-solid fa-arrow-left"></i> Back to Search
    </Link>
  );
}
