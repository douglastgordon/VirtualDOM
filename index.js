const view = count => (
  <ul className="sample-list">
    <li>Potatoes</li>
    <li>Carrots</li>
    <li>Oranges</li>
    <li>Lemons</li>
  </ul>
)

const h = (type, props={}, ...children) => ({
  type,
  props,
  children: children.flat(1),
})
