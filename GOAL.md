# Goal

> Become the standard tool for prototyping new Machine Learning ideas.

This may sound too ambitious, however it is not. Many people read it as *"become the best Deep Learning framework"* or such. And that would be ambitious, but at the same time it would be vague and non-executable statement.

Another formulation of the mentioned goal would be:

> Become the first choice tool for teaching and learning differentiable linear algebra.

Again, it is not *"the best numeric environment"* – whatever that might mean. Professionals are not the target audience here, but even they can benefit from this tool. The goal is to present set of ideas in a clean form where mind can play.

L1 is not going to be the next TensorFlow, PyTorch, Mathematica, Jupyter Notebook, VS Code, TensorBoard, MATLAB, or anything. The intention is somewhere else.

## Design goals

To express more directly what L1 wants to be, is to present the driving principles behind it. This is not an exhaustive list.

### Minimal

When you are in a flow state, you don't want to think about type declarations, or count opening and closing parentheses, or recasting int16 to float32, or using print statement for every step of your algorithm... These are the non-essential parts of the programming.

L1 is not going to be all-encompassing IDE that covers everything in between data scraping to production deployment. It isn't even about the model creation...

The focus is to lose all non-essential parts of the accidental complexities that accumulated in the history of programming and present what has left in the most simple way possible.

### Unified

Design is an instance of the multi-variate optimization problem. When you push in somewhere, something will pop out at the other side. So far, it seems that optimizing all parameters at the same time has a temporal advantage. In other words, designing an IDE, a language and an API in unison, we can speed up the development of the whole thing.

I have seen this method mainly in the early history of computing, not so much now. For example, at XEROX PARC researchers developed everything  from scratch for the Alto project – hardware, software, operating system, graphics, programming language. And there was no other way.

L1 strives to be the whole experience. It is not an IDE, not a language, not an API. One without the other is nothing.

### Familiar

The large part of learning curve is dictated by the knowledge you already have. We employ transfer-learning across different, and quite often very distant tasks. For example, the Desktop metaphor of the graphical user interfaces exploit our knowledge about the real physical desks and objects on them, to quickly learn how to operate an alien calculator.

The famous programming language by Kenneth Iverson – APL – was anything but familiar. Extremely powerful, but alien. On the other hand, FORTRAN was lesser of the two, but it was familiar to mathematicians, so they could be productive without the steep learning curve.

The L1 language reads like clean JSON with expressions. This combination is extremely simplistic, but still powerful – and above all – very familiar.

### Responsive

Writing a computer code without actually seeing what it does in real-time is a sin. Programming with live feedback keeps the user engaged and not frustrated by waiting for the manual edit-compile-run cycle.

Nobody would ever want to draw with their eyes closed, and only after that look at the drawing. Programming should be like drawing with eyes open.

L1 aspires to be a smooth live programming experience where you actually forget that you are programming. Interactivity matters.