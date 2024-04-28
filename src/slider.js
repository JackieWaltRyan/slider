import "./style.scss";

import botton from "./images/button.svg";

export function scrollMeta(element) {
    if (element.scrollWidth > element.parentElement.offsetWidth) {
        element.style.setProperty("--scroll", (parseInt((element.parentElement.offsetWidth / (element.scrollWidth / 100)).toString()) + "%"));

        element.classList.add("slider_content_item_title_scroll");
    } else {
        element.classList.remove("slider_content_item_title_scroll");
    }

    setTimeout(() => {
        scrollMeta.call(this, element);
    }, 1000);
}

export function createElement(tag, params = {}, actions = () => {
}) {
    let el = document.createElement(tag);

    for (let name in params) {
        try {
            el.setAttribute(name, params[name]);
        } catch (e) {
            console.log(e);
        }
    }

    actions(el);

    return el;
}

export function mobile(value = null) {
    if (matchMedia("(any-pointer:coarse)").matches) {
        if (value) {
            return (value + "_mobile");
        } else {
            return true;
        }
    } else {
        if (value) {
            return value;
        } else {
            return false;
        }
    }
}

export function gui(data) {
    this.data = data;
    this.gui = {};

    if ((this.gui.root = document.querySelector(this.data.selector))) {
        this.gui.slider = {
            root: createElement("div", {
                class: "slider"
            }, (el) => {
                this.gui.root.appendChild(el);
            }),

            skeleton: createElement("div", {
                class: "slider_skeleton"
            }, (el) => {
                el.innerText = "Загрузка...";
            }),

            content: createElement("div", {
                class: "slider_content"
            }),

            paginator: {
                root: createElement("div", {
                    class: "slider_paginator"
                }),

                prevButton: createElement("img", {
                    class: mobile.call(this, "slider_paginator_button"),
                    src: botton
                }),

                indexes: createElement("div", {
                    class: "slider_paginator_indexes"
                }),

                nextButton: createElement("img", {
                    class: (mobile.call(this, "slider_paginator_button") + " slider_paginator_button_next"),
                    src: botton
                })
            }
        };

        this.gui.slider.paginator.root.appendChild(this.gui.slider.paginator.prevButton);
        this.gui.slider.paginator.root.appendChild(this.gui.slider.paginator.indexes);
        this.gui.slider.paginator.root.appendChild(this.gui.slider.paginator.nextButton);

        this.gui.slider.root.appendChild(this.gui.slider.skeleton);
        this.gui.slider.root.appendChild(this.gui.slider.content);
        this.gui.slider.root.appendChild(this.gui.slider.paginator.root);
    } else {
        alert("Не удается найти " + this.data.selector + " элемент.");
    }
}

export function init(data) {
    this.data = data;
    this.root = {
        timeout: null,
        index: 0
    };

    this.gui.slider.root.addEventListener("contextmenu", (event) => {
        event.preventDefault();

        return false;
    });

    this.gui.slider.paginator.prevButton.addEventListener("click", () => {
        update.call(this, (this.root.index - 1));
    });

    this.gui.slider.paginator.nextButton.addEventListener("click", () => {
        update.call(this, (this.root.index + 1));
    });

    let xhr = new XMLHttpRequest();

    xhr.open("GET", this.data.api, true);

    xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
            this.root.data = JSON.parse(xhr.responseText);

            let i = 0;

            for (let item in this.root.data) {
                try {
                    let element = {
                        root: createElement("a", {
                            class: "slider_content_item",
                            href: item,
                            style: ("background-image: url(" + this.root.data[item]["placeholder"] + ");"),
                            target: "_blank"
                        }, (el) => {
                            el.style.width = (this.gui.slider.root.offsetWidth + "px");

                            window.addEventListener("resize", () => {
                                el.style.width = (this.gui.slider.root.offsetWidth + "px");
                            });
                        }),

                        title: {
                            root: createElement("div", {
                                class: "slider_content_item_title"
                            }),

                            right: {
                                root: createElement("div", {
                                    class: "slider_content_item_title_right"
                                }),

                                h2: createElement((mobile.call(this) ? "h5" : "h2"), {
                                    class: "slider_content_item_title_h2"
                                }, (el) => {
                                    el.innerText = this.root.data[item]["views"];
                                }),

                                h3: createElement((mobile.call(this) ? "h6" : "h3"), {
                                    class: "slider_content_item_title_h3"
                                }, (el) => {
                                    el.innerText = "просмотров";
                                })
                            },

                            hr: createElement("hr", {
                                class: mobile.call(this, "slider_content_item_title_hr")
                            }),

                            left: {
                                root: createElement("div", {
                                    class: "slider_content_item_title_left"
                                }),

                                h2: createElement((mobile.call(this) ? "h5" : "h2"), {
                                    class: "slider_content_item_title_h2"
                                }, (el) => {
                                    el.innerText = this.root.data[item]["name"];
                                }),

                                h3: createElement((mobile.call(this) ? "h6" : "h3"), {
                                    class: "slider_content_item_title_h3"
                                }, (el) => {
                                    el.innerText = this.root.data[item]["title"];
                                })
                            }
                        }
                    };

                    let button = createElement("button", {
                        class: "slider_paginator_indexes_button"
                    }, (el) => {
                        el.innerText = (i + 1);

                        let index = i;

                        el.addEventListener("click", () => {
                            update.call(this, index);
                        });
                    });

                    i++;

                    element.title.right.root.appendChild(element.title.right.h2);
                    element.title.right.root.appendChild(element.title.right.h3);

                    element.title.root.appendChild(element.title.right.root);

                    element.title.root.appendChild(element.title.hr);

                    element.title.left.root.appendChild(element.title.left.h2);
                    element.title.left.root.appendChild(element.title.left.h3);

                    element.title.root.appendChild(element.title.left.root);

                    element.root.appendChild(element.title.root);

                    this.gui.slider.content.appendChild(element.root);
                    this.gui.slider.paginator.indexes.appendChild(button);

                    scrollMeta.call(this, element.title.left.h2);
                    scrollMeta.call(this, element.title.left.h3);
                } catch (e) {
                    console.log(e);
                }
            }

            this.gui.slider.skeleton.style.display = "none";
            this.gui.slider.skeleton.style.animation = "none";

            update.call(this, this.root.index);
        } else {
            setTimeout(() => {
                init.call(this, this.data);
            }, 1000);
        }
    });

    xhr.addEventListener("error", () => {
        setTimeout(() => {
            init.call(this, this.data);
        }, 1000);
    });

    xhr.send();
}

export function update(index) {
    clearTimeout(this.root.timeout);

    if (index > (this.gui.slider.content.children.length - 1)) {
        index = 0;
    }

    if (index < 0) {
        index = (this.gui.slider.content.children.length - 1);
    }

    this.gui.slider.content.style.transform = ("translateX(" + ((this.gui.slider.root.offsetWidth * index) * -1) + "px)");

    this.gui.slider.paginator.indexes.children[this.root.index].classList.remove("slider_paginator_indexes_button_active");
    this.gui.slider.paginator.indexes.children[index].classList.add("slider_paginator_indexes_button_active");

    this.root.index = index;

    if (!this.data.stop) {
        this.root.timeout = setTimeout(() => {
            update.call(this, (this.root.index + 1));
        }, 5000);
    }
}
