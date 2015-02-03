---
layout: post
title: "CORS with mod_perl"
description: ""
category: post
---

Recently at work, I added support for Cross Origin Resource Sharing (CORS) to our web infrastructure. There is lots of information online about how CORS works and how to add support for it to your server. In fact, there is even a web site called [enable-cors.org](http://enable-cors.org/) that has good information on how to enable CORS on many platforms. It's a good for a start, but not enough for a production environment.

First a little about our environment, and a little about CORS. Where I work we use, predominantly, Apache with mod_perl. No Moose, no Catalyst, no Mojolicious. The infrastructure predates most if not all of them. CORS, if you don't already know, is a security feature enforced by the browser. You can find much more detailed information on how a CORS request works (such as the [Using CORS](http://www.html5rocks.com/en/tutorials/cors/) tutorial on HTML5 Rocks). But at it's simplest the browser will send an `Origin` header with the request that details the protocol (ex. http, https) and the full domain that the request was sent from. The server will respond with an `Access-Control-Allow-Origin` header that will have a list of allowed domains. If the Origin that was sent is in the list, the browser will process the response, otherwise it will give an error. There are additional headers about credentials and methods, but I won't get into that.

The examples on [enable-cors.org](http://enable-cors.org/) all have you set the `Access-Control-Allow-Origin` header to `*`, which would allow any domain. This is fine for testing or if you really want to allow any domain. But most of the time you will likely want to use this header to help restrict who can make requests to your API.

For us, if we only had a limited number of domains to allow requests from, we could just add `Header set Access-Control-Allow-Origin "http://domain.tld"` to the Apache config and be done. Of course it's never that simple. We have many, potentially hundreds of clients that could want CORS support, and trying to do that all with just Apache would be unmanageable. We needed a database driven solution in our Perl code. Fortunately, with mod_perl and how our system was already structured, adding support was easy.

Without getting too deep into the details of our architecture, we already had table for recording what appkeys were assigned to what urls (this is for internal urls and CNAMEs) so we just used that table to record allowed origins and assign them appkeys. Then, alongside our normal checks, I added code to check for the `Origin` header. If the origin in the request matches the one for the key, we set the `Access-Control-Allow-Origin` header like so:

```perl
$r->err_headers_out->add("Access-Control-Allow-Origin" => $origin)
```

We set the header to the origin that was sent so we can keep the header appropriately limited and still be sure that the browser will accept the request.
