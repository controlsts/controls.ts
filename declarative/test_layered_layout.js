/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var el = document.createElement("div");
    document.body.appendChild(el);
    var layeredGroup = Controls.LayeredGroupControl({
        el: el,
        controls: [
            Controls.LayoutControl({
                itemDrawers: [
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-0");
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-1");
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-2");
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-3");
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-4");
                        return 2 /* KFocusAble */;
                    },
                ],
                onItemSelected: function (aControl, aIndex, aEl) {
                    var child;
                    if (aEl.classList.contains("-item-0")) {
                        child = Controls.LayoutControl({
                            itemDrawers: [
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-0");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-0");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-0");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-0");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-0");
                                    return 2 /* KFocusAble */;
                                },
                            ]
                        });
                    }
                    else if (aEl.classList.contains("-item-1")) {
                        child = Controls.LayoutControl({
                            itemDrawers: [
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-1");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-1");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-1");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-1");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-1");
                                    return 2 /* KFocusAble */;
                                },
                            ]
                        });
                    }
                    else if (aEl.classList.contains("-item-2")) {
                        child = Controls.LayoutControl({
                            itemDrawers: [
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-2");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-2");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-2");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-2");
                                    return 2 /* KFocusAble */;
                                },
                                function (aEl, aIndex) {
                                    aEl.classList.add("-item-2");
                                    return 2 /* KFocusAble */;
                                },
                            ]
                        });
                    }
                    Controls.LayeredGroupControl({
                        rootLayeredGroup: layeredGroup,
                        createLayerParam: {
                            transition: {
                                prevLayer: "moveLeft",
                                newLayer: "moveLeft"
                            }
                        },
                        controls: [
                            child
                        ]
                    });
                }
            })
        ]
    });
    layeredGroup["_doKeyBack"] = function () {
        layeredGroup.removeLayer();
        return true;
    };
    Controls.runRoot(layeredGroup);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_layered_layout.js.map