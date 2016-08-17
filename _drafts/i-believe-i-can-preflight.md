---
layout: post
title: "I Believe I Can PreFlight!"
description: "Responding to CORS PreFlight Request"
categories: 
---

This is a follow up to my previous post about [CORS with mod_perl]({% post_url 2014-09-17-cors-with-mod_perl %}), I wrote a little bit about CORS (Cross Origin Resource Sharing) and about setting the `Access-Control-Allow-Origin` header from mod_perl. If you haven't read it, I would recommend doing so (and not just because I wrote it :wink:).

On thing that I didn't write about was CORS "PreFlight". Under certain conditions the browser will first send a request to the server using the `OPTIONS` method. The response to this request determines if the browser even sends the actual request. This `OPTIONS` request is the "PreFlight", and it will have additional `Access-Control-Request-*` headers. And the response will require more headers as well, beyond just the `Access-Control-Allow-Origin` header for a simple CORS request/response.

There is some variation between browsers, but in general a CORS request will be "preflighted" if:

 * It uses a method other than `GET`, `HEAD`, or `POST`
 * The method is `POST` and the `Content-type` is something other than `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`
 * Custom headers are in the request

The `OPTIONS` request will have two new headers (in addition to the `Origin` header), `Access-Control-Request-Method` and `Access-Control-Request-Headers`. `Access-Control-Request-Method` will be the method that the browser will use for the actual request (ex. `POST`). `Access-Control-Request-Headers` will be a comma seperated list of header names that the server will need to approve. That will include any custom headers allong with `Content-type`.

One thing that the `OPTIONS` request will __NOT__ have is payload data. Similar to `GET` and `HEAD`, the request will only contain a path and headers.

In response to the `OPTIONS` request the server should send these headers

 * Just as with a simple CORS request, the response should have an `Access-Control-Allow-Origin` which matches the `Origin` header in the request. 
 * `Access-Control-Allow-Methods`, which should be a comma seperated list of HTTP methods that the server allows. This should include the method from `Access-Control-Request-Method`.
 * `Access-Control-Allow-Headers`, which should be a comma seperated list of allowed headers, and should contain the headers from `Access-Control-Request-Headers`.
 * `Access-Control-Max-Age`, which is the number of seconds the the response can be cached for. 
