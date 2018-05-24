# Syntax

## Comments

```L1
; This is a comment
```

0. Everything after a semicolon is a comment.
1. There are only single-line comments.
2. There **won't** be multi-line comments. Sorry.

## Assignment

```L1
a: 0
```

0. Yes, a colon. It's a name–value pair, a prop(erty).
2. Names can be in `camelCase`, `PascalCase`, `python_case`, `kebab-case`, `UPPERCASE`, `lowercase` or `Füčk3d_Úp-_cäšE-ಠ_ಠ`. I don't care.
3. Choosing good names is **your** responsibility.
4. Assigned values cannot be reassigned and they are immutable. Period.
5. Any attempt to reassign will be reported to the authorities. No exceptions.

### Reassignment

```L1
$x: 23
x: 47
```

0. `$` means it is a variable, therefore it can be changed.
1. Please don't misuse them.

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
3. Use underscores for clarity.

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
2. If you want to write 11-dimensional tensor by hand, you have a problem. Please seek help immediately.
3. Of course you can reshape any tensor however you like.

## Operators

```L1
a: 1 + 2               ; 3
b: 2 - 1               ; 1
c: 1 + 2 * 2           ; 1 + 4
d: 2 * 3 / 6           ; 1
e: 3 * 2 ^ 2 + 1       ; 3 * 4 + 1
f: (3 * 2) ^ (2 + 1)   ; 6^3
```

1. Natural order of operations. You know this!
2. Applicable to tensors of all sizes (auto broadcast).
4. There are some fancy operators.

```L1
a: [1 2 3] × 3   ; [1 2 3] * [3 3 3]
b: [3 6 9] ÷ 3   ; [3 6 9] / [3 3 3]
c: [1 2 3] % 2   ; [1 2 3] % [2 2 2]

; matrix multiplication
d: [1 2, 3 4] ⊗ [1 2, 3 4]   ; [1 2, 3 4] @ [1 2, 3 4]
```

## Function Application

```L1
a: Fn 23                    ; Fn(23)
b: Fn2 Fn1 47               ; Fn2(Fn1(47))
c: (higher-order-fn Fn) 47
```

1. There is always only one argument.
2. Argument does not have to be in parenthesis.
3. Use parenthesis to group expressions together.

### Pipeline

```L1
a: 23 -> Fn1 -> Fn2     ; Fn2 Fn 23
b: [1 2, 3 4] -> (Sum { axis: 0 })
c: [1 2, 3 4]
    -> (Product { axis: 1 })
    -> Sum
```

1. Pipeline is function application, but with reverse order.
2. Pipeline can turn nested expression into a linear one.

## Objects

```L1
obj1: {
    a: 1
    b: 2
}
obj2: { a: 1, b: 2}
```

1. Objects hold name–value pairs, prop(ertie)s.
2. Objects are immutable. (Unless `$`.)
3. Child object can refer to parent props directly.
4. Dot `.` operator  works.

```L1
obj: {
    x: 1
    y: {
        a: x + 1
    }
}
a: obj.y.a  ; a: 2
```

```L1
a: {
    x: 2
    value: x * 3
}.value
```

## Functions

```L1
Fn: x => x^2
a: Fn 3
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

; a: {
;     linear: 3
;     quadratic: 9
;     cubic: 27
; }
```

```L1
Fn: x => y => x + y
a: (Fn 2) 3
b: 3 -> (2 -> Fn)
c: 3 -> (Fn 2)
d: (2 -> Fn) 3
```

```L1
Fn: a => {
    z: a.x + a.y
    value: z^2
}.value

a: Fn {
    x: 1
    y: 2
}
```

```L1
Flip: s => {
    h: s.a
    a: s.h
}

mu: { h: 0, a: 1 }
    -> Flip
    -> Flip
    -> Flip
```

# Links
* [Haskell syntax](https://www.haskell.org/onlinereport/exps.html)
* [Iterations in PEG](http://www.dalnefre.com/wp/2011/05/parsing-expression-grammars-part-4/)
* [Continuations by example](http://matt.might.net/articles/programming-with-continuations--exceptions-backtracking-search-threads-generators-coroutines/)
* [CPS in JS by example](http://matt.might.net/articles/by-example-continuation-passing-style/)
* [EinSum](https://rockt.github.io/2018/04/30/einsum#fn.2)
* [Firebase Cloud Fns](https://www.youtube.com/watch?v=prlK_QL_qOA)
* [Something New](https://github.com/d-cook/SomethingNew)