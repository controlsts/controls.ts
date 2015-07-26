/// <reference path="../controls.ts"/>

module gApp {

    var data = [];

    for (var i=0; i<20; i++) {
        data.push({
            type: 'textItem',
            text: "Loem ipsum " + i
        });
    }

    var root = Controls.LayoutGroupControl({
        el: document.body,
        id: 'root',
        orientation: Controls.TParamOrientation.EVertical,
        controls: [
            Controls.LayoutControl({
                id: 'idStatus'
            }),
            Controls.ListControl({
                id: 'idList',
                itemHeight: 70,
                data: data,
                dataDrawer: function (aKey:any, aItem:any, aEl:HTMLElement) {
                    aEl.classList.add(aItem.type);
                    aEl.style.opacity = '.5';
                    aEl.innerText = aKey + ": " + aItem.text;
                    return Controls.TFocusInfo.KFocusAble;
                },
                onFocusedDataItemChanged: function (
                    aKeyNew: any, aItemNew: any, aElNew: HTMLElement,
                    aKeyOld: any, aItemOld: any, aElOld: HTMLElement) {
                    document.getElementById('idStatus').innerText = aItemNew.text;
                },
                onItemSelected: function(aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
                    document.getElementById('idStatus').innerText = aEl.innerText;
                }
            })
        ]
    });

    Controls.runRoot(root);

}
