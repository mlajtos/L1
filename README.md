# Syntax

## Comments

```L1
# This is a comment
```

1. There are only single-line comments.
2. There WON'T be multi-line comments. Sorry.

## Assignment

```L1
a: 0
```

0. Yes, a colon. It's a name-value pair.
1. Names start with a lowercase letter.
2. Compound names can be in ```camelCase```, ```snake_case```, ```kebab-case```, or ```füčk3d_Úp-CäšE```. I don't care.
3. Proper names are YOUR responsibility.
4. Assigned values cannot be reassigned and they are immutable. Period.
5. Any attempt to reassign will be reported to the authorities. No exceptions.

### Reassignment

```L1
x:: 23
x:: 47
```

0. Yes, a double colon.
1. These are variables.
2. Variables are mutable.
3. Please don't misuse them.

## Numbers

```L1
a: 0
b: 1
c: -2
d: -3.14
e: 1_000
```

1. There are no "types". It's just a numeric value.
2. If your numbers are too big or too small (or they aren't numbers at all), it is YOUR problem.

### Tensors

```L1
scalar: 23
vector: [1 2 3]
matrix1: [1 2, 3 4]
matrix2: [
    1 2
    3 4
]
```

1. Only scalars, vectors and matrices.
2. If you want to write 11-dimensional tensor by hand, you have a problem, please seek help.

## Operators

```L1
a: 1 + 2               # 3
b: 2 - 1               # 1
c: 1 + 2 * 2           # 1 + 4
d: 2 * 3 / 6           # 1
e: 3 * 2 ^ 2 + 1       # 3 * 4 + 1
f: (3 * 2) ^ (2 + 1)   # 6^3
```

1. Natural order of operations. You know this!
2. Applicable to tensors of all sizes (auto broadcast).
4. There are some fancy operators.

```L1
a: [1 2 3] × 3   # [1 2 3] * [3 3 3]
b: [3 6 9] ÷ 3   # [3 6 9] / [3 3 3]
c: [1 2 3] % 2   # [1 2 3] % [2 2 2]

# matrix multiplication
d: [1 2, 3 4] @ [1 2, 3 4]   # [7 10, 15 22]
```

## Function Application

```L1
a: Fn 23
```

1. Function name starts with an uppercase letter.
2. There is only one argument to the function.
3. Function that does not take an argument is not a function.

### Pipeline

```L1
a: [1 2 3] -> Sum { tensor: $, axis: 0 }
a: [1 2 3] -> Sum { axis: 0 }
``` 

## Objects

```L1
object: {
    a: 1
    b: 2
}
```

1. Objects hold name-value pairs.
2. Objects are immutable.
3. If you need to mutate an object, create a new one.

```L1
obj1: {
    a: 1
    b: 2
}
obj2: {
    ...obj1   # copy obj1 here
    c: 3      # add new
}
```

```L1
obj1: {
    a: 1
    b: 2
}
obj2: {
    ...obj1   # copy obj1 here
    b:: 23    # overwrite
}
```

```L1
obj1: {
    x: 1
    a: {
        b: x + 1
    }
}
a: obj.a.b

# a: 2
```

```L1
a: {
    x: 1
    value: x * 3
}.value
```

```L1
a: 23
obj: {
    a
    b: 47
}
```

## Functions

```L1
Fn: x => x^2
a: Fn 3

# a: 9
```

1. There is only one argument.
2. Higher-order functions are okay.

```L1
Fn: x => {
    linear: x
    quadratic: x^2
    cubic: x^3
}
a: Fn 3

# a: {
#     linear: 3
#     quadratic: 9
#     cubic: 27
# }
```

```L1
Fn: { x y } => x + y
a: Fn {
    x: 1
    y: 2
}

# a: 3
```

```L1
Fn: { x y } => {
    z: x + y
    value: z^2
}.value

a: Fn {
    x: 1
    y: 2
}

# a: 9
```

# Links
https://stackoverflow.com/a/2384250