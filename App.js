const { useState } = React;

function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSearch() {
    if (!keyword) return;

    setLoading(true);
    setError(null);
    setMeanings([]);
    setSynonyms([]);

    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;

    axios
      .get(apiUrl)
      .then((response) => {
        const data = response.data[0].meanings;

        const allowedCategories = ["noun", "verb", "adjective"];
        const collectedSynonyms = new Set();
        const filteredMeanings = [];

        // Für jede erlaubte Kategorie: Definitionen + Synonyme sammeln
        allowedCategories.forEach((category) => {
          const meaningsOfCategory = data.filter(m => m.partOfSpeech === category);
          if (meaningsOfCategory.length > 0) {
            const definitions = [];
            meaningsOfCategory.forEach(m => {
              // Synonyme direkt auf Ebene "meaning"
              if (m.synonyms) {
                m.synonyms.forEach(syn => collectedSynonyms.add(syn));
              }

              // Definitionen & deren Synonyme
              m.definitions.forEach(def => {
                definitions.push(def.definition);
                if (def.synonyms) {
                  def.synonyms.forEach(syn => collectedSynonyms.add(syn));
                }
              });
            });
            filteredMeanings.push({
              partOfSpeech: category,
              definitions: definitions
            });
          }
        });

        setMeanings(filteredMeanings);
        setSynonyms([...collectedSynonyms]);
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
    meanings.length > 0 &&
      React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Definitions:"),
        ...meanings.map((m, index) =>
          React.createElement(
            "div",
            { key: index, className: "definition-block" },
            React.createElement("strong", null, m.partOfSpeech),
            React.createElement(
              "ul",
              null,
              ...m.definitions.map((def, i) =>
                React.createElement("li", { key: i }, def)
              )
            )
          )
        ),
        synonyms.length > 0 &&
          React.createElement(
            "div",
            { className: "synonyms-block" },
            React.createElement("h3", null, "Synonyms:"),
            React.createElement("p", null, synonyms.join(", "))
          )
      )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Dictionary));





