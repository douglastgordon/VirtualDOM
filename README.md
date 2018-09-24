# VirtualDOM

1. Create initial DOM elements by traversing over JSX node recursively
2. Diff new node and old node, comparing each child recursively creating list of patches - a tree of actions that describe changes to be made to old node
3. Traverse over patches recursively, updating elements. Repeat from 2.

## Resources
[Let's Build a Virtual DOM from Scratch](https://www.youtube.com/watch?v=l2Tu0NqH0qU)
