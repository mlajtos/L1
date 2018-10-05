# Goal

> **Become the standard tool for prototyping new Machine Learning ideas.**

A bold goal, I know. But it means something different than what you might think. Many people interpret it as *"become the best Deep Learning framework"* or *"if PyTorch and TensorFlow had a baby"*. These statements would excite many professionals, but it would create only hype – vague and non-executable statement.

Another formulation of the mentioned goal would be:

> *Become the first choice tool for teaching and learning differentiable linear algebra.*

This *italic* goal is borderline boring. But again, it is not meant as *"become the best numeric environment"* – whatever that might mean. Professionals are not the target audience here, but even they can benefit from this tool. However, L1 is not going to be the next TensorFlow, PyTorch, Mathematica, Jupyter Notebook, VS Code, TensorBoard, MATLAB, or anything. The intention is somewhere else.

The ultimate goal of L1 is to be the medium for creative thought about specific subset of Machine Learning.

## Design goals

To express more directly what L1 wants to be, is to present the driving principles behind it and how they are manifested in the implementation. *(This is not an exhaustive list.)*

### Minimal

When yor mind is in the [Flow state](https://en.wikipedia.org/wiki/Flow_(psychology)) during programming, usually you don't want to think about type declarations, or match opening and closing parentheses that are deeply nested, or recasting int16 to float32, or using print statement for every step of your algorithm... These are the non-essential (boring) parts of the programming.

L1 is not going to be all-encompassing IDE that covers everything in between data scraping to production deployment. It isn't even about the model creation...

The focus is to lose all non-essential parts of the accidental complexities that accumulated in the history of programming, and present what's left in the purest form possible.

### Unified

Design is an instance of the multi-variate optimization process. When you push in somewhere, something will pop out at the other side. By optimizing all the parameters at the same time, there is a temporal advantage. In other words, designing an IDE, a language and an API in unison, we can speed up the development of the whole thing.

This method was principal in the early history of computing. For example, research that led to [Xerox Alto](http://worrydream.com/EarlyHistoryOfSmalltalk/) has been done all from scratch and in parallel – hardware, software, operating system, networking, graphics, programming language. There was no other way to it.

L1 draws on this principle and strives to be *the whole experience*. It is not an IDE, not a language, not an API. One without the other is nothing.

### Familiar

The large part of learning curve is dictated by the knowledge you already have. Humans employ transfer-learning across different, and quite often very distant tasks. For example, the Desktop metaphor of the graphical user interface, exploit our knowledge about the real (physical) desks and objects on them, to quickly learn how to operate an alien calculator.

The famous programming language by Kenneth Iverson – APL – was anything but familiar. Extremely powerful, but alien. On the other hand, FORTRAN was lesser of the two, but it was familiar to mathematicians, so they could be productive without the steep learning curve.

The L1 language reads like clean JSON with expressions. This combination is extremely simplistic, but still powerful – and above all – very familiar. More about that in part [Better JavaScript](#better-javascript)

### Interactive

Writing a computer code without actually seeing what it does in real-time is a sin. Programming with live feedback keeps the user engaged and not frustrated by waiting for the manual edit-compile-run cycle.

Nobody would ever want to draw with a pencil on a paper with their eyes closed, and only after that look at the drawing. Programming should be like drawing with your eyes open.

L1 aspires to be a smooth live programming experience where you actually forget that you are programming. Immediate feedback matters.

## Better JavaScript

Syntax and semantics of L1 language is heavily inspired by its host language – JavaScript. The main designing force is to simplify JS to the extreme – throw out everything that is non-essential. JavaScript is frozen to be backward compatible, so it will only grow in size, so adding new stuff in a proper way is hard or impossible. L1 is the opposite.

### Const by default

Assignment is done by colon, because you are really creating an object with named properties. As in Python.

```js
// JS
const a = 23
```

```L1
; L1
a: 23
```

### References

Following example just adds one number to the other using a reference:

```js
const a = 23
const b = a + 24
```

```L1
a: 23
b: a + 24
```

However, if you want to do it in the object, you are out of luck:

```js
const obj = {
    a: 23,
    b: this.a + 24 // obj.b is NaN, no Error!
}
```

But this is totally normal thing in L1:

```L1
obj: {
    a: 23
    b: a + 24  ; obj.b is 47
}
```

### Referential transparency

Take this example:

```js
const obj = { a: 23 }
const b = obj.a // b is 23, nice
```

Substituting `obj` for its value should still work:

```js
const b = { a: 23 }.a // Oops, SyntaxError: Unexpected token .
```

You have to enclose it in parens:

```js
const b = ({ a: 23 }).a
```

In L1 this works:

```L1
b: {
    a: 23
}.a
```

### Function duality

ES6 arrow functions (lambdas) are the most usefull thing added to JS:

```js
const fn = a => a + 1  // function definition
const x = fn(22)       // function application
```

There is really no striking difference to L1:

```L1
fn: a => a + 1         ; function definition
x: fn(22)              ; function application
```

However the second best thing that would be added to JS is pipeline operator:

```js
const x = 22 |> fn
```

In L1, pipeline operator makes a bit more sense:

```L1
x: 22 -> fn
```

### Parens again

Lets use arrow function to return an object:

```js
const fn = a => { mu: 23 + a }
const obj = fn(24)                  // undefined
```

`obj` is `undefined`. WAT?! You created a function body with a label instead of a object literal. Just use parens:

```js
const fn = a => ({ mu: 23 + a })
const obj = fn(24)
```

No such surprise in L1:

```L1
fn: a => {
    mu: 23 + a
}
obj: fn(24)
```

Actually in L1 you can drop parens even from the function application:

```L1
obj: fn 24
```

In L1 parens are only grouping things together – no other hidden meaning.

### Synergies

When you combine these techniques together, you can do something silly as this:

```js
const fn = a => {
    const b = a + 12
    const c = b * 2
    return { a, b, c }
}
const mu = fn(23)
```

In L1 this is a bit more straightforward:

```L1
fn: a => {
    a: a
    b: a + 12
    c: b * 2
}
mu: fn 23
```

Even on the silly example, there is a modest gain in readability:
* **JS:** 87 characters
    * including 23 white space characters
* **L1:** 44 characters
    * including 15 white space characters

### Object as a function

JS proxies are going to let you do magical (read: meta) things with objects. However, you will never be able to do this beautiful thing from Python:

```python
class ObjClass(object):
    a = 23
    def __call__(self, b):
        return self.a + b

obj = ObjClass()
mu = obj(24)
```

JS:
```js
// don't even try
```

In L1 this is embarrassingly trivial:

```L1
obj: {
    a: 23
    #call: b => a + b
}
mu: obj 24
```

### Documentation

Have you ever seen documentation in JS? Not on a web, but in JS. You know, as in Python's `help()`. Documentation should be as close to code as possible. Example from Python:

```python
def fn(a):
    """increments a provided number"""
    return a + 1

help(fn)  # print(fn.__doc__)
```

Add some Markdown and you have something good:

```L1
fn: {
    #doc: "
        # Incrementer
        
        *Increments* a provided number by 1. Example:

            mu: fn 22
    "
    #call: a => a + 1
}
```

### Observables

`Promise` is a future value that resolves or fails. `Observable` is a Promise that can resolve multiple times, so an asynchronous data stream. Observables will probably end up in JS and will superseed Promises as a standard way for dealing with asynchronous programming. Incorporating Observables into a language is therefore a must to have feature.

In vanilla JS, when you want to track `x`-coordinate of a mouse and do something with that value you would go something like this:

```js
var mu = 0
const onMouseXChanged = (value) => { mu = value * 10 }
document.addEventListener("mousemove", (e) => onMouseXChanged(e.screenX))
```

This is a classic Observer pattern and it is a really useful in real world applications. However it is cumbersome and does not scale really well. People created libraries like [RxJS](https://rxjs-dev.firebaseapp.com/) to deal with Observers and Observables in a better way. But this useful patern should be used on a language level, not as a library. Instead, one should be able to write following one-liner:

```L1
mu: Mouse.x * 10
```

This way, `mu` will always be synchronized to the `x`-coordinate of the mouse. And of course subsequent computations dependent on `mu` will also be recalculated whenever is needed.
