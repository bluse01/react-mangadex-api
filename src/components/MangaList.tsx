import { Link } from "react-router-dom";
import PageSwitcher from "./PageSwitcher";

interface MangaListProps {
  isLoading: boolean;
  error: string | null;
  mangaID: DataMangaItem;
  contentTarget: number;
  total: number;
  current: number;
  onSetPage: (current: number, total: number) => void;
}

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

interface MangaArray {
  mangas: DataMangaItem;
}

function MangaCards({ mangas }: MangaArray) {
  const fallbackCover = "https://w.wallhaven.cc/full/21/wallhaven-2139jy.jpg";

  return (
    <>
      {mangas.data.map((manga) => {
        const coverArt = manga.relationships?.find(
          (rel) => rel.type === "cover_art",
        );
        const fileName = coverArt?.attributes?.fileName;

        const titleObject = manga.attributes?.title;
        const mainTitle = titleObject ? Object.values(titleObject)[0] : null;

        const imgScr = fileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}`
          : fallbackCover;

        return (
          <Link to={`/manga/${manga.id}`} key={manga.id}>
            <div className="manga-card">
              <img src={imgScr} alt="cover_art" />
              <h3>{mainTitle ? mainTitle : "Unkown Title"}</h3>
            </div>
          </Link>
        );
      })}
    </>
  );
}

export default function MangaList({
  isLoading,
  error,
  mangaID,
  contentTarget,
  total,
  current,
  onSetPage,
}: MangaListProps) {
  return (
    <div className="manga-container">
      <div className="manga-card-wrapper">
        {!isLoading && !error && mangaID ? (
          <MangaCards mangas={mangaID} />
        ) : null}
      </div>

      {!isLoading && !error && mangaID.data.length > 0 && mangaID ? (
        <PageSwitcher
          totalContent={total}
          contentTarget={contentTarget}
          current={current}
          onSetPage={onSetPage}
        />
      ) : null}
    </div>
  );
}
