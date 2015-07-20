
/// <reference path="../controls.ts"/>

module gApp {
    var data3 = [];
    for (var i = 0; i < 3; i++) {
        data3.push('' + i);
    }

    var data7 = [];
    for (var i = 0; i < 7; i++) {
        data7.push('' + i);
    }

    var data10 = [];
    for (var i = 0; i < 10; i++) {
        data10.push('' + i);
    }

    var data = data7;

    var viewCount = 7;
    var itemWidth = 100;
    var itemHeight = 50;

    var root = Controls.LayoutGroupControl({
        el: document.body,
        id: 'root',
        orientation: Controls.TParamOrientation.EHorizontal,
        controls: [
            Controls.CarouselControl({
                id: 'idSimple',
                orientation: Controls.TParamOrientation.EVertical,
                viewCount: viewCount,
                itemWidth: itemWidth,
                itemHeight: itemHeight,
                anchorIndex: 3,
                data: data,
                dataDrawer: function(aElement: HTMLElement, aItem: any, aIndex: number) {
                    aElement.innerText = "Simple " + aItem;
                },
                onItemSelected: function(aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    alert(aIndex + ' Selected');
                }
            }),
            Controls.CarouselControl({
                id: 'idAnim',
                data: data,
                dataDrawer: function(aElement: HTMLElement, aItem: any, aIndex: number) {
                    aElement.innerText = "Anim " + aItem;
                },
                orientation: Controls.TParamOrientation.EVertical,
                viewCount: viewCount,
                itemWidth: itemWidth,
                itemHeight: itemHeight,
                anchorIndex: 3,
                onItemSelected: function(aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    alert(aIndex + ' Selected');
                },

                animation: true,
                maxKeyQueueCount: 3,
                drawEffect: 'spreadOut'
            }),
            Controls.CarouselControl({
                id: 'idTrans',
                data: data,
                dataDrawer: function(aElement: HTMLElement, aItem: any, aIndex: number) {
                    aElement.innerText = "Trans " + aItem;
                },
                orientation: Controls.TParamOrientation.EVertical,
                viewCount: viewCount,
                itemWidth: itemWidth,
                itemHeight: itemHeight,
                anchorIndex: 3,
                onItemSelected: function(aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    alert(aIndex + ' Selected');
                },

                animation: true,
                maxKeyQueueCount: 3,
                drawEffect: 'spreadOut',

                transparentAnchor: true
            })
        ]
    });

    Controls.runRoot(root);
}
