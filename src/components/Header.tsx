import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <h1>
        <Link to={"/"}>
          manga <span className="pink-span">blossom</span>
        </Link>
      </h1>
      <p>powered by - mangadex</p>
    </header>
  );
}
