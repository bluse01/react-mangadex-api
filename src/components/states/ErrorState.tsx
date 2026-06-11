interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="error">
      <i className="fa-solid fa-circle-exclamation"></i>
      <p>{error}</p>
    </div>
  );
}
