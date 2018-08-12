# Clip

Clips values of the tensor to the provided minimum and/or maximum.

```L1
::Clip

clip-1: Clip ! ; 0-1
clip-2: Clip {
    min: 0
    max: 1
}

ReLU: Clip { min: 0 }
test: RandomNormal [28 28] -> ReLU
```