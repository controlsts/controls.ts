/// <reference path="../controls.ts"/>
var App;
(function (App) {
    console.log(window.innerWidth, window.innerHeight);
    var lcgRoot;
    window.addEventListener('resize', function () {
        less.modifyVars({
            '@SCREEN_WIDTH': window.innerWidth + 'px',
            '@SCREEN_HEIGHT': window.innerHeight + 'px'
        });
        lcgRoot.draw();
    }, true);
    less.modifyVars({
        '@SCREEN_WIDTH': window.innerWidth + 'px',
        '@SCREEN_HEIGHT': window.innerHeight + 'px'
    }).then(function () {
        console.log('start');
        var root = document.body;
        root.id = "idRoot";
        lcgRoot = Controls.LayoutGroupControl({
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
                    orientation: 2 /* EHorizontal */,
                    controls: [
                        Controls.LayoutControl({
                            width: 100,
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
    });
})(App || (App = {}));
//# sourceMappingURL=test_layout.js.map