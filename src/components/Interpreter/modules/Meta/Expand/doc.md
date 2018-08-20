# Expand

Expand the shape of a tensor.

Insert a new axis that will appear at the axis position in the expanded tensor shape.

```L1
::Expand
a: [1 2 3 4]
shape-a: Shape a ; shape-a = [4]

b: a -> Expand 0
shape-b: Shape b ; shape-b = [1 4]

c: a -> Expand 1
shape-c: Shape c ; shape-b = [4 1]


expander-0: Expand 0 
```