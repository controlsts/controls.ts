/// <reference path="../controls.ts"/>
var App;
(function (App) {
    console.log(window.innerWidth, window.innerHeight);
    var data = [];
    for (var i = 0; i < 20; i++) {
        data.push({
            type: 'textItem',
            text: "Loem ipsum " + i
        });
    }
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
                            return 1 /* KFocusNone */;
                        },
                    ]
                }),
                Controls.LayoutGroupControl({
                    id: 'idContent',
                    orientation: 2 /* EHorizontal */,
                    controls: [
                        Controls.CarouselControl({
                            id: 'idMenu',
                            data: [{
                                text: 'Layout Control'
                            }, {
                                text: 'List Control'
                            }, {
                                text: 'Grid Control'
                            }],
                            //orientation: Controls.TParamOrientation.EVertical,
                            viewCount: 3,
                            itemWidth: 200,
                            itemHeight: 40,
                            anchorIndex: 1,
                            animation: true,
                            maxKeyQueueCount: 3,
                            drawEffect: 'spreadOut',
                            dataDrawer: function (aElement, aItem, aIndex) {
                                aElement.innerText = aItem.text;
                            }
                        }),
                        Controls.ListControl({
                            id: 'idList',
                            itemHeight: 70,
                            data: data,
                            dataDrawer: function (aKey, aItem, aEl) {
                                aEl.classList.add(aItem.type);
                                aEl.style.opacity = '.5';
                                aEl.innerText = aKey + ": " + aItem.text;
                                return 2 /* KFocusAble */;
                            },
                            onFocusedDataItemChanged: function (aKeyNew, aItemNew, aElNew, aKeyOld, aItemOld, aElOld) {
                                document.getElementById('idStatus').innerText = aItemNew.text;
                            },
                            onItemSelected: function (aControl, aIndex, aEl) {
                                document.getElementById('idStatus').innerText = aEl.innerText;
                            }
                        })
                    ]
                }),
                Controls.LayoutControl({
                    itemDrawers: [
                        function (aElement, aIndex) {
                            aElement.id = "idFooter";
                            aElement.innerText = "Footer";
                            return 1 /* KFocusNone */;
                        },
                    ]
                })
            ]
        });
        Controls.runRoot(lcgRoot);
    });
})(App || (App = {}));
//# sourceMappingURL=test_layout.js.map