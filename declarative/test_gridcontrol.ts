
/// <reference path="../controls.ts"/>

module gApp{

    var data = [];

    for (var i=0; i<30; i++) {
        data.push({
            name: 'Name ' + i,
            text: 'Text ' + i
        });
    }
    //
    //var gridEventHandle = {
    //    _slFocusChanged: function (aOld: HTMLElement, aNew: HTMLElement) {
    //        aNew.innerText += 'focused'
    //    },
    //    _slItemSelected: function (aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
    //        alert('index : ' + aIndex);
    //    }
    //};

    var root = Controls.GridControl({
        el: document.body,
        id: 'idRoot',
        itemWidth: 90,
        itemHeight: 90,
        maxColCount: 4,
        animation: true,

        data: data,
        dataDrawer: function (aKey: any, aItem: any, aEl: HTMLElement) {
            aEl.innerText = aKey + ': ' + aItem.name;
            return Controls.TFocusInfo.KFocusAble;
        },

        onFocusChanged: function (aOld: HTMLElement, aNew: HTMLElement) {
            aNew.innerText += 'focused'
        },
        onItemSelected: function (aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
            alert('index : ' + aIndex);
        }
    });

    Controls.runRoot(root);

    //var el = document.createElement("div");
    //document.body.appendChild(el);
    //var grid: Controls.CGridControl;
    //grid = new Controls.CGridControl(el);
    //grid.setId('root');
    //grid.setListData(data);
    //grid.setMaxColCount(4);
    //grid.setItemWidth(90);
    //grid.setItemHeight(90);
    //grid.setAnimation(true);
    //grid.connectFocusChanged(gridEventHandle, '_slFocusChanged', gridEventHandle._slFocusChanged);
    //grid.connectItemSelected(gridEventHandle, '_slItemSelected', gridEventHandle._slItemSelected);
    //grid.setDataDrawer(function (aKey: any, aItem: any, aEl: HTMLElement) {
    //    aEl.innerText = aKey + ': ' + aItem.name;
    //    return Controls.TFocusInfo.KFocusAble;
    //});
    //grid.draw();
    //
    //document.body.addEventListener('keydown', function (e) {
    //    var keyStr = e['keyIdentifier'];
    //    var handled = grid.doKey(keyStr);
    //    console.log(handled);
    //
    //    var skip = {
    //        'Up': true,
    //        'Down': true,
    //        'Left': true,
    //        'Right': true
    //    };
    //
    //    if (skip[keyStr]) {
    //        e.stopPropagation();
    //        e.preventDefault();
    //    }
    //});

}
