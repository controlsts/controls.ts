/// <reference path="../controls.ts"/>
var App;
(function (App) {
    var root = document.body;
    root.id = "idRoot";
    var lcgRoot = Controls.LayoutGroupControl({
        el: root,
        controls: [
            Controls.LayoutControl({
                itemDrawers: [
                    function (aElement, aIndex) {
                        aElement.id = "idStatus";
                        aElement.innerText = "-status";
                        return 2 /* KFocusAble */;
                    },
                ]
            }),
            Controls.LayoutGroupControl({
                id: 'idContent',
                stretchWidth: true,
                stretchHeight: true,
                orientation: 2 /* EHorizontal */,
                controls: [
                    Controls.LayoutControl({
                        width: 100,
                        stretchHeight: true,
                        itemDrawers: [
                            function (aElement, aIndex) {
                                aElement.id = "-menu-upper-item1";
                                aElement.innerText = "-menu-upper-item1";
                                return 2 /* KFocusAble */;
                            },
                            function (aElement, aIndex) {
                                aElement.id = "-menu-lower-item1";
                                aElement.innerText = "-menu-lower-item1";
                                return 2 /* KFocusAble */;
                            }
                        ]
                    }),
                    Controls.LayoutControl({
                        stretchWidth: true,
                        stretchHeight: true,
                        itemDrawers: [
                            function (aElement, aIndex) {
                                aElement.id = "-content1-item1";
                                aElement.innerHTML = "-content1-item1";
                                return 2 /* KFocusAble */;
                            },
                            function (aElement, aIndex) {
                                aElement.id = "-content2-item1";
                                aElement.innerHTML = "-content2-item1";
                                return 2 /* KFocusAble */;
                            }
                        ]
                    })
                ]
            }),
            Controls.LayoutControl({
                stretchWidth: true,
                itemDrawers: [
                    function (aElement, aIndex) {
                        aElement.id = "idFooter";
                        aElement.innerText = "Footer";
                        return 2 /* KFocusAble */;
                    },
                ]
            })
        ]
    });
    Controls.runRoot(lcgRoot);
})(App || (App = {}));
//# sourceMappingURL=test_layout.js.map