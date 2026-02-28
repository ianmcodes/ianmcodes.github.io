/*jshint browser: true*/
(function() {
    var workerScript = document.currentScript && document.currentScript.dataset.serviceWorker;
    var hadController = !!navigator.serviceWorker.controller;
    var didRefresh = false;

    function refreshOnNewController() {
        if(!hadController || didRefresh) {
            return;
        }
        didRefresh = true;
        window.location.reload();
    }

    if(workerScript && 'serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', refreshOnNewController);
        navigator.serviceWorker.register(workerScript);
    }
})();