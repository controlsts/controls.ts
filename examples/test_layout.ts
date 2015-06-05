/// <reference path="../controls.ts"/>

module App {

    var status: Controls.CLayoutControl = new Controls.CLayoutControl(null);
    status.setItemDrawers([
        function (aElement: HTMLElement, aIndex: number) {
            aElement.id = "-status";
            aElement.innerText = "-status";
            return Controls.TFocusInfo.KFocusAble;
        },
    ]);

    var menuUpper = new Controls.CLayoutControl(null);
    menuUpper.setItemDrawers([
        function (aElement: HTMLElement, aIndex: number) {
            aElement.id = "-menu-upper-item1";
            aElement.innerText = "-menu-upper-item1";
            return Controls.TFocusInfo.KFocusAble;
        },
    ]);

    var menuLower = new Controls.CLayoutControl(null);
    menuLower.setItemDrawers([
        function (aElement: HTMLElement, aIndex: number) {
            aElement.id = "-menu-lower-item1";
            aElement.innerText = "-menu-lower-item1";
            return Controls.TFocusInfo.KFocusAble;
        },
    ]);

    var content1 = new Controls.CLayoutControl(null);
    content1.setItemDrawers([
        function (aElement: HTMLElement, aIndex: number) {
            aElement.id = "-content1-item1";
            aElement.innerHTML = "-content1-item1";
            return Controls.TFocusInfo.KFocusAble;
        },
    ]);

    var content2 = new Controls.CLayoutControl(null);
    content2.setItemDrawers([
        function (aElement: HTMLElement, aIndex: number) {
            aElement.id = "-content2-item1";
            aElement.innerHTML = "-content2-item1";
            return Controls.TFocusInfo.KFocusAble;
        },
    ]);

    var lcHorizontal = new Controls.CLayoutControl(null);
    lcHorizontal.setOrientation(Controls.TParamOrientation.EHorizontal);
    lcHorizontal.setItemDrawers([
        function (aElement: HTMLElement, aIndex: number) {
            aElement.id = "-h-item1";
            aElement.innerText = "-h-item1";
            return Controls.TFocusInfo.KFocusAble;
        },
    ]);

    var lcgMenu = new Controls.CLayoutGroupControl(null);
    lcgMenu.setOwnedChildControls([menuUpper, menuLower]);

    var lcgContent = new Controls.CLayoutGroupControl(null);
    lcgContent.setOrientation(Controls.TParamOrientation.EHorizontal);
    lcgContent.setOwnedChildControls([content1, content2]);

    var lcgHorizontal = new Controls.CLayoutGroupControl(null);
    lcgHorizontal.setId("-test-content");
    lcgHorizontal.setOrientation(Controls.TParamOrientation.EHorizontal);
    lcgHorizontal.setOwnedChildControls([lcgMenu, lcgContent]);

    var root = document.createElement("div");
    root.id = "-root";
    document.body.appendChild(root);

    var lcgRoot = new Controls.CLayoutGroupControl(root);
    lcgRoot.setOwnedChildControls([status, lcgHorizontal]);
    lcgRoot.draw();
    lcgRoot.setActiveFocus();

    document.body.addEventListener('keydown', function(e) {
        var handled = lcgRoot.doKey(e['keyIdentifier']);
        if (handled) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

}
