var gApp;
(function (gApp) {
    var focus = Controls.makeNoneFocusable("-focus-info");
    var data = [{
            type: 'txtSmall',
            text: 'Small text 1'
        }, {
            type: 'txtSmall',
            text: 'Small text 2'
        }, {
            type: 'txtSmall',
            text: 'Small text 3'
        }, {
            type: 'txtSmall',
            text: 'Small text 4'
        }, {
            type: 'txtSmall',
            text: 'Small text 5'
        }, {
            type: 'txtSmall',
            text: 'Small text 6'
        }, {
            type: 'txtSmall',
            text: 'Small text 7'
        }, {
            type: 'txtSmall',
            text: 'Small text 8'
        }, {
            type: 'txtSmall',
            text: 'Small text 9'
        }, {
            type: 'txtSmall',
            text: 'Small text 10'
        }, {
            type: 'txtSmall',
            text: 'Small text 11'
        }, {
            type: 'txtSmall',
            text: 'Small text 12'
        }];
    var dummy = {
        _slFocusedDataItemChanged: function (aKeyNew, aItemNew, aElNew, aKeyOld, aItemOld, aElOld) {
            var p = document.createElement("p");
            p.innerHTML = aItemNew.text;
            var focusInfo = focus.getElement();
            focusInfo.insertBefore(p, focusInfo.firstChild);
        },
        _slItemSelected: function (a, b, c) {
            debugger;
        }
    };
    var list;
    list = new Controls.CListControl(null);
    list.setListData(data);
    list.setItemHeight(70);
    list.setAnimation(true);
    list.setScrollScheme(Controls.TParamScrollScheme.EByFixed);
    list.connectFocusedDataItemChanged(dummy, "_slFocusedDataItemChanged", dummy._slFocusedDataItemChanged);
    list.connectItemSelected(dummy, "_slItemSelected", dummy._slItemSelected);
    list.setRedrawAfterOperation(true);
    list.setDataDrawer(function (aKey, aItem, aEl) {
        aEl.classList.add(aItem.type);
        aEl.style.opacity = '.5';
        aEl.innerText = aKey + ": " + aItem.text;
        return Controls.TFocusInfo.KFocusAble;
    });
    var root = new Controls.CLayoutGroupControl(document.body);
    root.setOrientation(Controls.TParamOrientation.EHorizontal);
    root.setOwnedChildControls([list, focus]);
    Controls.runRoot(root);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_listcontrol_vertical.js.map