/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var data = [];
    for (var i = 0; i < 20; i++) {
        data.push({
            type: 'textItem',
            text: "Loem ipsum " + i
        });
    }
    var root = Controls.LayoutGroupControl({
        el: document.body,
        id: 'root',
        orientation: 1 /* EVertical */,
        controls: [
            Controls.LayoutControl({
                id: 'idStatus'
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
    });
    Controls.runRoot(root);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_listcontrol_vertical.js.map