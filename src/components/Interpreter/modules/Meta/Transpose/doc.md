# Transpose

Transposes the tensor.

```L1
::Transpose

_test: x => {
    original: x
    transposed: Transpose x
}

a: test [1,2,3]
b: test [
    1 2 3
    4 5 6
    7 8 9
]
c: test [1 2 3, 4 5 6]
```