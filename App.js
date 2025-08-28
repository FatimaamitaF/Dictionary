function App() {
  const dictionary = {
    house: "A building where people live.",
    tree: "A tall plant with a trunk and branches.",
    cat: "A small, furry pet.",
    dog: "A loyal companion to humans."
  };

  function handleSearch() {
    const input = document.getElementById("search-input");
    const word = input.value.trim().toLowerCase();
    const result = dictionary[word] || "Word not found.";

    const output = document.getElementById("definition-output");
    output.textContent = result;
  }

  const input = React.createElement("input", {
    type: "text",
    id: "search-input",
    placeholder: "Enter a word"
  });

  const button = React.createElement("button", {
    onClick: handleSearch
  }, "Search");

  const definitionOutput = React.createElement("p", {
    id: "definition-output"
  }, "");

  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Dictionary Search"),
    input,
    button,
    definitionOutput
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));



