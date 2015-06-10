/// <reference path="../controls.ts"/>

module gApp {

    var focus = Controls.makeNoneFocusable("-focus-info");

    var data = [{
        type: 'txtSmall',
        text: 'Small text!'
    }];

    var dummy = {
        _slFocusChanged: function (aOld:HTMLElement, aNew:HTMLElement) {
            var p = document.createElement("p");
            p.innerHTML = "list focus changed";
            var focusInfo = focus.getElement();
            focusInfo.insertBefore(p, focusInfo.firstChild);
        },

        _slItemSelected: function (a, b, c) {
            debugger
        }
    };

    var list:Controls.CListControl;
    list = new Controls.CListControl(null);
    list.setListData(data);
    list.setItemHeight(50);
    list.setAnimation(true);
    list.connectFocusChanged(dummy, "_slFocusChanged", dummy._slFocusChanged);
    list.connectItemSelected(dummy, "_slItemSelected", dummy._slItemSelected);
    list.setRedrawAfterOperation(true);
    list.setDataDrawer(function (aKey:any, aItem:any, aEl:HTMLElement) {
        if (aItem.type == "txtSmall") {
            aEl.classList.add("txtSmall");
            aEl.style.opacity = '.5';
            aEl.innerText = aKey + ": " + aItem.text;
        }
        return Controls.TFocusInfo.KFocusAble;
    });

    var root = new Controls.CLayoutGroupControl(document.body);
    root.setOwnedChildControls([focus, list]);
    root.draw();
    root.setActiveFocus();

    list.appendItem({
        type: 'txtSmall',
        text: 'Small text!'
    });

    list.appendItems([{
        type: 'txtSmall',
        text: 'Small2 text@'
    }]);

    setTimeout(function () {
        list.prependItem({
            type: 'txtSmall',
            text: 'test'
        })
    }, 1000);

    setTimeout(function () {
        list.insertItem(3, {
            type: 'textSmall',
            text: 'timeout'
        });
    }, 2000);

    setTimeout(function () {
        list.appendItem({
            type: 'txtSmall',
            text: 'test2'
        })
    }, 5000);

    document.body.addEventListener('keydown', function (e) {
        var handled = root.doKey(e['keyIdentifier']);
        e.stopPropagation();
        e.preventDefault();
    });

}
