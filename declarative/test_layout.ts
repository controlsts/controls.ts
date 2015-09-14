/// <reference path="../controls.ts"/>

module App {
    console.log(window.innerWidth, window.innerHeight);
    var lcgRoot;
    window.addEventListener('resize', function() {
        less.modifyVars({
            '@SCREEN_WIDTH': window.innerWidth + 'px',
            '@SCREEN_HEIGHT': window.innerHeight + 'px'
        });
        lcgRoot.draw();
    }, true);
    less.modifyVars({
        '@SCREEN_WIDTH': window.innerWidth + 'px',
        '@SCREEN_HEIGHT': window.innerHeight + 'px'
    }).then(function() {
        console.log('start');
        var root = document.body;
        root.id = "idRoot";

        lcgRoot = Controls.LayoutGroupControl({
            el: root,
            controls: [
                Controls.LayoutControl({
                    itemDrawers: [
                        function (aElement: HTMLElement, aIndex: number) {
                            aElement.id = "idStatus";
                            aElement.innerText = "-status";
                            return Controls.TFocusInfo.KFocusAble;
                        },
                    ]
                }),
                Controls.LayoutGroupControl({
                    id: 'idContent',
                    orientation: Controls.TParamOrientation.EHorizontal,
                    controls: [
                        Controls.LayoutControl({
                            width: 100,
                            itemDrawers: [
                                function (aElement: HTMLElement, aIndex: number) {
                                    aElement.id = "-menu-upper-item1";
                                    aElement.innerText = "-menu-upper-item1";
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aElement: HTMLElement, aIndex: number) {
                                    aElement.id = "-menu-lower-item1";
                                    aElement.innerText = "-menu-lower-item1";
                                    return Controls.TFocusInfo.KFocusAble;
                                }
                            ]
                        }),
                        Controls.LayoutControl({
                            itemDrawers: [
                                function (aElement: HTMLElement, aIndex: number) {
                                    aElement.id = "-content1-item1";
                                    aElement.innerHTML = "-content1-item1";
                                    return Controls.TFocusInfo.KFocusAble;
                                },
                                function (aElement: HTMLElement, aIndex: number) {
                                    aElement.id = "-content2-item1";
                                    aElement.innerHTML = "-content2-item1";
                                    return Controls.TFocusInfo.KFocusAble;
                                }
                            ]
                        })
                    ]
                }),
                Controls.LayoutControl({
                    itemDrawers: [
                        function (aElement: HTMLElement, aIndex: number) {
                            aElement.id = "idFooter";
                            aElement.innerText = "Footer";
                            return Controls.TFocusInfo.KFocusAble;
                        },
                    ]
                })
            ]
        });

        Controls.runRoot(lcgRoot);

    });
}
