let {gui} = require("./slider");
let {init} = require("./slider");

class Slider {
    constructor(data) {
        try {
            gui.call(this, data);

            if (document.readyState === "loading") {
                document.addEventListener("DOMContentLoaded", () => {
                    init.call(this, data);
                });
            } else {
                init.call(this, data);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = Slider;
