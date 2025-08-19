function App() {
  return React.createElement(
    "div",
    null,
    React.createElement("h1", null, "Hallo, was geht?")
  );
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(React.createElement(App));

