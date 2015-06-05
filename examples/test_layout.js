/// <reference path="../controls.ts"/>
var App;
(function (App) {
    var status = new Controls.CLayoutControl(null);
    status.setItemDrawers([
        function (aElement, aIndex) {
            aElement.id = "-status";
            aElement.innerText = "-status";
            return 2 /* KFocusAble */;
        },
    ]);
    var menuUpper = new Controls.CLayoutControl(null);
    menuUpper.setItemDrawers([
        function (aElement, aIndex) {
            aElement.id = "-menu-upper-item1";
            aElement.innerText = "-menu-upper-item1";
            return 2 /* KFocusAble */;
        },
    ]);
    var menuLower = new Controls.CLayoutControl(null);
    menuLower.setItemDrawers([
        function (aElement, aIndex) {
            aElement.id = "-menu-lower-item1";
            aElement.innerText = "-menu-lower-item1";
            return 2 /* KFocusAble */;
        },
    ]);
    var content1 = new Controls.CLayoutControl(null);
    content1.setItemDrawers([
        function (aElement, aIndex) {
            aElement.id = "-content1-item1";
            aElement.innerHTML = "-content1-item1";
            return 2 /* KFocusAble */;
        },
    ]);
    var content2 = new Controls.CLayoutControl(null);
    content2.setItemDrawers([
        function (aElement, aIndex) {
            aElement.id = "-content2-item1";
            aElement.innerHTML = "-content2-item1";
            return 2 /* KFocusAble */;
        },
    ]);
    var lcHorizontal = new Controls.CLayoutControl(null);
    lcHorizontal.setOrientation(2 /* EHorizontal */);
    lcHorizontal.setItemDrawers([
        function (aElement, aIndex) {
            aElement.id = "-h-item1";
            aElement.innerText = "-h-item1";
            return 2 /* KFocusAble */;
        },
    ]);
    var lcgMenu = new Controls.CLayoutGroupControl(null);
    lcgMenu.setOwnedChildControls([menuUpper, menuLower]);
    var lcgContent = new Controls.CLayoutGroupControl(null);
    lcgContent.setOrientation(2 /* EHorizontal */);
    lcgContent.setOwnedChildControls([content1, content2]);
    var lcgHorizontal = new Controls.CLayoutGroupControl(null);
    lcgHorizontal.setId("-test-content");
    lcgHorizontal.setOrientation(2 /* EHorizontal */);
    lcgHorizontal.setOwnedChildControls([lcgMenu, lcgContent]);
    var root = document.createElement("div");
    root.id = "-root";
    document.body.appendChild(root);
    var lcgRoot = new Controls.CLayoutGroupControl(root);
    lcgRoot.setOwnedChildControls([status, lcgHorizontal]);
    lcgRoot.draw();
    lcgRoot.setActiveFocus();
    document.body.addEventListener('keydown', function (e) {
        var handled = lcgRoot.doKey(e['keyIdentifier']);
        if (handled) {
            e.stopPropagation();
            e.preventDefault();
        }
    });
})(App || (App = {}));
//# sourceMappingURL=test_layout.js.map