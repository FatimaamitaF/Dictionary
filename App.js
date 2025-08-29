const { useState } = React;

function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSearch() {
    if (!keyword) return;

    setLoading(true);
    setError(null);
    setDefinitions([]);

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const meanings = response.data[0].meanings;

        const allDefinitions = meanings.map((meaning) => {
          return {
            partOfSpeech: meaning.partOfSpeech,
            definition: meaning.definitions[0].definition
          };
        });

        setDefinitions(allDefinitions);
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
    React.createElement("button", { onClick: handleSearch }, "Search"),
    loading && React.createElement("p", null, "Loading..."),
    error && React.createElement("p", { style: { color: "red" } }, error),
    definitions.length > 0 &&
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Definitions:"),
        ...definitions.map((item, index) =>
          React.createElement(
            "div",
            { key: index, className: "definition-block" },
            React.createElement("strong", null, item.partOfSpeech + ": "),
            React.createElement("span", null, item.definition)
          )
        )
      )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Dictionary));





