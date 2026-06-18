interface PageSwitcherProps {
  totalContent: number;
  contentTarget: number;
  current: number;
  onSetPage: (current: number, total: number) => void;
}

export default function PageSwitcher({
  totalContent,
  contentTarget,
  current,
  onSetPage,
}: PageSwitcherProps) {
  // contentTarget, meaing how many content(manga/chapters) should be in a page, this is importent so we know how many pages we need to create
  // so if we have a content target = 10 and have total manga/chapters of 43 it will create a total of 5 pages
  const total = Math.ceil(totalContent / contentTarget);

  return (
    <div className="page-switcher">
      <button className="hardPrevious" onClick={() => onSetPage(0, total)}>
        {"<<"}
      </button>
      <button
        className="previous"
        onClick={() => onSetPage(current - 1, total)}
      >
        {"<"}
      </button>
      <p>
        page <span>{current + 1}</span> of {total}
      </p>
      <button className="next" onClick={() => onSetPage(current + 1, total)}>
        {">"}
      </button>
      <button className="hardNext" onClick={() => onSetPage(total - 1, total)}>
        {">>"}
      </button>
    </div>
  );
}
