/// <reference path="../controls.ts"/>

module App {

    var root = document.body;
    root.id = "idRoot";

    var lcgRoot = Controls.LayoutGroupControl({
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
                stretchWidth: true,
                stretchHeight: true,
                orientation: Controls.TParamOrientation.EHorizontal,
                controls: [
                    Controls.LayoutControl({
                        width: 100,
                        stretchHeight: true,
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
                        stretchWidth: true,
                        stretchHeight: true,
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
                stretchWidth: true,
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
}
