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

const render = node => node.appendChild(createElement(view(0)))

const createElement = node => {
  const { type, props, children } = node
  if (typeof node === "string") return document.createTextNode(node)

  const el = document.createElement(type)
  props && setProps(el, props)
  node.children.map(createElement).forEach(el.appendChild.bind(el)) // point free
  return el
}

const setProps = (el, props) => {
  Object.entries(props).forEach(([name, value]) => {
    name = (name === "className" ? "class" : name)
    el.setAttribute(name, value)
  })
}

// const setProp = (el, name, value) => {
// }




const init = (() => {
  const root = document.getElementById("root")
  render(root)
})()
