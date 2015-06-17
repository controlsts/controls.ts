/// <reference path="../controls.ts"/>

module gApp {

    var focus = Controls.makeNoneFocusable("-focus-info");

    var data = [{
        type: 'txtSmall',
        text: 'Small text!'
    }];

    var dummy = {
        _slFocusedDataItemChanged: function (aKeyNew: any, aItemNew: any, aElNew: HTMLElement,
                                             aKeyOld: any, aItemOld: any, aElOld: HTMLElement) {
            var p = document.createElement("p");
            p.innerHTML = aItemNew.text;
            var focusInfo = focus.getElement();
            focusInfo.insertBefore(p, focusInfo.firstChild);
        },

        _slItemSelected: function (a, b, c) {
            debugger
        }
    };

    var list: Controls.CListControl;
    list = new Controls.CListControl(null);
    list.setListData(data);
    list.setItemHeight(50);
    list.setAnimation(true);
    list.connectFocusedDataItemChanged(dummy, "_slFocusedDataItemChanged", dummy._slFocusedDataItemChanged);
    list.connectItemSelected(dummy, "_slItemSelected", dummy._slItemSelected);
    list.setRedrawAfterOperation(true);
    list.setDataDrawer(function (aKey:any, aItem:any, aEl:HTMLElement) {
        aEl.classList.add(aItem.type);
        aEl.style.opacity = '.5';
        aEl.innerText = aKey + ": " + aItem.text;
        return Controls.TFocusInfo.KFocusAble;
    });

    var root = new Controls.CLayoutGroupControl(document.body);
    root.setOrientation(Controls.TParamOrientation.EHorizontal);
    root.setOwnedChildControls([list, focus]);
    root.draw();
    root.setActiveFocus();

    list.appendItem({
        type: 'txtSmall',
        text: 'Small 1 text!'
    });

    list.appendItem({
        type: 'txtSmall',
        text: 'Small 2 text@'
    });

    list.appendItem({
        type: 'txtSmall',
        text: 'Small 3 text@'
    });

    list.prependItem([{
        type: 'txtSmall',
        text: 'Prepended'
    }]);

    setTimeout(function () {
        list.prependItem({
            type: 'txtSmall',
            text: '1 sec'
        })
    }, 1000);

    setTimeout(function () {
        list.insertItem(3, {
            type: 'txtSmall',
            text: '2 sec'
        });
    }, 2000);

    setTimeout(function () {
        list.appendItem({
            type: 'txtSmall',
            text: '5 sec'
        })
    }, 5000);

    document.body.addEventListener('keydown', function (e) {
        var keyStr = e['keyIdentifier'];
        var handled = root.doKey(keyStr);
        console.log(handled);

        var skip = {
            'Up': true,
            'Down': true,
            'Left': true,
            'Right': true
        };

        if (skip[keyStr]) {
            e.stopPropagation();
            e.preventDefault();
        }
    });

}
