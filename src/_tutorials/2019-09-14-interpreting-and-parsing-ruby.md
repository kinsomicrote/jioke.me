---
title: Ruby Behind the Scene - Interpreting and Parsing Ruby
date: 2019-10-14
---

> **P. S: This will not be a deep dive of how to understand interpretation and parsing in Ruby.**

While going through the assignment guide of Ruby, I came across this line that jumped at me.

> ***The local variable is created when the parser encounters the assignment, not when the assignment occurs:***

Underneath it is an example that's supposed to illustrate what that means.

```
a = 0 if false # does not assign to a

p local_variables # prints [:a]

p a # prints nil
```

According to the first line, the variable `a` should not be assigned the value `0` because of the condition. One would expect that trying to print `a` will return an error that says

```
undefined local variable or method `a'
```

But we get `nil`.

Going back to the quote we have above, we can see that two things possibly happen.

1. There is the case where parser creates the local variable when it encounters the assignment.
2. There is another case where the assignment occurs.

I did a Google search using the above quote as my search query and I came across this blog post that talks about variable hoisting in Ruby. You can go ahead to check it out, but in a scenario like this.

```
if false
  x = 1
end
puts x
```

`x` returns `nil`, instead of a `NameError`. This is strange because we'll expect that the `if` block won't run. Basically, the parser runs through the code and allocates "space" for these variables.

Going back to our code, in the first scenario (which I mentioned above), the parser comes across the variable and assignment, then it goes ahead to allocate a space for the variable. By allocating a space, it sets the value of the variable to `nil`.
See a sample [here](https://repl.it/@kinsomicrote/assignmentstudyrb).


If we print out the class of the variable `a`, we'll get `NilClass`. Sincerely, this is the first time I am seeing such - I had no idea such class existed.

## Parser

Ruby goes through some steps to run your code.

We can make use of use of [Ripper](https://ruby-doc.org/stdlib-2.5.1/libdoc/ripper/rdoc/Ripper.html), which is a Ruby script parser to understand what's happening.
See a sample [here](https://repl.it/@kinsomicrote/parsingassignmentstudy).


Running that returns this.

```
[:program,
 [[:if_mod,
   [:var_ref, [:@kw, "false", [1, 9]]],
   [:assign, [:var_field, [:@ident, "a", [1, 0]]], [:@int, "0", [1, 4]]]]]]
```

I'm not entirely sure what this completely means, but here's my best guess (I'll update the post when I understand it better).

The expression begins with `:program`. Next, we have our condition at `:if_mod`. The third line seems to be the condition that determines if the variable reference should happen or not. In the fourth line, the parsing of the assignment happens. The left-hand side of the assignment is depicted with `:var_field`, you can see the variable is identified as `a`. And this is the right-hand side of the assignment `[:@int, "0", [1, 4]]`.

At this point, the code is being parsed, no assignment has happened yet. But the space has been created for the variable.

## Interpreting

To interpret the code, we'll make use of [RubyVM::InstructionSequence](https://ruby-doc.org/core-2.4.1/RubyVM/InstructionSequence.html) to understand how the code will be interpreted.
See a sample [here](https://repl.it/@kinsomicrote/interpretingassignmentstudy).


And we get this

```
== disasm: #<ISeq:<compiled>@<compiled>:1 (1,0)-(1,14)>=================
local table (size: 1, argc: 0 [opts: 0, rest: -1, post: 0, block: -1, kw: -1@-1, kwrest: -1])
[ 1] a          
0000 putnil                         (   1)[Li]
0001 leave            
=> nil
```

The interpreter doesn't do the assignment. It pushes `nil` on the stack and leaves the current code context.

This is entirely from what we'll get if we don't have the condition.

```
== disasm: #<ISeq:<compiled>@<compiled>:1 (1,0)-(1,5)>==================
local table (size: 1, argc: 0 [opts: 0, rest: -1, post: 0, block: -1, kw: -1@-1, kwrest: -1])
[ 1] a          
0000 putobject_OP_INT2FIX_O_0_C_                                      (   1)[Li]
0001 dup              
0002 setlocal_OP__WC__0 a
0004 leave            
=> nil
```

In this case;

`putobject_OP_INT2FIX_O_0_C_`: Pushes the value `0`to the top of the stack.

`dup`: Duplicates the top of the stack

`setlocal_OP__WC__0 a`: Sets this as the variable `a`in the local table

`leave`: Leave the current code context.

## Conclusion

It's possible to mistake parsing with interpreting. Understanding the difference will shed more light in knowing how Ruby runs your code. You might not need to dig bring up Ripper and the RubyVM::InstructionSequence class each time you're coding. However, knowing a little about them can help in figuring out why your code isn't working as expected.

Here are some extra links I stumbled upon

- [Ripper Events](https://rmosolgo.github.io/ripper_events/).
- [Behind the Scenes](https://medium.com/@cashd/behind-the-scenes-ruby-7693ad3e68ba)

If you have any knowledge before to this post, or you have some questions, I've love to hear about them. You can reach out to me on [Twitter](https://twitter.com/kinsomicrote).