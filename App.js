const { useState } = React;

function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [definition, setDefinition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSearch() {
    if (!keyword) return;

    setLoading(true);
    setError(null);
    setDefinition(null);

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const def = response.data[0].meanings[0].definitions[0].definition;
        setDefinition(def);
        setLoading(false);
      })
      .catch(() => {
        setError("Word not found or API error");
        setLoading(false);
      });
  }

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Dictionary 📖"),
    React.createElement("input", {
      type: "text",
      placeholder: "Enter a word",
      value: keyword,
      onChange: (e) => setKeyword(e.target.value),
    }),
    React.createElement(
      "button",
      { onClick: handleSearch },
      "Search"
    ),
    loading && React.createElement("p", null, "Loading..."),
    error && React.createElement("p", { style: { color: "red" } }, error),
    definition &&
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Definition:"),
        React.createElement("p", null, definition)
      )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Dictionary));



