import { useState } from "react";
import { searchProjects } from "../api/search.api";

export default function Search() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const result = await searchProjects(search);

      console.log(result);

      setResults(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search Page</h1>

      <input
        type="text"
        placeholder="Search projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      <div>
        <h2>Search Results</h2>

        <p>Results length: {results.length}</p>

        <pre>{JSON.stringify(results, null, 2)}</pre>

        {Array.isArray(results) && (
          <ul>
            {results.map((project) => (
              <li key={project._id}>{project.data.title}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
