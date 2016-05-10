var gApp;
(function (gApp) {
    var childControls = [];
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
    }());
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
    childControls.push(c1);
    var c2 = new Controls.CCarouselControl(null);
    c2.setData(data);
    c2.setViewCount(viewCount);
    c2.setItemWidth(itemWidth);
    c2.setItemHeight(itemHeight);
    c2.setAnchorIndex(3);
    c2.setDataDrawer(function (aElement, aItem, aIndex) {
        aElement.innerText = "Anim " + aItem;
    });
    c2.setAnimation(true);
    c2.setMaxKeyQueueCount(3);
    c2.setDrawEffect('spreadOut');
    c2.connectStartToChange(EventHandlers, "_FocusStartToChange", EventHandlers._FocusStartToChange);
    c2.connectItemSelected(EventHandlers, "_ItemSelected", EventHandlers._ItemSelected);
    c2.connectFocusChanged(EventHandlers, "_FocusChanged", EventHandlers._FocusChanged);
    childControls.push(c2);
    var c3 = new Controls.CCarouselControl(null);
    c3.setData(data);
    c3.setViewCount(viewCount);
    c3.setItemWidth(itemWidth);
    c3.setItemHeight(itemHeight);
    c3.setAnchorIndex(3);
    c3.setDataDrawer(function (aElement, aItem, aIndex) {
        aElement.innerText = "Trans " + aItem;
    });
    c3.setAnimation(true);
    c3.setTransparentAnchor(true);
    c3.setMaxKeyQueueCount(3);
    c3.setDrawEffect('spreadOut');
    c3.connectStartToChange(EventHandlers, "_FocusStartToChange", EventHandlers._FocusStartToChange);
    c3.connectItemSelected(EventHandlers, "_ItemSelected", EventHandlers._ItemSelected);
    c3.connectFocusChanged(EventHandlers, "_FocusChanged", EventHandlers._FocusChanged);
    childControls.push(c3);
    var root = new Controls.CLayoutGroupControl(document.body);
    root.setOrientation(Controls.TParamOrientation.EHorizontal);
    root.setOwnedChildControls(childControls);
    Controls.runRoot(root);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_carousel_vertical.js.map