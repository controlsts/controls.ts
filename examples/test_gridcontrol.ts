
/// <reference path="../controls.ts"/>

module gApp{

    var data = [{
        name: 'AAA',
        text: 'text1'
    }, {
        name: 'BBB',
        text: 'text2'
    }, {
        name: 'CCC',
        text: 'text3'
    }, {
        name: 'DDD',
        text: 'text4'
    }, {
        name: 'EEE',
        text: 'text5'
    }, {
        name: 'FFF',
        text: 'text6'
    }, {
        name: 'GGG',
        text: 'text7'
    }, {
        name: 'HHH',
        text: 'text8'
    }, {
        name: 'III',
        text: 'text9'
    }, {
        name: 'JJJ',
        text: 'text10'
    }, {
        name: 'KKK',
        text: 'text11'
    }, {
        name: 'LLL',
        text: 'text12'
    }, {
        name: 'MMM',
        text: 'text13'
    }, {
        name: 'NNN',
        text: 'text14'
    }, {
        name: 'OOO',
        text: 'text15'
    }, {
        name: 'PPP',
        text: 'text16'
    }, {
        name: 'QQQ',
        text: 'text17'
    }, {
        name: 'RRR',
        text: 'text18'
    }, {
        name: 'SSS',
        text: 'text19'
    }, {
        name: 'TTT',
        text: 'text20'
    }, {
        name: 'UUU',
        text: 'text21'
    }, {
        name: 'VVV',
        text: 'text22'
    }, {
        name: 'WWW',
        text: 'text23'
    }, {
        name: 'XXX',
        text: 'text24'
    }, {
        name: 'YYY',
        text: 'text25'
    }, {
        name: 'ZZZ',
        text: 'text26'
    }];

    var gridEventHandle = {
        _slFocusChanged: function (aOld: HTMLElement, aNew: HTMLElement) {
            aNew.innerText += 'focused'
        },
        _slItemSelected: function (aControl: Controls.CControl, aIndex: number, aEl: HTMLElement) {
            alert('index : ' + aIndex);
        }
    };

    var el = document.createElement("div");
    document.body.appendChild(el);
    var grid: Controls.CGridControl;
    grid = new Controls.CGridControl(el);
    grid.setId('root');
    grid.setListData(data);
    grid.setMaxColCount(4);
    grid.setItemWidth(90);
    grid.setItemHeight(90);
    grid.setAnimation(true);
    grid.connectFocusChanged(gridEventHandle, '_slFocusChanged', gridEventHandle._slFocusChanged);
    grid.connectItemSelected(gridEventHandle, '_slItemSelected', gridEventHandle._slItemSelected);
    grid.setDataDrawer(function (aKey: any, aItem: any, aEl: HTMLElement) {
        aEl.innerText = aKey + ': ' + aItem.name;
        return Controls.TFocusInfo.KFocusAble;
    });

    Controls.runRoot(grid);

    // grid.draw();
    // document.body.addEventListener('keydown', function (e) {
    //     var keyStr = e['keyIdentifier'];
    //     var handled = grid.doKey(keyStr);
    //     console.log(handled);
    //
    //     var skip = {
    //         'Up': true,
    //         'Down': true,
    //         'Left': true,
    //         'Right': true
    //     };
    //
    //     if (skip[keyStr]) {
    //         e.stopPropagation();
    //         e.preventDefault();
    //     }
    // });

}
