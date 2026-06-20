import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";

import Home from "./pages/Home";
import Details from "./pages/Details";

function DetailsWrapper() {
  const { id } = useParams();
  return <Details key={id} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/manga/:id" element={<DetailsWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}
