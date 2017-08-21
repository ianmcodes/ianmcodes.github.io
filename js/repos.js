/*jshint browser: true, jquery: true*/
/*globals console, _*/
$(function ready() {
    if (typeof console === 'undefined')
        console = {
            log: function empty() {}
        };
    var repoTmpl = $("script#repo_tmpl").text();
    $.ajax("https://api.github.com/users/dapuck/repos?sort=updated").done(function _process(data) {
        console.log(data);
        var html = _.template(repoTmpl)({
            repos: data
        });
        $("ul#list-o-repos").html(html);
        // let css decide if it should be seen
        document.getElementById('repo-container').style.display = "";
    });
    // load repo css
    var styl = document.createElement('link');
    styl.rel = 'stylesheet';
    styl.href = '/css/repo_list.css';
    document.getElementsByTagName('head')[0].appendChild(styl);
});