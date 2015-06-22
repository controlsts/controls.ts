/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var itemDrawers = [
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
    ];
    var itemDrawers0 = [
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
    ];
    var itemDrawers1 = [
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
    ];
    var itemDrawers2 = [
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
    ];
    var handlers = {
        _open: function (aControl, aIndex, aEl) {
            layeredGroup.createLayer({
                transition: {
                    prevLayer: "moveLeft",
                    newLayer: "moveLeft"
                }
            });
            if (aEl.classList.contains("-item-0")) {
                layeredGroup.createLayoutControl(itemDrawers0);
            }
            else if (aEl.classList.contains("-item-1")) {
                layeredGroup.createLayoutControl(itemDrawers1);
            }
            else if (aEl.classList.contains("-item-2")) {
                layeredGroup.createLayoutControl(itemDrawers2);
            }
            layeredGroup.draw();
        }
    };
    var layoutControl0 = new Controls.CLayoutControl(null);
    layoutControl0.setItemDrawers(itemDrawers0);
    layoutControl0.setOrientation(2 /* EHorizontal */);
    var layoutControl1 = new Controls.CLayoutControl(null);
    layoutControl1.setItemDrawers(itemDrawers1);
    var el = document.createElement("div");
    document.body.appendChild(el);
    var layeredGroup = new Controls.CLayeredGroupControl(el);
    layeredGroup.createLayer();
    layeredGroup["_doKeyBack"] = function () {
        layeredGroup.removeLayer();
        return true;
    };
    layeredGroup.createLayoutGroupControl([layoutControl0, layoutControl1]);
    layeredGroup.draw();
    layeredGroup.setActiveFocus();
    layoutControl0.connectItemSelected(handlers, "_open", handlers._open);
    layoutControl1.connectItemSelected(handlers, "_open", handlers._open);
    document.body.addEventListener('keydown', function (e) {
        var keyStr = e['keyIdentifier'];
        var handled = layeredGroup.doKey(keyStr);
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
//# sourceMappingURL=test_layered_grouplayout.js.map