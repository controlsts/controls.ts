/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var EventHandlers = (function () {
        function EventHandlers() {
        }
        EventHandlers._FocusStartToChange = function (aEl, aItem, aIndex) {
            aEl.innerText = aItem + 'Moving...';
        };
        EventHandlers._ItemSelected = function (aEl, aItem) {
            alert(aItem + ' Selected');
        };
        EventHandlers._FocusChanged = function (aOld, aNew) {
        };
        return EventHandlers;
    })();
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
    var c1 = new Controls.CCarouselControl(null);
    c1.setOrientation(2 /* EHorizontal */);
    c1.setData(data);
    c1.setViewCount(viewCount);
    c1.setItemWidth(itemWidth);
    c1.setItemHeight(itemHeight);
    c1.setAnchorIndex(3);
    c1.setDataDrawer(function (aElement, aItem, aIndex) {
        aElement.innerText = "Simple " + aItem;
    });
    c1.connectStartToChange(EventHandlers, "_FocusStartToChange", EventHandlers._FocusStartToChange);
    c1.connectItemSelected(EventHandlers, "_ItemSelected", EventHandlers._ItemSelected);
    c1.connectFocusChanged(EventHandlers, "_FocusChanged", EventHandlers._FocusChanged);
    var c2 = new Controls.CCarouselControl(null);
    c2.setOrientation(2 /* EHorizontal */);
    c2.setData(data);
    c2.setViewCount(viewCount);
    c2.setItemWidth(itemWidth);
    c2.setItemHeight(itemHeight);
    c2.setAnchorIndex(3);
    c2.setDataDrawer(function (aElement, aItem, aIndex) {
        aElement.innerText = "Anim " + aItem;
    });
    c2.setAnimation(true);
    //c2.setAnchorHeight(120);
    //c2.setTransparentAnchor(true);
    //c2.setAnimationInterval(0.2);
    c2.setMaxKeyQueueCount(3);
    c2.setDrawEfect('spreadOut');
    c2.connectStartToChange(EventHandlers, "_FocusStartToChange", EventHandlers._FocusStartToChange);
    c2.connectItemSelected(EventHandlers, "_ItemSelected", EventHandlers._ItemSelected);
    c2.connectFocusChanged(EventHandlers, "_FocusChanged", EventHandlers._FocusChanged);
    var c3 = new Controls.CCarouselControl(null);
    c3.setOrientation(2 /* EHorizontal */);
    c3.setData(data);
    c3.setViewCount(viewCount);
    c3.setItemWidth(itemWidth);
    c3.setItemHeight(itemHeight);
    c3.setAnchorIndex(3);
    c3.setDataDrawer(function (aElement, aItem, aIndex) {
        aElement.innerText = "Trans " + aItem;
    });
    c3.setAnimation(true);
    //c3.setAnchorHeight(120);
    c3.setTransparentAnchor(true);
    //c3.setAnimationInterval(0.2);
    c3.setMaxKeyQueueCount(3);
    c3.setDrawEfect('spreadOut');
    c3.connectStartToChange(EventHandlers, "_FocusStartToChange", EventHandlers._FocusStartToChange);
    c3.connectItemSelected(EventHandlers, "_ItemSelected", EventHandlers._ItemSelected);
    c3.connectFocusChanged(EventHandlers, "_FocusChanged", EventHandlers._FocusChanged);
    var root = new Controls.CLayoutGroupControl(document.body);
    root.setOrientation(1 /* EVertical */);
    root.setOwnedChildControls([c1, c2, c3]);
    root.draw();
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
})(gApp || (gApp = {}));
//# sourceMappingURL=test_carousel_horizontal.js.map