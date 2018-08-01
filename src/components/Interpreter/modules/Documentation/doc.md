# Syntax

## Comments

```L1
; This is a comment

; This is a
;   multiline
;       comment
```

1. Everything after a semicolon is a comment.
1. There are only single-line comments.

## Assignment

```L1
a: 0
```

1. Yes, a colon. It's a name–value pair, a prop(erty).
1. Names can be in `camelCase`, `PascalCase`, `python_case`, `kebab-case`, `UPPERCASE`, `lowercase` or `FüčK3d_Úp-_cäšE-ಠ_ಠ`. Nobody cares.
1. Choosing good names is **your** responsibility.

## Numbers

```L1
a: 0
b: 1
c: -2
d: -3.14
e: 1_000
```

1. There are no *types*. It's just a numeric value.
1. *But to be honest – 32-bit float.*
1. If your numbers are too big, too small (or they aren't numbers at all), you gotta pump those rookie numbers up.

### Tensors

```L1
scalar: 23
vector1: [1 2 3]
vector2: [1,2,3]
matrix1: [1 2, 3 4]
matrix2: [
    1 2
    3 4
]
```

1. Only scalars, vectors and matrices.
1. `Reshape` any tensor however you like.

## Operators

```L1
a: 1 + 2               ; 3
b: 2 - 1               ; 1
c: 1 + 2 * 2           ; 1 + 4
d: 2 * 3 / 6           ; 1
e: 3 * 2 ^ 2 + 1       ; 3 * 4 + 1
f: (3 * 2) ^ (2 + 1)   ; 6^3
```

1. Natural order of operations. You got this!
1. Applicable to tensors of all sizes (auto broadcast).
1. There are some fancy operators.

```L1
a: [1 2 3] * 3   ; [1 2 3] × 3
b: [3 6 9] / 3   ; [3 6 9] ÷ 3
c: [1 2 3] % 2

; matrix multiplication
d: [1 2, 3 4] @ [1 2, 3 4]   ; [1 2, 3 4] ⊗ [1 2, 3 4]
```

## Function Application

```L1
a: Square 23              ; Square(23) = 23^2
b: Square [1 2 3]         ; Square([1 2 3]) = [1 4 9]
c: SquareRoot Square 23   ; SquareRoot(Square(23))
d: RandomNormal !         ; RandomNormal()
```

```L1
size1: Size [1 2 3]         ; size1 = 3
size2: Size [1,2,3]         ; size2 = 3
size3: Size [1 2, 3 4]      ; size3 = 4

shape1: Shape [1 2 3]       ; shape1 = [3]
shape2: Shape [1 2, 3 4]    ; shape2 = [2 2]

rank0: Rank 23              ; rank0 = 0
rank1: Rank [1 2 3]         ; rank1 = 1
rank2: Rank [1 2, 3 4]      ; rank2 = 2

min: Min [0 1 2]            ; min = 0
max: Max [0 1 2]            ; max = 2
mean: Mean [0 1 2]          ; mean = 1
```

1. There is always only one argument. One is enough.
1. The argument does not have to be in parenthesis.
1. Use parenthesis if you must.
1. Use `!` to call function without an argument.

### Pipeline

```L1
a: 23 -> Square                ; Square 23
b: 23 -> Square -> SquareRoot  ; SquareRoot Square 23
c: [1 2, 3 4] -> Square
d: [1 2, 3 4]
    -> Square
    -> SquareRoot
```

1. Pipeline is a function application with the reversed order.
1. Pipeline can turn nested expression into a linear one.
1. It can be written as `->`, `//` (Mathematica), `|` (Unix pipe), or `|>` (F# and others).

## Objects

```L1
Obj1: {
    x: 1
    y: 2
}
Obj2: { x: 1, y: 2}
```

1. Objects hold name–value pairs, prop(ertie)s.
1. Child object can refer to parent props directly.
1. Dot `.` operator works.
1. Shorthand notation for `abc: abc` is `::abc`. Also works for paths.

```L1
A: {
    x: 1
    B: {
        y: x + 1
    }
}
z: A.B.y  ; z: 2
```

```L1
y: {
    x: 2
    value: x * 3
}.value
```

```L1
A: {
    i: 23
    B:  {
        j: 47
    }
    C: {
        ::i     ; i: i
        ::B.j   ; j: B.j
    }
}
```

## Functions

```L1
Fn: x => x^2
a: Fn 3
```

1. There is only one argument.
1. Higher-order functions are okay.

```L1
Fn: x => {
    linear: x
    quadratic: x^2
    cubic: x^3
}
A: Fn 3

; A: {
;     linear: 3
;     quadratic: 9
;     cubic: 27
; }
```

```L1
Fn: x => y => x + y     ; higher-order function
a: (Fn 2) 3             ; JS: Fn(2)(3)
b: 3 -> (2 -> Fn)
c: 3 -> (Fn 2)
d: (2 -> Fn) 3
```

```L1
Fn: A => {
    z: A.x + A.y
    value: z^2
}.value

a: Fn {
    x: 1
    y: 2
}
```

```L1
Flip: S => {
    a: S.b
    b: S.a
}

mu: { a: 0, b: 1 }
    -> Flip
    -> Flip
    -> Flip
```

## IIFE

```L1
iife1: 22 -> a => a + 1
iife2: (a => a + 1) 22
```

## Functional Objects

1. Object can be used as a function.
1. Good for many things, mostly encapsulation.
1. Can have documentation attached.

```L1
fn: {
    #call: a => a + 23
    #doc: "Adds 23 and the provided *value*"
}

test: fn 24
```

# Extra info

### Self

Top-level prop `Self` contains everything that is available by default, something like "standard library".

```L1
:: Self
```

### Silent assignment

```L1
_a: 23
_b: 24
c: a + b
```
1. Use underscore `_` in front of an assignment, to silence it.
1. (Therefore, no names with leading `_`, yay!)
1. Values still exist and can be used – they are just not displayed.

### None

Expressions `()` and `!` (and top-level prop `None`) have value that is equivalent of `None` in Python or `undefined` in Javascript. It is useful when calling a function that does not need an argument.

```L1
a: ()
b: !
c: None
```

### Booleans

There are top-level props called `False` and `True`. There is no use for them yet.

### Strings

There is a rudimentary support for strings. However, no concatenation, no interpolation, no manipulation. They are necessary for documentation right now.

### Symbols

Following example shows two assignments. First is a normal prop – string as a key, second is a symbol prop – symbol as a key:
```L1
mu: 2
#mu: 2
```

Symbol props are not displayed (silenced by default), and have a special purpose. For example, `#call` is used when object is used as a function in function application. `#doc` holds a Markdown documentation for the object.

There is also a `#meta` prop, that is used internally to do various stuff:

```L1
mu: {
    a: 23
    _b: 47
}

meta: mu.#meta
```

Symbol props can store any values and can be accessed in the same way as a normal props.

### Force evaluate
By default, every input triggers evaluation of the code, to force-evaluate use `Ctrl+Enter` or `Cmd-Return`.