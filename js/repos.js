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
                $("#repo-container").show();
            });
        });