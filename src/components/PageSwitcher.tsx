interface PageSwitcherProps {
  total: number;
  current: number;
  onSetPage: (current: number, total: number) => void;
}

export default function PageSwitcher({
  total,
  current,
  onSetPage,
}: PageSwitcherProps) {
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
