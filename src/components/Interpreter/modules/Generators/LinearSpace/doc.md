# LinearSpace

Returns a vector of length `count` with values from `start` to `stop`.

```L1
::LinearSpace
a: LinearSpace ! ; [0 1]
b: LinearSpace {
    start: 0
    stop:  1
    count: 2
}

shape: Shape b      ; shape = [2] = count
min: Min b          ; min = 0 = start
max: Max b          ; max = 1 = stop

c: LinearSpace {
    count: 100
}
```