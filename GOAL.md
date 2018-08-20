# Goal

> **Become the standard tool for prototyping new Machine Learning ideas.**

A bold goal, I know. But it means something different than what you might think. Many people interpret it as *"become the best Deep Learning framework"* or *"if PyTorch and TensorFlow had a baby"*. These statements would excite many professionals, but it would create only hype – vague and non-executable statement.

Another formulation of the mentioned goal would be:

> *Become the first choice tool for teaching and learning differentiable linear algebra.*

This *italic* goal is borderline boring. But again, it is not meant as *"become the best numeric environment"* – whatever that might mean. Professionals are not the target audience here, but even they can benefit from this tool. However, L1 is not going to be the next TensorFlow, PyTorch, Mathematica, Jupyter Notebook, VS Code, TensorBoard, MATLAB, or anything. The intention is somewhere else.

The ultimate goal of L1 is to be the medium for creative thoughts about specific subset of Machine Learning.

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

The L1 language reads like clean JSON with expressions. This combination is extremely simplistic, but still powerful – and above all – very familiar.

### Interactive

Writing a computer code without actually seeing what it does in real-time is a sin. Programming with live feedback keeps the user engaged and not frustrated by waiting for the manual edit-compile-run cycle.

Nobody would ever want to draw with a pencil on a paper with their eyes closed, and only after that look at the drawing. Programming should be like drawing with your eyes open.

L1 aspires to be a smooth live programming experience where you actually forget that you are programming. Immediate feedback matters.