
/// <reference path="../controls.ts"/>

module gApp {
    var el = document.createElement("div");
    document.body.appendChild(el);

    var layeredGroup = Controls.LayeredGroupControl({
        el: el,
        controls: [
            Controls.LayoutControl({
                itemDrawers: [
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-0");
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-1");
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-2");
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-3");
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-4");
                        return Controls.TFocusInfo.KFocusAble;
                    },
                ],
                onItemSelected: function(aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    var child;
                    if (aEl.classList.contains("-item-0")) {
                        child = Controls.LayoutControl({
                            itemDrawers: [
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-0");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-0");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-0");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-0");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-0");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                            ]
                        });
                    } else if (aEl.classList.contains("-item-1")) {
                        child = Controls.LayoutControl({
                            itemDrawers: [
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-1");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-1");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-1");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-1");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-1");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                            ]
                        });
                    } else if (aEl.classList.contains("-item-2")) {
                        child = Controls.LayoutControl({
                            itemDrawers: [
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-2");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-2");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-2");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-2");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aEl: HTMLElement, aIndex: number) {
                                    aEl.classList.add("-item-2");
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                            ]
                        });
                    }


                    Controls.LayeredGroupControl({
                        rootLayeredGroup: layeredGroup,
                        createLayerParam: {
                            transition: {
                                prevLayer: "moveLeft",
                                newLayer: "moveLeft",
                            }
                        },
                        controls:[
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
}

