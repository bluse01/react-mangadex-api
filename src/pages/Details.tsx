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

interface Tags {
  attributes?: {
    name: {
      [key: string]: string;
    };
  };
  id: string;
}

interface MangaItem {
  id: string;
  relationships?: Relationships[];
  attributes?: {
    title: {
      [key: string]: string;
    };
    contentRating: string;
    status: string;
    tags: Tags[];
    description: {
      [key: string]: string;
    };
  };
}

interface ChapterResp {
  data: ChapterInt[];
  total: number;
}
interface ChapterInt {
  id: string;
  attributes: {
    chapter: string;
    publishAt: string;
    title: string | null;
  };
}

function RenderCover({ manga }: { manga: MangaItem }) {
  const coverArt = manga?.relationships?.find(
    (rel) => rel.type === "cover_art",
  );
  const fileName = coverArt?.attributes?.fileName;
  const fallbackCover = "https://w.wallhaven.cc/full/21/wallhaven-2139jy.jpg";

  const imgSrc = fileName
    ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
    : fallbackCover;

  return <img src={imgSrc} alt="cover_art" />;
}

function RenderTags({ mangaTags }: { mangaTags: Tags[] }) {
  return (
    <div className="manga-tags">
      tags:
      {mangaTags.map((tag) => {
        return tag.attributes?.name ? (
          <p key={tag.id}>{Object.values(tag.attributes?.name)[0]}</p>
        ) : null;
      })}
    </div>
  );
}

function RenderDescription({ manga }: { manga: MangaItem }) {
  const description = manga.attributes?.description["en"]
    ? manga.attributes?.description["en"]
    : Object.values(manga.attributes?.description ?? {})[0];
  return <h3>{description}</h3>;
}

function RenderChapters({
  chapterArray,
  currentPage,
}: {
  chapterArray: ChapterResp;
  currentPage: number;
}) {
  // page Chapter Target, meaing how many chapters should be in a page, this is importent so we know how many pages we need to create
  // so if we have a target = 10 and have total chapters of 43 it will create a total of 5 pages
  const pageChpTarget = 10;
  const totalPages = Math.ceil(chapterArray.total / pageChpTarget);

  return (
    <div className="chapter-page-container">
      {chapterArray.data.map((chapter) => {
        const dateObj = new Date(chapter.attributes.publishAt);
        const readableDate = dateObj.toLocaleDateString();

        return (
          <div className="chapter-block" key={chapter.id}>
            <p>{chapter.attributes.chapter}</p>
            <p>{chapter.attributes.title}</p>
            <p>{readableDate}</p>
          </div>
        );
      })}

      <div className="page-switcher">
        <button className="hardPrevious">{"<<"}</button>
        <button className="previous">{"<"}</button>
        <span>
          page {currentPage} of {totalPages}
        </span>
        <button className="next">{">"}</button>
        <button className="hardNext">{">>"}</button>
      </div>
    </div>
  );
}

export default function Details() {
  const [mangaFeed, setMangaFeed] = useState<ChapterResp>();
  const [mangaInfo, setMangaInfo] = useState<MangaItem>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const baseUrl = "https://api.mangadex.org";

  const { id } = useParams();

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMangaInfo() {
      setIsLoading(true);
      setError(null);

      try {
        const mangaInfoResponse = await axios.get(
          `https://api.mangadex.org/manga/${id}`,
          {
            timeout: 5000,
            params: {
              includes: ["cover_art", "tag"],
            },
            signal: controller.signal,
          },
        );

        setMangaInfo(mangaInfoResponse.data.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled because user clicked something new!");
        } else {
          setError("Failed to fetch mangas. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMangaInfo();

    return () => {
      controller.abort();
    };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchMangaFeed() {
      try {
        const feedResponse = await axios.get(`${baseUrl}/manga/${id}/feed`, {
          timeout: 5000,
          params: {
            "translatedLanguage[]": "en",
            limit: 10,
            order: { chapter: "asc" },
          },
          signal: controller.signal,
        });

        setMangaFeed(feedResponse.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled because user clicked something new!");
        } else {
          setError("Failed to fetch mangas. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchMangaFeed();

    return () => {
      controller.abort();
    };
  }, [id, currentPage]);

  console.log(mangaFeed);
  console.log(mangaInfo);

  return (
    <div className="container ">
      <Header />

      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState error={error} /> : null}

      <div className="main-content-container">
        <div className="head-content-container">
          {mangaInfo ? <RenderCover manga={mangaInfo} /> : null}
          <div className="manga-details">
            <h2>
              {mangaInfo?.attributes?.title
                ? Object.values(mangaInfo?.attributes?.title)[0]
                : "untitled"}
            </h2>
            <div className="manga-details-small">
              <p className="content-rating">
                {mangaInfo?.attributes?.contentRating}
              </p>
              <p className="status">{mangaInfo?.attributes?.status}</p>
            </div>
            <div className="manga-tags-wrapper">
              <RenderTags mangaTags={mangaInfo?.attributes?.tags ?? []} />
            </div>
            {mangaInfo ? <RenderDescription manga={mangaInfo} /> : null}
          </div>
        </div>

        <section className="chapter-feed-container">
          {mangaFeed ? (
            <RenderChapters
              chapterArray={mangaFeed}
              currentPage={currentPage}
            />
          ) : null}
        </section>
      </div>

      {!isLoading && mangaInfo && Object.keys(mangaInfo).length === 0 && (
        <RenderEmptyState />
      )}
    </div>
  );
}
