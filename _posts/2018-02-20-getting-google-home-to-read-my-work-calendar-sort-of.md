---
layout: post
title: "Getting Google Home to Read My Work Calendar (Sort of)"
description: ""
category: post
tags: Google Google_Home calendar Apps_Script js
---

I love my Google Home devices. I was skeptical at first about how useful how useful a device could be if the only way to interact with is is through voice commands, but it turns out there are a whole host of tasks where it's actually really convenient to just say "Hey Google" a command and listen to the response. There are limitations to the interaction medium, but I can almost always turn to my phone or a computer in those cases.

The Problem
-----------

In fact, the only limitations that I have encountered that have really frustrated me have been with semi arbitrary back-end limitations. One such shortcoming has been with calender support. 

The problem that I have is with the "next meeting" feature. This relies on reading your Google Calendar and returning the next event you have that day. Google recently added support for multiple calendars (originally they only supported reading your default Google Calendar). But that doesn't help if your work calendar is under a separate Google work account, or worse, not in Google at all.

In this case you may be able to add the calendar to your Google Calendar using an iCal URL, but this would add it under "other calendars" which cannot be read by Google Home. Another possibility may be to export your calendar from where it is and import it into your Google Calendar, but this won't stay up to date with changes and additions to your work calendar. What's needed in this case is some way to sync events in the work calendar to a Google Calendar that Google Home can read.

Google Apps Script to the Rescue
--------------------------------

Using Google Apps Script I was able to easily create a script to do exactly what I needed. Every night (after 2am) the script runs. It one reads the day's events from my work calendar (which has been added under "other calendars") and adds each event to a "sync" calendar that I created and that Google Home can read.

### Sync Todays Events

```javascript
function syncToday() {
  var today = new Date();
  var otherCal = CalendarApp.getCalendarById(otherCalendarId);
  var syncCal = CalendarApp.getCalendarById(syncCalendarId);
  var todaysEvents = otherCal.getEventsForDay(today);
  for(var i = 0; i < todaysEvents.length; i++) {
    var evt = todaysEvents[i];
    if(!evt.isAllDayEvent()) {
      // Create event in sync Cal
      syncCal.createEvent(evt.getTitle(),evt.getStartTime(),evt.getEndTime());
    }
  }
}
```
I am excluding all day events out of personal preference. You may also notice that I'm only setting title, start, and end time on the event. It is possible to set other fields, like description or location, but that just isn't something that I need yet. The calendar id's can be found in the calendar settings in Google Calendar. Just scroll down to the box titled "Integrate calendar".

There are few limitations with this solution of course. First, it only works if you can add your work calendar to Google using an iCal URL. Also, it does not stay up-to-date with changes to your schedule that day. You could modify this to run more often. You would just need to delete events from the sync calendar before adding events or do something else to prevent duplicates. For now this is enough for me, since I only use it once in the morning. But I will update this post if I decide to modify it.

As always, YMMV. I just hopes this helps you if you are having this problem, or something similar.