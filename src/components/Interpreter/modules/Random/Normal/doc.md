# RandomNormal

Returns a tensor with values sampled from a normal distribution.

```L1
::RandomNormal
randomScalar: RandomNormal!
randomVector1: RandomNormal [10]
randomVector2: [10] -> RandomNormal
randomMatrix: [10 10] -> RandomNormal

a: RandomNormal {
    shape: [28 28]
}

b: RandomNormal {
    shape: [28 28]
    mean: 0
    stdDev: 1
}
```