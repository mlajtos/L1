# RandomNormal

Returns a tensor with values sampled from a normal distribution.

```L1
randomScalar: RandomNormal!
```

```L1
randomVector1: RandomNormal [10]
randomVector2: [10] -> RandomNormal
randomMatrix: [10 10] -> RandomNormal
```

```L1
a: RandomNormal {
    shape: [28 28]
}

a: RandomNormal {
    shape: [28 28]
    mean: 0
    stdDev: 1
}
```