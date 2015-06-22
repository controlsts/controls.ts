/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var itemDrawers = [
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
    var padding = 4;
    var margines = [10];
    var elState = document.createElement("div");
    elState.classList.add("-state");
    var elContent = document.createElement("div");
    elContent.classList.add("-content");
    document.body.appendChild(elState);
    document.body.appendChild(elContent);
    var CHandler = (function () {
        function CHandler() {
        }
        CHandler.prototype._focusChanged = function (aOld, aNew) {
            elState.innerText = "[" + aOld.innerText + "] -> [" + aNew.innerText + "]";
        };
        return CHandler;
    })();
    var handler = new CHandler();
    var lay1;
    lay1 = new Controls.CLayoutControl(elContent);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(2 /* ECenter */);
    lay1.setChildVAlign(2 /* ECenter */);
    lay1.connectFocusChanged(handler, "_focusChanged", handler._focusChanged);
    lay1.draw();
    lay1.setActiveFocus();
    lay1["_doKeyNumber"] = function (no) {
        lay1.setFocusedElementByIndex(no);
    };
    document.body.addEventListener('keydown', function (e) {
        var keyStr = e['keyIdentifier'];
        var handled = lay1.doKey(keyStr);
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
//# sourceMappingURL=test_focus_one_leaf.js.map