---
layout: post
title: "Learning Rust and WebAssembly"
subtitle: "Bigger Than a Breadbox, Smaller Than a House"
description: ""
categories: 
---

__TL;DR;__ You can find the live demo [here](https://www.ianmccall.codes/rust-primecheck/).

------

I have wanted to learn to use WebAssembly for a while now, but I have had some issues with getting started. First, I don't use compiled languages very often. Second, I've found the available tutorials and articles to be lacking in practical details for getting started.

Most of the tutorials and articles about WebAssembly that I've seen follow the same template. 
 1. Present a cool game or desktop application that has been ported to WebAssembly.
 2. Show the same simple "add" function that everybody else does
 3. Done

## The Problem

The problem is that they don't show anything more complex than a trivial adder, and they don't provide any details about how the more complex application was modified and compiled for WebAssembly. The assumption may be that anyone considering WebAssembly is already building compiled desktop applications and should be able to just figure out the toolchain and make any modifications that are necessary. That's fine, but most people that I know that work on desktop applications don't consider web applications to be a possibility, and don't really care about the existence of WebAssembly.

What I want is a WebAssembly example that is not trivial but also not very complex (bigger than a breadbox, smaller than a house). Something that just about anybody with some programing experience should be able to understand. And preferably in a language that is not too hard to pick up and has a solid toolchain for building to WebAssembly. That is how I decided to implement the [Fermat Primeality Test](https://en.wikipedia.org/wiki/Fermat_primality_test) in [Rust](https://www.rust-lang.org/).

## Why Rust?

Let me first explain why I choose Rust. I actually went back and forth between doing this in Rust or [Go](https://golang.org/). They both have good tools for building to WebAssembly, and they both have a syntax that shouldn't be totally alien to anybody that has be coding for a little while. But the support and libraries for WebAssembly seemed to be just a little more complete in Rust. That said, in the future I will probably rewrite this in Go and see which one I like better.

## Why Fermat Prime Test?

The second thing you may be wondering is why a prime checker, and why the Fermat Primeality Test? Well, a half-way decent prime checker is definitely not trivial. Depending on language features an libraries you use you may need to implement additional functions, making the example more complex and closer to what production code may look like. And while there are better and more efficient algorithms (Miller-Rabin or Bailey-PSW) I find the Fermat test is easier to understand and explain.

## Learning Rust

Of course, before I can get started I need to learn at least a little Rust. The syntax is fairly easy to pickup. Declare public functions with `pub fn`, declare variables with `let` and make sure to give them a type. Most of this can be learned from [Rust by Example](https://doc.rust-lang.org/stable/rust-by-example/index.html).

One thing that can be difficult to pick up about Rust is the way it handles variables. Rust is __very__ (very, very) strict about variables. One example of this strictness is that variables are immutable by default. That means that if you declare a variable _x_ (`let x = 5;`), you cannot reassign _x_ latter in your function (`x = 6;`). If you want to do that, you either need to declare it as "mutable" (`let mut x = 5`) or you need to redelare the variable with `let`. [The Rust Book](https://doc.rust-lang.org/book/title-page.html) is a great resource for learn more about the ins and outs of Rust.

After this exercise, I'm still far from an expert on Rust. But I at least feel a little more confident that, if I work on another Rust project, I will be able to figure things out.

## The WebAssembly Side

For compiling to WebAssembly you will need `wasm-pack`, which you can get [here](https://rustwasm.github.io/wasm-pack/),  and the `wasm-bindgen` crate. And you will probably want to check out the [Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/introduction.html) and go through the setup instructions there. I wont go through all of the details here, but the short version is that I put my code in `src/lib.rs` and decorated the functions I wanted to export with `#[wasm_bindgen]`. That way when I compiled my code with `wasm-pack build -t web` the associated JS module would expose the functions I wanted.

When you build using `wasm-pack` your code gets compiled into the folder `./pkg`. You will see several files in there that start with the package name from you `Cargo.toml` file. For me that was "prime_check", so that is what I will use for the rest of this post. There should be a js file, which contains code to load your WebAssembly file and boot strap features it needs. There will probably also be some TypeScript files, in case you are into that sort of thing. And finally there will be your compiled code in a WASM file, `prime_check_bg.wasm` in my case.

One more important thing to point out about WebAssembly in general is that it does not support directly passing anything other than numbers to WebAssembly functions. So passing anything else requires some conversion in JavaScript first. For the most part this will be handled by the boot strapping code generated by `wasm-pack`. But if you are interested in squeezing addition performance out of your WebAssembly implementation, you will want to get familiar with how the boot strapper works.

## Implementation

Finally getting to some real code! For implementing the Fermat Prime Check algorithm I needed three distinct functions. The prime check function its self, plus a function to generate a random number in a range and a function to do modular exponentiation.

Generating a random number between some minimum and maximum values is nothing new to most developers. Many languages include crypto or math packages with functions to do just that. The unique thing about doing this in WebAssembly is that we cannot assume that we can use the built-in packages. Most of these packages depend on operating system level randomness functions, which are not available in the browser. In my case, I used the `web_sys` crate to access `window.crypto` and it's random number generators.

The modulo exponentiation and prime check functions are actually fairly standard implementations. The only thing of note is that I'm using `u64` integers. This of course allows for larger integers than can be achieved with a unsigned 32 bit integer, but it also means that we need to use `BigInt` on the JS side to pass the larger values. Even larger values could be supported in Rust using the `num_bigint` crate, but conversion between Rust and JS would have been more difficult.

### Front-end

On the front-end things are surprisingly simple. My main code is defined as a module with `<script type="module">`. This allows us to import the code from `prime_check.js` with `import * as wasm from "./pkg/prime_check.js"`. Then to load the wasm code we call `await wasm.default()`, and then we can start to use the functions!

## So what's the verdict?

In the end, I think I've built what I wanted. It's a WebAssembly example that most developers should be able to follow and understand. And hopefully it's also more interesting than just adding two numbers together.
