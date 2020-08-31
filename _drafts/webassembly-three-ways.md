---
layout: post
title: "WebAssembly Three Ways"
description: "Go vs Rust vs AssemblyScript"
categories: 
---

[WebAssembly](https://webassembly.org/) is byte code for the web. It is an open standard that has been implemented by all of the major browsers (FireFox, Chrome, Safari, Edge). It has also been implemented as a compilation target for a number of programing languages. Which may have you asking, if I want to build something in WebAssembly what language should I use?

Now if you are starting with an existing project or library, the answer is easy. Just keep going with whatever language it's written in. But if you are starting something new, you have a number of options. Maybe too many options?

I decided to try a few new (to me) programing languages that compile to wasm and see if I can compare them.

## The Test

In order to best compare these different languages with different tooling I decided that they "apples to apples" comparison would be to implement the same program in each language.

The program in this case will be the Fermat Prime Check algorithm. It's something that is not too complex, but is also not trivial. This is something that I should be able to implement mostly the same regardless of language. Any differences in implementation or performance should be specific to the language and/or it's wasm tool chain.

I also want to assess how easy it is to go from "zero to hero" in each language. These languages are going to be new to me. So while there may be some very clever or obscure way of doing things, that may provide incredible performance gains, that wouldn't provide a fair comparison. And someone new to the language would not know these tricks.

## The Contenders

For this I am starting with comparing AssemblyScript, Go, and Rust. 
