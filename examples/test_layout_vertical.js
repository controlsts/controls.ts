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
    var child = [];
    var padding = 4;
    var margines = [10];
    var lay1;
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(Controls.TParamHAlign.ERight);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    lay1.setChildHAlign(Controls.TParamHAlign.ERight);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.EBottom);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.EBottom);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.EBottom);
    lay1.setChildHAlign(Controls.TParamHAlign.ERight);
    child.push(lay1);
    var el = document.createElement("div");
    document.body.appendChild(el);
    var root = new Controls.CLayoutGroupControl(el);
    root.setOwnedChildControls(child);
    root.setPadding(2);
    Controls.runRoot(root);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_layout_vertical.js.map