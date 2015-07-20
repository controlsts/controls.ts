/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var data = [];
    for (var i = 0; i < 30; i++) {
        data.push({
            name: 'Name ' + i,
            text: 'Text ' + i
        });
    }
    var root = Controls.GridControl({
        el: document.body,
        id: 'idRoot',
        itemWidth: 90,
        itemHeight: 90,
        maxColCount: 4,
        animation: true,
        data: data,
        dataDrawer: function (aKey, aItem, aEl) {
            aEl.innerText = aKey + ': ' + aItem.name;
            return 2 /* KFocusAble */;
        },
        onFocusChanged: function (aOld, aNew) {
            aNew.innerText += 'focused';
        },
        onItemSelected: function (aControl, aIndex, aEl) {
            alert('index : ' + aIndex);
        }
    });
    Controls.runRoot(root);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_gridcontrol.js.map