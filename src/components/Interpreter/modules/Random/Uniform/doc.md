# RandomUniform

Returns a tensor with values sampled from a uniform distribution.

```L1
randomScalar: RandomUniform!
```

```L1
randomVector1: RandomUniform [10]
randomVector2: [10] -> RandomUniform
randomMatrix: [10 10] -> RandomUniform
```

```L1
a: RandomUniform {
    shape: [28 28]
}

a: RandomUniform {
    shape: [28 28]
    min: 0
    max: 1
}
```