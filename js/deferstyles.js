(function() {
    var styles = [
        '/css/syntax.css',
        '/css/custom_icons.css',
        '/css/octicons/octicons.min.css'
    ];
    if(window.deferedStyles) {
        styles = styles.concat(window.deferedStyles);
    }
    var head = document.getElementsByTagName('head')[0];
    window.loadDeferedStyle = function(file) {
        var el;
        el = document.createElement('link');
        el.rel = 'stylesheet';
        el.href = file;
        head.appendChild(el);
    }
    for(var i = 0; i < styles.length; i++) {
        loadDeferedStyle(styles[i]);
    }
})();