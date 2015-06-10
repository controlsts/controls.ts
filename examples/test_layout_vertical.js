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
    lay1.setChildHAlign(2 /* ECenter */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildHAlign(3 /* ERight */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(2 /* ECenter */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(2 /* ECenter */);
    lay1.setChildHAlign(2 /* ECenter */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(2 /* ECenter */);
    lay1.setChildHAlign(3 /* ERight */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(3 /* EBottom */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(3 /* EBottom */);
    lay1.setChildHAlign(2 /* ECenter */);
    child.push(lay1);
    lay1 = new Controls.CLayoutControl(null);
    lay1.setItemDrawers(itemDrawers);
    lay1.setPadding(padding);
    lay1.setMargins(margines);
    lay1.setChildVAlign(3 /* EBottom */);
    lay1.setChildHAlign(3 /* ERight */);
    child.push(lay1);
    var el = document.createElement("div");
    document.body.appendChild(el);
    var root = new Controls.CLayoutGroupControl(el);
    root.setOwnedChildControls(child);
    root.setPadding(2);
    root.draw();
    root.setActiveFocus();
    document.body.addEventListener('keydown', function (e) {
        var handled = root.doKey(e['keyIdentifier']);
        if (handled) {
            e.stopPropagation();
            e.preventDefault();
        }
    });
})(gApp || (gApp = {}));
//# sourceMappingURL=test_layout_vertical.js.map