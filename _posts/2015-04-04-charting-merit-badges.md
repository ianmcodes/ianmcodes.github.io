---
layout: post
title: "Charting Merit Badges"
description: ""
categories: 
head_js:
  - "https://code.highcharts.com/highcharts.js"

---

Back around the end of March Bryan Wendell, from Bryan on Scouting, posted an update 
about the popularity of different merit badges base on the number earned last year.

It's a great article if you are into scouting or data (or both) and you can read
it [here](http://blog.scoutingmagazine.org/2015/03/25/2014-merit-badge-rankings/). Bryan 
has data like this going back to 2009, and he is good enough to provide that data in
a PDF. The only thing the article is missing is a chart that shows the change in
popularity over time. So I decided to take the data and use the Highcharts library
to create an interactive chart.

Just click the button below to load the chart. (There are a lot of data points 
so it may take some time to load on slower systems).

<button id="load_chart" raised>Load Chart</button>

<div id="badge_chart" style="width: 100%; height: 800px;"></div>
<script type="text/javascript">
document.addEventListener('DOMContentLoaded', function domLoaded() {
  var data = {{ site.data.merit_badges_earned_by_year | jsonify }};
  var show_badges = ["Cooking*","First Aid*","Swimming**","Environmental Science****"];
  for(var i = 0; i < data.length; i++) {
    if(show_badges.indexOf(data[i].name) === -1) {
      data[i].visible = false;
    }
  }
  document.querySelector("#load_chart").onclick = function() {
    Highcharts.chart('badge_chart', {
      title: {
        text: "Merit Badges Earned by Year"
      },
      subtitle: {
        text: "Source: Bryan on Scouting"
      },
      xAxis: {
        categories: ["2009", "2010", "2011", "2012", "2013", "2014"]
      },
      yAxis: {
        title: {
          text: "Number Earned"
        }
      },
      series: data
    });
    document.querySelector('#load_chart').hidden = true;
  };
});
</script>
