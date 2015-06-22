/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var itemDrawersLeft = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            aEl.innerText = "0";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            aEl.innerText = "1";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            aEl.innerText = "2";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-3");
            aEl.innerText = "3";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-4");
            aEl.innerText = "4";
            return 2 /* KFocusAble */;
        },
    ];
    var itemDrawersRight = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            aEl.innerText = "5";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            aEl.innerText = "6";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            aEl.innerText = "7";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-3");
            aEl.innerText = "8";
            return 2 /* KFocusAble */;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-4");
            aEl.innerText = "9";
            return 2 /* KFocusAble */;
        },
    ];
    var padding = 4;
    var margines = [10];
    var elStateGroup = document.createElement("div");
    elStateGroup.classList.add("-stateGroup");
    var elStateLeft = document.createElement("div");
    elStateLeft.classList.add("-stateLeft");
    var elStateRight = document.createElement("div");
    elStateRight.classList.add("-stateRight");
    var elContent = document.createElement("div");
    elContent.classList.add("-content");
    document.body.appendChild(elStateGroup);
    document.body.appendChild(elStateLeft);
    document.body.appendChild(elStateRight);
    document.body.appendChild(elContent);
    var CHandler = (function () {
        function CHandler() {
        }
        CHandler.prototype._focusChangedGroup = function (aOld, aNew) {
            elStateGroup.innerText = "Group: [" + aOld.getId() + "] -> [" + aNew.getId() + "]";
        };
        CHandler.prototype._focusChangedLeft = function (aOld, aNew) {
            elStateLeft.innerText = "Left: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
        };
        CHandler.prototype._focusChangedRight = function (aOld, aNew) {
            elStateRight.innerText = "Right: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
        };
        CHandler.prototype._focusGainedGroup = function (aControl) {
            elStateGroup.innerText = "Group focus gained";
        };
        CHandler.prototype._focusGainedLeft = function (aControl) {
            elStateLeft.innerText = "Left focus gained";
            elStateLeft.classList.add("-gained");
        };
        CHandler.prototype._focusGainedRight = function (aControl) {
            elStateRight.innerText = "Right focus gained";
            elStateRight.classList.add("-gained");
        };
        CHandler.prototype._focusLostGroup = function (aControl) {
            elStateGroup.innerText = "Group focus lost";
        };
        CHandler.prototype._focusLostLeft = function (aControl) {
            elStateLeft.innerText = "Left focus lost";
            elStateLeft.classList.remove("-gained");
        };
        CHandler.prototype._focusLostRight = function (aControl) {
            elStateRight.innerText = "Right focus lost";
            elStateRight.classList.remove("-gained");
        };
        return CHandler;
    })();
    var handler = new CHandler();
    var lay1;
    lay1 = new Controls.CLayoutControl(null);
    lay1.setId("left");
    lay1.setItemDrawers(itemDrawersLeft);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(2 /* ECenter */);
    lay1.setChildVAlign(2 /* ECenter */);
    lay1.connectFocusChanged(handler, "_focusChangedLeft", handler._focusChangedLeft);
    lay1.connectFocusGained(handler, "_focusGainedLeft", handler._focusGainedLeft);
    lay1.connectFocusLost(handler, "_focusLostLeft", handler._focusLostLeft);
    lay1["_doKeyNumber"] = function (no) {
        lay1.setFocusedElementByIndex(no);
    };
    var lay2;
    lay2 = new Controls.CLayoutControl(null);
    lay2.setId("right");
    lay2.setItemDrawers(itemDrawersRight);
    lay2.setPadding(padding);
    lay2.setMargins(margines);
    lay2.setChildHAlign(2 /* ECenter */);
    lay2.setChildVAlign(2 /* ECenter */);
    lay2.connectFocusChanged(handler, "_focusChangedRight", handler._focusChangedRight);
    lay2.connectFocusGained(handler, "_focusGainedRight", handler._focusGainedRight);
    lay2.connectFocusLost(handler, "_focusLostRight", handler._focusLostRight);
    lay2["_doKeyNumber"] = function (no) {
        lay2.setFocusedElementByIndex(no);
    };
    var group = new Controls.CLayoutGroupControl(elContent);
    group.setOrientation(2 /* EHorizontal */);
    group.setOwnedChildControls([lay1, lay2]);
    group.connectChildFocusChanged(handler, "_focusChangedGroup", handler._focusChangedGroup);
    group.connectFocusGained(handler, "_focusGainedGroup", handler._focusGainedGroup);
    group.connectFocusLost(handler, "_focusLostGroup", handler._focusLostGroup);
    group["_doKeyNumber"] = function (no) {
        if (no < 5) {
            lay1.setFocusedElementByIndex(no);
        }
        else {
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
})(gApp || (gApp = {}));
//# sourceMappingURL=test_focus_two_leaf.js.map