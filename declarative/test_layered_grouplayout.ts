
/// <reference path="../controls.ts"/>

module gApp {
    var itemDrawers0 = [
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
    ];

    var itemDrawers1 = [
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
    ];

    var itemDrawers2 = [
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
    ];

    var itemDrawers3 = [
        function (aEl: HTMLElement, aIndex: number) {
            aEl.classList.add("-item-3");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl: HTMLElement, aIndex: number) {
            aEl.classList.add("-item-3");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl: HTMLElement, aIndex: number) {
            aEl.classList.add("-item-3");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl: HTMLElement, aIndex: number) {
            aEl.classList.add("-item-3");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl: HTMLElement, aIndex: number) {
            aEl.classList.add("-item-3");
            return Controls.TFocusInfo.KFocusAble;
        },
    ];

    var el = document.createElement("div");
    document.body.appendChild(el);

    var layeredGroup = Controls.LayeredGroupControl({
        el: el,
        controls: [
            Controls.LayoutControl({
                itemDrawers: itemDrawers0,
                orientation: Controls.TParamOrientation.EHorizontal,
                onItemSelected: function (aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    Controls.LayeredGroupControl({
                        rootLayeredGroup: layeredGroup,
                        createLayerParam: {
                            transition: {
                                prevLayer: "moveLeft",
                                newLayer: "moveLeft",
                            }
                        },
                        controls: [
                            Controls.LayoutControl({
                                itemDrawers: itemDrawers2
                            })
                        ]
                    });
                }
            }),
            Controls.LayoutControl({
                itemDrawers: itemDrawers1,
                onItemSelected: function (aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    Controls.LayeredGroupControl({
                        rootLayeredGroup: layeredGroup,
                        createLayerParam: {
                            transition: {
                                prevLayer: "moveLeft",
                                newLayer: "moveLeft",
                            }
                        },
                        controls: [
                            Controls.LayoutControl({
                                itemDrawers: itemDrawers3
                            })
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
