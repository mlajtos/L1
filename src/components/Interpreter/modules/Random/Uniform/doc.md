# RandomUniform

Returns a tensor with values sampled from a uniform distribution.

```L1
::RandomUniform
randomScalar: RandomUniform!
randomVector1: RandomUniform [10]
randomVector2: [10] -> RandomUniform
randomMatrix: [10 10] -> RandomUniform

a: RandomUniform {
    shape: [28 28]
}

b: RandomUniform {
    shape: [28 28]
    min: 0
    max: 1
}
```