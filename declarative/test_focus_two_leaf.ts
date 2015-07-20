
/// <reference path="../controls.ts"/>

module gApp {
    var elStateGroup: HTMLElement = document.createElement("div");
    elStateGroup.classList.add("-stateGroup");
    var elStateLeft: HTMLElement = document.createElement("div");
    elStateLeft.classList.add("-stateLeft");
    var elStateRight: HTMLElement = document.createElement("div");
    elStateRight.classList.add("-stateRight");
    var elContent: HTMLElement = document.createElement("div");
    elContent.classList.add("-content");
    document.body.appendChild(elStateGroup);
    document.body.appendChild(elStateLeft);
    document.body.appendChild(elStateRight);
    document.body.appendChild(elContent);

    var padding = 4;
    var margins = [10];

    var root = Controls.LayoutGroupControl({
        el: elContent,
        id: 'idRoot',
        orientation: Controls.TParamOrientation.EHorizontal,

        controls: [
            Controls.LayoutControl({
                id: 'left',
                itemDrawers: [
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-0");
                        aEl.innerText = "0";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-1");
                        aEl.innerText = "1";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-2");
                        aEl.innerText = "2";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-3");
                        aEl.innerText = "3";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-4");
                        aEl.innerText = "4";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                ],
                padding: padding,
                margins: margins,
                childHAlign: Controls.TParamHAlign.ECenter,
                childVAlign: Controls.TParamVAlign.ECenter,
                onFocusChanged: function(aOld: HTMLElement, aNew: HTMLElement) {
                    elStateLeft.innerText = "Left: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
                },
                onFocusGained: function(aControl: Controls.CControl) {
                    elStateLeft.innerText = "Left focus gained";
                    elStateLeft.classList.add("-gained");
                },
                onFocusLost: function(aControl: Controls.CControl) {
                    elStateLeft.innerText = "Left focus lost";
                    elStateLeft.classList.remove("-gained");
                }
            }),
            Controls.LayoutControl({
                id: 'right',
                itemDrawers: [
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-0");
                        aEl.innerText = "5";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-1");
                        aEl.innerText = "6";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-2");
                        aEl.innerText = "7";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-3");
                        aEl.innerText = "8";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                    function (aEl: HTMLElement, aIndex: number) {
                        aEl.classList.add("-item-4");
                        aEl.innerText = "9";
                        return Controls.TFocusInfo.KFocusAble;
                    },
                ],
                padding: padding,
                margins: margins,
                childHAlign: Controls.TParamHAlign.ECenter,
                childVAlign: Controls.TParamVAlign.ECenter,
                onFocusChanged: function(aOld: HTMLElement, aNew: HTMLElement) {
                    elStateRight.innerText = "Right: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
                },
                onFocusGained: function(aControl: Controls.CControl) {
                    elStateRight.innerText = "Right focus gained";
                    elStateRight.classList.add("-gained");
                },
                onFocusLost: function(aControl: Controls.CControl) {
                    elStateRight.innerText = "Right focus lost";
                    elStateRight.classList.remove("-gained");
                }
            }),
        ],

        onChildFocusChanged: function(aOld: Controls.CControl, aNew: Controls.CControl) {
            elStateGroup.innerText = "Group: [" + aOld.getId() + "] -> [" + aNew.getId() + "]";
        },
        onFocusGained: function(aControl: Controls.CControl) {
            elStateGroup.innerText = "Group focus gained";
        },
        onFocusLost: function(aControl: Controls.CControl) {
            elStateGroup.innerText = "Group focus lost";
        }
    });

    Controls.runRoot(root);
}
