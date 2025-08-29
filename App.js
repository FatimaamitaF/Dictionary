const { useState } = React;

function Dictionary() {
  const [keyword, setKeyword] = useState("");
  const [meanings, setMeanings] = useState([]);
  const [synonyms, setSynonyms] = useState([]);
  const [phonetics, setPhonetics] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleSearch() {
    if (!keyword) return;

    setLoading(true);
    setError(null);
    setMeanings([]);
    setSynonyms([]);
    setPhonetics([]);
    setPhotos([]);

    const dictionaryApiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${keyword}`;
    const photoApiUrl = `https://api.shecodes.io/images/v1/search?query=${keyword}&key=5ebcd9630afb5d06416o225d4t3b4a01`;

    
    axios
      .get(dictionaryApiUrl)
      .then((response) => {
        const entry = response.data[0];
        const data = entry.meanings;

        const allowedCategories = ["noun", "verb", "adjective"];
        const collectedSynonyms = new Set();
        const filteredMeanings = [];

        
        allowedCategories.forEach((category) => {
          const meaningsOfCategory = data.filter(
            (m) => m.partOfSpeech === category
          );
          if (meaningsOfCategory.length > 0) {
            const definitions = [];
            meaningsOfCategory.forEach((m) => {
              m.definitions.forEach((def) => {
                definitions.push(def.definition);
                if (def.synonyms) {
                  def.synonyms.forEach((syn) => collectedSynonyms.add(syn));
                }
              });
            });
            filteredMeanings.push({
              partOfSpeech: category,
              definitions: definitions,
            });
          }
        });

        
        setPhonetics(entry.phonetics || []);
        setMeanings(filteredMeanings);
        setSynonyms([...collectedSynonyms]);
      })
      .catch(() => setError("Word not found or API error"))
      .finally(() => setLoading(false));

    
    axios
      .get(photoApiUrl)
      .then((response) => {
        if (response.data.photos) {
          setPhotos(response.data.photos.slice(0, 3)); 
        }
      })
      .catch(() => console.log("No photos found"));
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

  
    phonetics.length > 0 &&
      React.createElement(
        "div",
        { className: "phonetics-block" },
        React.createElement("h3", null, "Phonetics:"),
        ...phonetics.map((p, i) =>
          React.createElement(
            "div",
            { key: i },
            p.text && React.createElement("p", null, p.text),
            p.audio &&
              React.createElement("audio", {
                controls: true,
                src: p.audio,
              })
          )
        )
      ),

    
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
        )
      ),

    
    synonyms.length > 0 &&
      React.createElement(
        "div",
        { className: "synonyms-block" },
        React.createElement("h3", null, "Synonyms:"),
        React.createElement("p", null, synonyms.join(", "))
      ),

    
    photos.length > 0 &&
      React.createElement(
        "div",
        { className: "photo-block" },
        React.createElement("h3", null, "Photos:"),
        ...photos.map((photo, i) =>
          React.createElement("img", {
            key: i,
            src: photo.src.landscape,
            alt: keyword,
          })
        )
      )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(Dictionary));






