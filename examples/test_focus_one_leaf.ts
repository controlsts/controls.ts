
/// <reference path="../controls.ts"/>

module gApp {
    var itemDrawers = [
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

    var padding = 4;
    var margines = [10];

    var elState: HTMLElement = document.createElement("div");
    elState.classList.add("-state");
    var elContent: HTMLElement = document.createElement("div");
    elContent.classList.add("-content");
    document.body.appendChild(elState);
    document.body.appendChild(elContent);

    class CHandler {
        _focusChanged(aOld: HTMLElement, aNew: HTMLElement) {
            elState.innerText = "[" + aOld.innerText + "] -> [" + aNew.innerText + "]";
        }
    }

    var handler = new CHandler();

    var lay1: Controls.CLayoutControl;
    lay1 = new Controls.CLayoutControl(elContent);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
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

}
