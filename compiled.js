const view = count => h(
  "ul",
  { className: "sample-list" },
  h(
    "li",
    null,
    "Potatoes"
  ),
  h(
    "li",
    null,
    "Carrots"
  ),
  h(
    "li",
    null,
    "Oranges"
  ),
  h(
    "li",
    null,
    "Lemons"
  )
);

const h = (type, props = {}, ...children) => ({
  type,
  props,
  children: children.flat(1)
});
