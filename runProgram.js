var main = function () {

};


self.onmessage = function (event) {
    var DEBUG = true;
    var timeInterval = event.data.time;

    var i = 0;
    setInterval(function () {
        if (i % 10 === 0) {
            self.postMessage({ line: "....tick..." });
        }
        i++;
        if (i > 100) { i = 0; }
    }, timeInterval);
};
