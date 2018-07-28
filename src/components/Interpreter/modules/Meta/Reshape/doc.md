# Reshape

Returns a function that reshapes a tensor to specified shape.

```L1
a: [1 2 3 4]
shape1: Shape a ; shape = [4]
b: a -> Reshape [2 2]
shape2: Shape b ; shape = [2 2]
c: (Reshape [4 1]) a

reshaper: Reshape [10 10]
```