let {gui} = require("./slider");
let {init} = require("./slider");

class Slider {
    constructor(data) {
        gui.call(this, data);

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => {
                init.call(this, data);
            });
        } else {
            init.call(this, data);
        }
    }
}

module.exports = Slider;
