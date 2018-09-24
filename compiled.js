const view = count => h(
  "ul",
  { className: `sample-list list-${count % 3}` },
  [...Array(count).keys()].map(num => {
    return h(
      "li",
      null,
      "item ",
      num.toString()
    );
  })
);

const h = (type, props = {}, ...children) => ({
  type,
  props,
  children: children.flat(1)
});

const createElement = node => {
  const { type, props, children } = node;
  if (typeof node === "string") return document.createTextNode(node);

  const el = document.createElement(type);
  props && setProps(el, props);
  node.children.map(createElement).forEach(el.appendChild.bind(el)); // point free
  return el;
};

const setProps = (el, props) => {
  Object.entries(props).forEach(([name, value]) => {
    setProp(el, name, value);
  });
};

const setProp = (el, name, value) => {
  name = name === "className" ? "class" : name;
  el.setAttribute(name, value);
};

const removeProp = (el, name) => {
  el.removeAttrbiute(name);
};

const CREATE = "CREATE";
const REMOVE = "REMOVE";
const REPLACE = "REPLACE";
const UPDATE = "UPDATE";

const changed = (node1, node2) => {
  return typeof node !== typeof node || typeof node1 === "string" && node1 !== node2 || node1.type !== node2.type;
};

const diffChildren = (newNode, oldNode) => {
  const patches = [];
  const patchesLength = Math.max(newNode.children.length, oldNode.children.length);
  for (let i = 0; i < patchesLength; i += 1) {
    patches[i] = diff(newNode.children[i], oldNode.children[i]);
  }
  return patches;
};

const REMOVE_PROP = "REMOVE_PROP";
const SET_PROP = "SET_PROP";
const diffProps = (newProps, oldProps) => {
  const props = Object.assign({}, newProps, oldProps);
  return Object.keys(props).reduce((acc, name) => {
    const newValue = newProps[name];
    const oldValue = oldProps[name];
    if (!newValue) {
      return [...acc, { type: REMOVE_PROP, name, value: oldValue }];
    } else if (!oldValue || newValue !== oldValue) {
      return [...acc, { type: SET_PROP, name, value: newValue }];
    }
  }, []);

  const patchesLength = Math.max(newNode.props.length, oldNode.props.length);
  for (let i = 0; i < patchesLength; i += 1) {
    patches[i] = diff(newNode);
  }
  return patches;
};

const diff = (newNode, oldNode) => {
  if (!oldNode) {
    return { type: CREATE, newNode };
  }
  if (!newNode) {
    return { type: REMOVE };
  }
  if (changed(newNode, oldNode)) {
    return { type: REPLACE, newNode };
  }
  if (newNode.type) {
    return {
      type: UPDATE,
      children: diffChildren(newNode, oldNode),
      props: diffProps(newNode.props, oldNode.props)
    };
  }
};

const patchProps = (parent, patches) => {
  for (let i = 0; i < patches.length; i += 1) {
    const propPatch = patches[i];
    const { type, name, value } = propPatch;
    if (type === SET_PROP) {
      setProp(parent, name, value);
    }
    if (type === REMOVE_PROP) {
      removeProp(parent, name);
    }
  }
};

const patch = (parent, patches, index = 0) => {
  if (!patches) return;
  const el = parent.childNodes[index];
  switch (patches.type) {
    case CREATE:
      {
        const { newNode } = patches;
        const newEl = createElement(newNode);
        return parent.appendChild(newEl);
      }
    case REMOVE:
      {
        return parent.removeChild(el);
      }
    case REPLACE:
      {
        const { newNode } = patches;
        const newEl = createElement(newNode);
        return parent.replaceChild(newEl, el);
      }
    case UPDATE:
      {
        const { children, props } = patches;
        patchProps(el, props);
        for (let i = 0; i < children.length; i += 1) {
          patch(el, children[i], i);
        }
      }
  }
};

const tick = (el, count = 0) => {
  const patches = diff(view(count + 1), view(count));
  patch(el, patches);
  console.log(count, patches);
  if (count > 20) return; // quick after 10s
  setTimeout(() => tick(el, count + 1), 500);
};

const render = node => {
  node.appendChild(createElement(view(0)));
  tick(node);
};

const init = (() => {
  const root = document.getElementById("root");
  render(root);
})();
