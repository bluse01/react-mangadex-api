import { Link } from "react-router-dom";

interface MangaListProps {
  isLoading: boolean;
  error: string | null;
  mangaID: DataMangaItem;
  onLoadMore: (total: number) => void;
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
  onLoadMore,
}: MangaListProps) {
  return (
    <div className="manga-container">
      <div className="manga-card-wrapper">
        {!isLoading && !error && mangaID ? (
          <MangaCards mangas={mangaID} />
        ) : null}
      </div>

      {!isLoading && !error && mangaID ? (
        <button className="load-more" onClick={() => onLoadMore(mangaID.total)}>
          Load more
        </button>
      ) : null}
    </div>
  );
}
