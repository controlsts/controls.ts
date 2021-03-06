var gApp;
(function (gApp) {
    var itemDrawers = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-3");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-4");
            return Controls.TFocusInfo.KFocusAble;
        },
    ];
    var itemDrawers0 = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-0");
            return Controls.TFocusInfo.KFocusAble;
        },
    ];
    var itemDrawers1 = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-1");
            return Controls.TFocusInfo.KFocusAble;
        },
    ];
    var itemDrawers2 = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            return Controls.TFocusInfo.KFocusAble;
        },
        function (aEl, aIndex) {
            aEl.classList.add("-item-2");
            return Controls.TFocusInfo.KFocusAble;
        },
    ];
    var handlers = {
        _open: function (aControl, aIndex, aEl) {
            layeredGroup.createLayer({
                transition: {
                    prevLayer: "moveLeft",
                    newLayer: "moveLeft",
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
    layoutControl0.setOrientation(Controls.TParamOrientation.EHorizontal);
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
    layoutControl0.connectItemSelected(handlers, "_open", handlers._open);
    layoutControl1.connectItemSelected(handlers, "_open", handlers._open);
    Controls.runRoot(layeredGroup);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_layered_grouplayout.js.map