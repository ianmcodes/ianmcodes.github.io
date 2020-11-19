---
layout: post
title: "4.2 Stars with CSS and SVG"
description: ""
categories: post
tags: css svg ratings
---

For a personal project, I needed a way to display an average star rating. There are a lot of ways to do this, but I thought this was a clever way to achive the look I wanted. I'm not sure if anyone else has done it this way. If someone has, I haven't seen an example of it before.

**TL;DR;** I'm using a CSS "progress bar" with an SVG on top as a mask. Example code [here](https://jsbin.com/vunoris/4/edit?html,css,output)

The Problem
===========

From an API I am getting the average rating of a business out of 5 stars. So I could get values in a range from 1 to 5 stars in 0.1 star increments (e.x. 4.2 or 2.8). I want to display the value with colored stars, similar to how you would see on most review sites. There are a lot of ways I could do this. 

I could generate images for each possible star rating. That would be 40 images, and if you were good with Photoshop (or some other image program) you could probably create that many in minutes. But I'm not good at that, and making that many images sounds like a lot of work. Alternatively I could create images for each full and half star rating. That would only be 9 images, a much more manageable number. But then I would have to take the rating and find the closest approximation for which I have an image. Some of the precision is lost. A rating of 4.3 is not the same as 4.6, but they would be represented with the same image (4.5 stars). I felt I could do better.

Solution
========

The idea I came up with was to create one image of 5 stars, but where the inside of the stars are transparent and the outside is a solid color. Then I position that image over a `div` with a background color. This way the image acts as a mask, only showing the background where the stars are, and the width of the `div` is a percentage representing the star rating out of 5. You can see an example of this in the embedded codepen.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="ianmcodes" data-slug-hash="oNjqgym" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Star rating with SVG and CSS">
  <span>See the Pen <a href="https://codepen.io/ianmcodes/pen/oNjqgym">
  Star rating with SVG and CSS</a> by Ian McCall (<a href="https://codepen.io/ianmcodes">@ianmcodes</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

For the image, I went with creating an svg for 2 reasons. One, I wanted something I could easily embed and scale as large as I need. Two, I can edit code much better than images. There are a couple things to note about how the svg works. First is that each star path actually has two paths, one that describes the star and another that describes a square around the star. The second is that each star is using the `evenodd` fill rule. These two things are important because they work together to create the effect of a transparent star. The `evenodd` fill rule tries to determine whether or not a pixel is "inside" by drawing a ray from that point to infinity and counting the number of lines it crosses. If it crosses an odd number of lines, the pixel is "inside" and filled in, otherwise it's "outside". Drawing the square around the star means that pixels inside the star are left empty, and pixels outside the star are right filled.

A Note About the `<progress>` Tag
=================================

If you are familiar with the `<progress>` tag, you may think that using it instead of a `div` would be even easier. Instead of calculating the percentage and setting the width of a `div`, set the max to 5 and set the value directly. In some ways this is easier, since you don't need to do any calculations you can just take the value directly from the API and plug it into the template. However, there is one potentially big drawback to using the `<progress>` tag, and that's styling. By default the `<progress>` tag will be styled to match the user's OS and browser. We can style the element to some extent, and even get the same result as shown above. But it requires using many browser specific psudo selectors and attributes. It can be difficult to get consistent results across browsers, and not all browsers even support the element.

Below is an example using the `<progress>` tag. For me, it looks fine in Chrome. I may even go with this implementation for my personal project (browser support isn't an issue). As always, YMMV.

<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="ianmcodes" data-slug-hash="VwvXYYG" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Star rating with SVG and CSS Progress bar">
  <span>See the Pen <a href="https://codepen.io/ianmcodes/pen/VwvXYYG">
  Star rating with SVG and CSS Progress bar</a> by Ian McCall (<a href="https://codepen.io/ianmcodes">@ianmcodes</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>