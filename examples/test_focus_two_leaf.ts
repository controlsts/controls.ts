
/// <reference path="../controls.ts"/>

module gApp {
    var itemDrawersLeft = [
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
    ];

    var itemDrawersRight = [
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
    ];

    var padding = 4;
    var margines = [10];

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

    class CHandler {
        _focusChangedGroup(aOld: Controls.CControl, aNew: Controls.CControl) {
            elStateGroup.innerText = "Group: [" + aOld.getId() + "] -> [" + aNew.getId() + "]";
        }
        _focusChangedLeft(aOld: HTMLElement, aNew: HTMLElement) {
            elStateLeft.innerText = "Left: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
        }
        _focusChangedRight(aOld: HTMLElement, aNew: HTMLElement) {
            elStateRight.innerText = "Right: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
        }
        _focusGainedGroup(aControl: Controls.CControl) {
            elStateGroup.innerText = "Group focus gained";
        }
        _focusGainedLeft(aControl: Controls.CControl) {
            elStateLeft.innerText = "Left focus gained";
            elStateLeft.classList.add("-gained");
        }
        _focusGainedRight(aControl: Controls.CControl) {
            elStateRight.innerText = "Right focus gained";
            elStateRight.classList.add("-gained");
        }
        _focusLostGroup(aControl: Controls.CControl) {
            elStateGroup.innerText = "Group focus lost";
        }
        _focusLostLeft(aControl: Controls.CControl) {
            elStateLeft.innerText = "Left focus lost";
            elStateLeft.classList.remove("-gained");
        }
        _focusLostRight(aControl: Controls.CControl) {
            elStateRight.innerText = "Right focus lost";
            elStateRight.classList.remove("-gained");
        }
    }

    var handler = new CHandler();

    var lay1: Controls.CLayoutControl;
    lay1 = new Controls.CLayoutControl(null);
    lay1.setId("left");
    lay1.setItemDrawers(itemDrawersLeft);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    lay1.connectFocusChanged(handler, "_focusChangedLeft", handler._focusChangedLeft);
    lay1.connectFocusGained(handler, "_focusGainedLeft", handler._focusGainedLeft);
    lay1.connectFocusLost(handler, "_focusLostLeft", handler._focusLostLeft);
    lay1["_doKeyNumber"] = function (no) {
        lay1.setFocusedElementByIndex(no);
    };

    var lay2: Controls.CLayoutControl;
    lay2 = new Controls.CLayoutControl(null);
    lay2.setId("right");
    lay2.setItemDrawers(itemDrawersRight);
    lay2.setPadding(padding);
    lay2.setMargins(margines);
    lay2.setChildHAlign(Controls.TParamHAlign.ECenter);
    lay2.setChildVAlign(Controls.TParamVAlign.ECenter);
    lay2.connectFocusChanged(handler, "_focusChangedRight", handler._focusChangedRight);
    lay2.connectFocusGained(handler, "_focusGainedRight", handler._focusGainedRight);
    lay2.connectFocusLost(handler, "_focusLostRight", handler._focusLostRight);
    lay2["_doKeyNumber"] = function (no) {
        lay2.setFocusedElementByIndex(no);
    };

    var group = new Controls.CLayoutGroupControl(elContent);
    group.setOrientation(Controls.TParamOrientation.EHorizontal);
    group.setOwnedChildControls([lay1, lay2]);
    group.connectChildFocusChanged(handler, "_focusChangedGroup", handler._focusChangedGroup);
    group.connectFocusGained(handler, "_focusGainedGroup", handler._focusGainedGroup);
    group.connectFocusLost(handler, "_focusLostGroup", handler._focusLostGroup);
    group["_doKeyNumber"] = function (no) {
        if (no < 5) {
            lay1.setFocusedElementByIndex(no);
        } else {
            lay2.setFocusedElementByIndex(no - 5);
        }
        return true;
    };
    group["_doKeyPageUp"] = function () {
        group.setFocusedElementByIndex(0);
    };
    group["_doKeyPageDown"] = function () {
        group.setFocusedElementByIndex(1);
    };
    group.draw();
    group.setActiveFocus();

    document.body.addEventListener('keydown', function (e) {
        var keyStr = e['keyIdentifier'];
        var handled = group.doKey(keyStr);
        console.log(handled);

        var skip = {
            'Up': true,
            'Down': true,
            'Left': true,
            'Right': true
        };

        if (skip[keyStr]) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

}
