import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatDistanceToNowStrict } from "date-fns";

import Header from "../components/Header";
import PageSwitcher from "../components/PageSwitcher";

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

interface ChapterRelationships {
  attributes: {
    name: string;
  };
  type: string;
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
  relationships: ChapterRelationships[];
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
  pageChpTarget,
  onSetPage,
}: {
  chapterArray: ChapterResp;
  currentPage: number;
  pageChpTarget: number;
  onSetPage: (current: number, total: number) => void;
}) {
  return (
    <div className="chapter-page-container">
      {chapterArray.data.map((chapter) => {
        const dateObj = new Date(chapter.attributes.publishAt);
        const rawTime = formatDistanceToNowStrict(dateObj);

        const readableDate = rawTime
          .replace(" seconds", "s")
          .replace(" second", "s")
          .replace(" minutes", "m")
          .replace(" minute", "m")
          .replace(" hours", "h")
          .replace(" hour", "h")
          .replace(" days", "d")
          .replace(" day", "d")
          .replace(" months", "mos")
          .replace(" month", "mo")
          .replace(" years", "y")
          .replace(" year", "y");

        const scanlationGroup = chapter.relationships.find(
          (rel) => rel.type === "scanlation_group",
        );

        return (
          <div className="chapter-block" key={chapter.id}>
            <div>
              <p>{chapter.attributes.chapter}</p>
              <p className="chapter-block-title">{chapter.attributes.title}</p>
            </div>
            <div>
              <p>
                {scanlationGroup?.attributes.name && (
                  <i className="fa-solid fa-users"></i>
                )}
                {scanlationGroup?.attributes.name}
              </p>
              <p>{readableDate} ago</p>
            </div>
          </div>
        );
      })}

      {chapterArray.data.length > 0 ? (
        <PageSwitcher
          totalContent={chapterArray.total}
          contentTarget={pageChpTarget}
          current={currentPage}
          onSetPage={onSetPage}
        />
      ) : (
        <RenderEmptyState />
      )}
    </div>
  );
}

export default function Details() {
  const [mangaFeed, setMangaFeed] = useState<ChapterResp>();
  const [mangaInfo, setMangaInfo] = useState<MangaItem>();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // why this matters is expalin in PageSwitcher.tsx component
  const pageChpTarget = 10;

  function setPage(current: number, total: number) {
    if (total <= current || current < 0) return;

    setCurrentPage(current);
  }

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
            "includes[]": "scanlation_group",
            limit: pageChpTarget,
            // calc the offset we need to display the correct chapters on the next page
            offset: currentPage * pageChpTarget,
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
              pageChpTarget={pageChpTarget}
              onSetPage={setPage}
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
