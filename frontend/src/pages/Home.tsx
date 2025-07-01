import { useState } from "react";
import { useNavigate } from "react-router-dom";
import trainList from "../data/trainList.json";

export default function Home() {
  const [trainId, setTrainId] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trainId.trim() !== "") {
      navigate(`/track/${trainId.trim()}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setTrainId(input);

    // Filter suggestions
    if (input.length > 0) {
      const filtered = trainList.filter((train) =>
        `${train.name} ${train.id}`.toLowerCase().includes(input.toLowerCase())
      );
      setSuggestions(
        filtered
          .filter((train): train is { id: string; name: string } => typeof train.id === "string" && typeof train.name === "string")
          .slice(0, 5)
      ); // limit results
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (id: string) => {
    setTrainId(id);
    setSuggestions([]);
    navigate(`/track/${id}`);
  };

  return (
    <main className="container">
      <h1 className="title">Train Tracker</h1>

      <form onSubmit={handleSubmit} className="form">
        <div className="input-wrapper">
          <input
            type="text"
            value={trainId}
            onChange={handleChange}
            placeholder="Enter Train Number (e.g. NER 173)"
            className="input"
          />
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((train) => (
                <li
                  key={train.id}
                  className="suggestion"
                  onClick={() => handleSuggestionClick(train.id)}
                >
                  {train.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className="button">
          Track
        </button>
      </form>

    </main>
  );
}
