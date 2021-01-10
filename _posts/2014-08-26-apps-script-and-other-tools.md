---
layout: post
title: "Apps Script and other tools"
description: "Easy ways to make life easier"
category: post
tags: [automation, IFTTT, Apps Script]
---

If you are like me, you have a lot to do in any given day. Some big, complicated things, like designing a new server architecture or crafting a complex and efficient SQL query. But there are also a lot of little things, like sorting and deleting email or keeping track of your Github issues.

As a coder, I could write custom scripts to automate most things. Most of these things, like my email and Github, have APIs that I can look up. Then I just need to write a script, put it somewhere that it can run with the needed permissions, and then put it on a cron or find some other way for it to be triggered. And you can't forget about having a way to authenticate with the service, making sure that any tokens or keys that you need stay secure, along with many other security concerns.

But I'm lazy! I don't want to write a ton of code to delete old emails or create reminders. And I just want to solve my problem, not a bunch of problems around my problem. Fortunately there are tools out there that can help. Two that I have used are IFTTT, and Google Apps Script.

IFTTT
-----

[IFTTT](https://ifttt.com/) (IF This Then That) is an app for iOS and Android (as well as on the web) that allows you to configure "recipes" that are basically really simple if statements, consisting of a condition and an action (This and That). The conditions and actions come from what they call "channels". They currently have over 100 channels, including GitHub and iOS Reminders. To use a channel you just need to activate it through IFTTT's web interface or app and give IFTTT permission.

Creating a recipe is easy. all you need to do is to first select to create a new recipe, select what channel and trigger to watch, and then select what channel and action to take. Depending on what trigger or action you choose, you may need to provide more details. 

Google Apps Script
------------------

As great as IFTTT is, you are still limited in what you can do with the triggers and actions that they have defined. For example, you cannot use it to delete old emails. But, if you use Gmail (and Google Drive) you can create an Apps Script.

Google Apps Script is, for the most part, JavaScript with some functions and utilities added for working with Google's services. I won't get into the nitty-gritty of writing Apps Scripts (for that you should start [here](https://developers.google.com/apps-script/)). But I will say that you can use it to create simple stand alone functions, more complex add ons for Google services like Doc or Sheets, or even full-blown web apps. I use an Apps Script to delete old cron emails, and other automated emails that I don't need to keep very long.
