---
layout: post
title: "Learning Rust and WebAssembly"
subtitle: "Bigger Than a Breadbox, Smaller Than a House"
description: ""
categories: 
---

I have wanted to learn to use WebAssembly for a while now, but I have had some issues with getting started. First, I don't use compiled languages very often. Second, I've found the available tutorials and articles to be lacking in practical details for getting started.

Most of the tutorials and articles about WebAssembly that I've seen follow the same template. 
 1. Present a cool game or desktop application that has been ported to WebAssembly.
 2. Show the same simple "add" function that everybody else does
 3. Done

The problem is that they don't show anything more complex than a trivial adder, and they don't provide any details about how the more complex application was modified and compiled for WebAssembly. The assumption may be that anyone considering WebAssembly is already building compiled desktop applications and should be able to just figure out the toolchain and make any modifications that are necessary. That's fine, but most people that I know that work on desktop applications don't consider web applications to be a possibility, and don't really care about the existence of WebAssembly.

What I want is a WebAssembly example that is not trivial but also not very complex (bigger than a breadbox, smaller than a house). Something that just about anybody with some programing experience should be able to understand. And preferably in a language that is not too hard to pick up and has a solid toolchain for building to WebAssembly. That is how I decided to implement the [Fermat Primeality Test](https://en.wikipedia.org/wiki/Fermat_primality_test) in [Rust](https://www.rust-lang.org/).

Let me first explain why I choose Rust. I actually went back and forth between doing this in Rust or [Go](https://golang.org/). They both have good tools for building to WebAssembly, and they both have a syntax that shouldn't be totally alien to anybody that has be coding for a little while. But the support and libraries for WebAssembly seemed to be just a little more complete in Rust. That said, in the future I may rewrite this in Go and see which one I like better.

The second thing you may be wondering is why a prime checker, and why the Fermat Primeality Test? Well, a half-way decent prime checker is definitely not trivial. Depending on language features an libraries you use you may need to implement helper functions, making the example more complex and closer to what production code may look like. And while there are better and more efficient algorithms (Miller-Rabin or Bailey-PSW) I find the Fermat test is easier to understand and explain.

_things I leaned plus issues (walk through of code?)_