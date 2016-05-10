
/// <reference path="../controls.ts"/>

module gApp {
    var childControls: Controls.CControl[] = [];

    class EventHandlers {
        static _FocusStartToChange(aEl: HTMLElement, aItem: any, aIndex: number) {
            aEl.innerText = aItem + 'Moving...';
        }
        static _ItemSelected(aEl, aItem) {
            alert(aItem + ' Selected');
        }
        static _FocusChanged(aOld: HTMLElement, aNew: HTMLElement) {

        }
    }

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
    c1.setDataDrawer((aElement: HTMLElement, aItem: any, aIndex: number) => {
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
    c2.setDataDrawer((aElement: HTMLElement, aItem: any, aIndex: number) => {
        aElement.innerText = "Anim " + aItem;
    });
    c2.setAnimation(true);
//c2.setAnchorHeight(120);
//c2.setTransparentAnchor(true);
//c2.setAnimationInterval(0.2);
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
    c3.setDataDrawer((aElement: HTMLElement, aItem: any, aIndex: number) => {
        aElement.innerText = "Trans " + aItem;
    });
    c3.setAnimation(true);
//c3.setAnchorHeight(120);
    c3.setTransparentAnchor(true);
//c3.setAnimationInterval(0.2);
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

    // root.draw();
    // document.body.addEventListener('keydown', function (e) {
    //     var keyStr = e['keyIdentifier'];
    //     var handled = root.doKey(keyStr);
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
