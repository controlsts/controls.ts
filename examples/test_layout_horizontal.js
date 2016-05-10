var App;
(function (App) {
    var itemDrawers = [
        function (aEl, aIndex) {
            aEl.classList.add("-item-" + aIndex);
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
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(Controls.TParamHAlign.ERight);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.ECenter);
    lay1.setChildHAlign(Controls.TParamHAlign.ERight);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.EBottom);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.EBottom);
    lay1.setChildHAlign(Controls.TParamHAlign.ECenter);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setOrientation(Controls.TParamOrientation.EHorizontal);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(Controls.TParamVAlign.EBottom);
    lay1.setChildHAlign(Controls.TParamHAlign.ERight);
    child.push(lay1);
    var el = document.createElement("div");
    document.body.appendChild(el);
    var root = new Controls.CLayoutGroupControl(el);
    root.setOrientation(Controls.TParamOrientation.EHorizontal);
    root.setOwnedChildControls(child);
    root.setPadding(2);
    Controls.runRoot(root);
})(App || (App = {}));
//# sourceMappingURL=test_layout_horizontal.js.map