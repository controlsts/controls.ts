// Module

module Controls {

    var KClassControl = "-c";
    var KClassGroupControl = "-g";
    var KClassFocusable = "-f";
    var KClassFocused = "-fd";
    var KClassActiveFocused = "-afd";
    var KClassActiveFocusedLeaf = "-afd-leaf";

    var KCssPropTransition = 'transition';
    var KCssEventTransitionEnd = 'transitionend';
    var KCssTransitionDuration = 'transition-duration';

    export var TClassStr = {
        KClassControl: KClassControl,
        KClassGroupControl: KClassGroupControl,
        KClassFocusable: KClassFocusable,
        KClassFocused: KClassFocused,
        KClassActiveFocused: KClassActiveFocused,
        KClassActiveFocusedLeaf: KClassActiveFocusedLeaf
    };

    export var TTransitionStr = {
        KCssPropTransition: KCssPropTransition,
        KCssEventTransitionEnd: KCssEventTransitionEnd,
        KCssTransitionDuration: KCssTransitionDuration
    };

    var browser = (function () {
        var N = navigator.appName, ua = navigator.userAgent, tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        return M;
    } ());

    if (browser[0] == "chrome") {
        KCssPropTransition = '-webkit-transition';
        KCssEventTransitionEnd = 'webkitTransitionEnd';
        KCssTransitionDuration = '-webkit-transition-duration';
    } else if (browser[0] == "opera") {
        KCssPropTransition = '-o-transition';
        KCssEventTransitionEnd = 'oTransitionEnd otransitionend';
        KCssTransitionDuration = '-o-transition-duration';
    } else if (browser[0] == "msie") {
        KCssPropTransition = '-ms-transition';
        KCssEventTransitionEnd = 'msTransitionEnd mstransitionend';
        KCssTransitionDuration = '-ms-transition-duration';
    }

    var KCssTransitionParamPos = 'top .3s linear, left .3s linear';
    var KCssTransitionParamOpa = 'opacity .3s linear';

// DOM helper
    class Util {
        static afterTransition(aElement: HTMLElement, aCallBack: Function) {
            var durations = ['0'];
            if (getComputedStyle) {
                if (getComputedStyle(aElement).transitionDuration) {
                    durations = getComputedStyle(aElement).transitionDuration.split(',');
                }
            } else {
                durations = aElement.style.transitionDuration.split(',');
            }

            var delay = parseFloat(durations[0].replace('s', '')) * 1000 || 300;
            if (delay) {
                setTimeout(aCallBack, delay);
            } else {
                throw "Invalid transition duration";
            }
        }

        static remove(aElement: HTMLElement) {
            var parent = aElement.parentElement;
            if (parent) {
                parent.removeChild(aElement);
            } else {
                throw "Element has no parent";
            }
        }

        static prepend(aElement: HTMLElement, aNewChild: HTMLElement) {
            aElement.insertBefore(aNewChild, aElement.firstElementChild);
        }

        static getRect(aElement: HTMLElement): TRect {
            return new TRect({
                top: aElement.offsetTop,
                left: aElement.offsetLeft,
                right: aElement.offsetLeft + aElement.offsetWidth,
                bottom: aElement.offsetTop + aElement.offsetHeight
            });
        }
    }

    var KKeyStrUp = "Up";
    var KKeyStrDown = "Down";
    var KKeyStrLeft = "Left";
    var KKeyStrRight = "Right";
    var KKeyStrEnter = "Enter";
    var KKeyStrPageUp = "PageUp";
    var KKeyStrPageDown = "PageDown";
    var KKeyStrBack = "Back";
    var KKeyStrEscape = "Escape";

    export var TKeyStr = {
        KKeyStrUp: KKeyStrUp,
        KKeyStrDown: KKeyStrDown,
        KKeyStrLeft: KKeyStrLeft,
        KKeyStrRight: KKeyStrRight,
        KKeyStrEnter: KKeyStrEnter,
        KKeyStrPageUp: KKeyStrPageUp,
        KKeyStrPageDown: KKeyStrPageDown,
        KKeyStrBack: KKeyStrBack,
        KKeyStrEscape: KKeyStrEscape
    };

    export interface TKeyMapItem {
        el: HTMLElement;
        l?: number;
        r?: number;
        u?: number;
        d?: number;
    }

    export interface FFocusChanged {
        (aOld: HTMLElement, aNew: HTMLElement): void;
    }

    export class CKeyMap {
        private _index: number = -1;
        private _map: TKeyMapItem[] = [];
        private _endL: number;
        private _endR: number;
        private _endU: number;
        private _endD: number;
        private _focusChanged: FFocusChanged;
        private _activeFocusClass: string;
        constructor(aFocusChanged: FFocusChanged, aActiveFocusClass: string) {
            this._focusChanged = aFocusChanged;
            this._activeFocusClass = aActiveFocusClass;
        }
        destroy() {
            this._map = null;
        }
        addMapItem(aMapItem: TKeyMapItem) {
            this._map.push(aMapItem);
        }
        getMapItem(aIndex: number) {
            return this._map[aIndex];
        }
        setActiveFocus(aIndex: number) {
            this._index = aIndex;
        }
        getFocusedElement(): HTMLElement {
            return this._map[this._index].el;
        }
        getFocusedIndex(): number {
            return this._index;
        }
        getMapCount(): number {
            return this._map.length;
        }
        getIndex(aElement: HTMLElement): number {
            var index = -1;
            var i, len, item: TKeyMapItem;
            for (i = 0, len = this._map.length; i < len; i++) {
                item = this._map[i];
                if (item.el == aElement) {
                    index = i;
                    break;
                }
            }
            return index;
        }
        changeFocus(aNewIndex: number) {
            var oldMapItem: TKeyMapItem = this._map[this._index];
            var newMapItem: TKeyMapItem = this._map[aNewIndex];
            var oldEl: HTMLElement = oldMapItem.el;
            var newEl: HTMLElement = newMapItem.el;
            oldEl.classList.remove(KClassFocused);
            newEl.classList.add(KClassFocused);
            if (oldEl.classList.contains(this._activeFocusClass)) {
                oldEl.classList.remove(this._activeFocusClass);
                newEl.classList.add(this._activeFocusClass);
            }
            this._focusChanged(oldEl, newEl);
            this._index = aNewIndex;
        }
        doKey(aKeyStr: string): boolean {
            var handlers: { [keyStr: string]: Function; } = {};
            var oldMapItem: TKeyMapItem = this._map[this._index];
            var newIndex;
            handlers[KKeyStrUp] = function () {
                newIndex = oldMapItem.u;
            };
            handlers[KKeyStrDown] = function () {
                newIndex = oldMapItem.d;
            };
            handlers[KKeyStrLeft] = function () {
                newIndex = oldMapItem.l;
            };
            handlers[KKeyStrRight] = function () {
                newIndex = oldMapItem.r;
            };

            if (handlers[aKeyStr]) {
                handlers[aKeyStr]();
                if (newIndex !== undefined) {
                    this.changeFocus(newIndex);
                    return true;
                }
            }
            return false;
        }
    }

    export interface TPrevFocusInfo {
        rect: TRect;
        activeFocus: boolean;
        prevFocusedEl: HTMLElement;
    }

    export interface FKeyMapBuilder {
        (aKeyMap: CKeyMap, aFocusable: HTMLElement[], aPrevFocusInfo?: TPrevFocusInfo, aPrevKeyStr?: string): void;
    }

    export var KBuilderTopDown: FKeyMapBuilder = function (
        aKeyMap: CKeyMap,
        aFocusable: HTMLElement[],
        aPrevFocusInfo?: TPrevFocusInfo,
        aPrevKeyStr?: string
        ) {
        var i, len, el: HTMLElement, mapItem: TKeyMapItem, prevMapItem: TKeyMapItem = null;
        var startIndex: number = 0;
        for (i = 0, len = aFocusable.length; i < len; i++) {
            el = aFocusable[i];
            mapItem = {
                el: el
            };
            if (i && prevMapItem) {
                if (el.classList.contains(KClassFocused)) {
                    startIndex = i;
                }
                prevMapItem.d = i;
                mapItem.u = i - 1;
            }
            aKeyMap.addMapItem(mapItem);
            prevMapItem = mapItem;
        }
        aFocusable[startIndex].classList.add(KClassFocused);
        aKeyMap.setActiveFocus(startIndex);

        // next focusing
        if (this._parent) {
            if (!this._parent.isFocused()) {
                return;
            }
        }
        var scrollingScheme = this._getDrawParam(KParamStrScrollSchemeVertical);
        if (aPrevKeyStr) {
            if (scrollingScheme === TParamScrollScheme.EByFocusRemains) {
                if (aPrevFocusInfo) {
                    aPrevFocusInfo.prevFocusedEl.classList.remove(KClassActiveFocusedLeaf);
                    aFocusable[startIndex].classList.add(KClassActiveFocusedLeaf);
                }
            } else {
                aKeyMap.doKey(aPrevKeyStr);
            }
        }
    };

    export var KBuilderLeftRight: FKeyMapBuilder = function (
        aKeyMap: CKeyMap,
        aFocusable: HTMLElement[],
        aPrevFocusInfo?: TPrevFocusInfo,
        aPrevKeyStr?: string
        ) {
        var i, j, len, el: HTMLElement, mapItem: TKeyMapItem, prevMapItem: TKeyMapItem = null;
        var startIndex: number = 0;
        for (i = 0, len = aFocusable.length; i < len; i++) {
            el = aFocusable[i];
            mapItem = {
                el: el
            };
            if (i && prevMapItem) {
                if (el.classList.contains(KClassFocused)) {
                    startIndex = i;
                }
                prevMapItem.r = i;
                mapItem.l = i - 1;
            }
            aKeyMap.addMapItem(mapItem);
            prevMapItem = mapItem;
        }
        aFocusable[startIndex].classList.add(KClassFocused);
        aKeyMap.setActiveFocus(startIndex);

        // next focusing
        if (this._parent) {
            if (!this._parent.isFocused()) {
                return;
            }
        }
        var scrollingScheme = this._getDrawParam(KParamStrScrollSchemeVertical);
        if (aPrevKeyStr) {
            if (scrollingScheme === TParamScrollScheme.EByFocusRemains) {
                if (aPrevFocusInfo) {
                    aPrevFocusInfo.prevFocusedEl.classList.remove(KClassActiveFocusedLeaf);
                    aFocusable[startIndex].classList.add(KClassActiveFocusedLeaf);
                }
            } else {
                aKeyMap.doKey(aPrevKeyStr);
            }
        }
    };

    export var KBuilderGrid: FKeyMapBuilder = function (
        aKeyMap: CKeyMap,
        aFocusable: HTMLElement[],
        aPrevFocusInfo?: TPrevFocusInfo,
        aPrevKeyStr?: string
        ) {
        var i, j, len;
        var el: HTMLElement;
        var mapItem: TKeyMapItem;
        var prevMapItem: TKeyMapItem = null;
        var aboveMapItem: TKeyMapItem = null;
        var startIndex: number = 0;
        var rowCount: number = 0;
        var colCount: number = 0;
        var posY: number = -1;
        for (i = 0, len = aFocusable.length; i < len; i++) {
            el = aFocusable[i];
            mapItem = {
                el: el
            };
            if (el.classList.contains(KClassFocused)) {
                startIndex = i;
            }
            if (i === 0) {
                aKeyMap.addMapItem(mapItem);
                posY = el.offsetTop;
                continue;
            }
            if (posY === el.offsetTop) {
                prevMapItem = aKeyMap.getMapItem(i - 1);
                prevMapItem.r = i;
                mapItem.l = i - 1;
            } else {
                posY = el.offsetTop;
                if (!colCount) {
                    colCount = i;
                }
                rowCount++;
            }
            if (rowCount) {
                aboveMapItem = aKeyMap.getMapItem(i - colCount);
                aboveMapItem.d = i;
                mapItem.u = i - colCount;
            }
            aKeyMap.addMapItem(mapItem);
        }
        aFocusable[startIndex].classList.add(KClassFocused);
        aKeyMap.setActiveFocus(startIndex);
        if (aPrevKeyStr) {
            aKeyMap.doKey(aPrevKeyStr);
        }
    };

    export var KBuilderWeightDistance: FKeyMapBuilder = function (
        aKeyMap: CKeyMap,
        aFocusable: HTMLElement[],
        aPrevFocusInfo?: TPrevFocusInfo,
        aPrevKeyStr?: string
        ) {
        var i, j, cnt: number = aFocusable.length, el: HTMLElement;
        var getPos = function (aElement: HTMLElement) {
            var top = aElement.offsetTop;
            var left = aElement.offsetLeft;
            var width = aElement.offsetWidth;
            var height = aElement.offsetHeight;
            var bottom = top + height;
            var right = left + width;

            var topMiddle = top + (height / 2);
            var leftMiddle = left + (width / 2);

            return {
                top: { x: leftMiddle, y: top },
                right: { x: right, y: topMiddle },
                bottom: { x: leftMiddle, y: bottom },
                left: { x: left, y: topMiddle },
                x: leftMiddle,
                y: topMiddle
            };
        };
        var getPosByRect = function (aRect: TRect) {
            var top = aRect.top;
            var left = aRect.left;
            var right = aRect.right;
            var bottom = aRect.bottom;
            var width = aRect.getWidth();
            var height = aRect.getHeight();

            var topMiddle = top + (height / 2);
            var leftMiddle = left + (width / 2);

            return {
                top: { x: leftMiddle, y: top },
                right: { x: right, y: topMiddle },
                bottom: { x: leftMiddle, y: bottom },
                left: { x: left, y: topMiddle },
                x: leftMiddle,
                y: topMiddle
            };
        };
        var startIndex = 0;
        var rectInfoList = [];
        for (i = 0; i < cnt; i++) {
            el = aFocusable[i];
            if (el.classList.contains(KClassFocused)) {
                startIndex = i;
            }
            rectInfoList.push(getPos(el));
        }
        var distanceLeft = function (me, some, findArea) {
            var me = me;
            var some = some;
            var distance;
            if (me != some) {
                if (me.top.y < some.right.y && me.bottom.y > some.right.y) {
                    if (me != some) {
                        if (me.right.x >= some.right.x) {
                            distance = Math.abs(me.left.x - some.right.x);
                            return distance;
                        }
                    }
                }
            }
            return Number.MAX_VALUE;
        };
        var distanceRight = function (me, some, findArea) {
            var me = me;
            var some = some;
            var distance;
            if (me != some) {
                if (me.top.y < some.left.y && me.bottom.y > some.left.y) {
                    if (me != some) {
                        if (me.left.x <= some.left.x) {
                            distance = Math.abs(me.right.x - some.left.x);
                            return distance;
                        }
                    }
                }
            }
            return Number.MAX_VALUE;
        };
        var distanceTop = function (me, some, findArea) {
            var me = me;
            var some = some;
            var distance;
            if (me != some) {
                if (me.top.y >= some.bottom.y && me.top.y - findArea <= some.bottom.y) {
                    distance = weightDistance(me, some, 1);
                    return distance;
                }
            }
            return Number.MAX_VALUE;
        };
        var distanceBottom = function (me, some, findArea) {
            var me = me;
            var some = some;
            var distance;
            if (me != some) {
                if (me.bottom.y <= some.top.y && me.bottom.y + findArea >= some.top.y) {
                    distance = weightDistance(me, some, 1);
                    return distance;
                }
            }
            return Number.MAX_VALUE;
        };
        var weightDistance = function (me, some, xWeight) {
            var me = me;
            var some = some;
            var xWeight = xWeight;
            var yWeight = 10 - xWeight;
            var distance;
            distance = Math.sqrt(Math.pow(me.x - some.x, 2) / yWeight + Math.pow(me.y - some.y, 2) / xWeight);

            return distance;
        };

        var fillKeyMapItem = function (aKeyMapItem, aSourcePosData) {
            var valNearestLeft = Number.MAX_VALUE;
            var idxNearestLeft = -1;
            var valNearestRight = Number.MAX_VALUE;
            var idxNearestRight = -1;
            var valNearestTop = Number.MAX_VALUE;
            var idxNearestTop = -1;
            var valNearestBot = Number.MAX_VALUE;
            var idxNearestBot = -1;

            var findArea = 46;

            for (j = 0; j < cnt; j++) {
                var some = rectInfoList[j];
                var resultTopVal = distanceTop(aSourcePosData, some, findArea);
                var resultLeftVal = distanceLeft(aSourcePosData, some, findArea);
                var resultBottomVal = distanceBottom(aSourcePosData, some, findArea);
                var resultRightVal = distanceRight(aSourcePosData, some, findArea);

                if (valNearestTop > resultTopVal) {
                    valNearestTop = resultTopVal;
                    idxNearestTop = j;
                }
                if (valNearestLeft > resultLeftVal) {
                    valNearestLeft = resultLeftVal;
                    idxNearestLeft = j;
                }
                if (valNearestBot > resultBottomVal) {
                    valNearestBot = resultBottomVal;
                    idxNearestBot = j;
                }
                if (valNearestRight > resultRightVal) {
                    valNearestRight = resultRightVal;
                    idxNearestRight = j;
                }
            }
            //result
            if (!aKeyMapItem.l && idxNearestLeft != -1) {
                aKeyMapItem.l = idxNearestLeft;
            }
            if (!aKeyMapItem.r && idxNearestRight != -1) {
                aKeyMapItem.r = idxNearestRight;
            }
            if (!aKeyMapItem.u && idxNearestTop != -1) {
                aKeyMapItem.u = idxNearestTop;
            }
            if (!aKeyMapItem.d && idxNearestBot != -1) {
                aKeyMapItem.d = idxNearestBot;
            }
        };
        var fillKeyMapItemAndReturnNearestIndex = function (aKeyMapItem, aSourcePosData) {
            var valNearestLeft = Number.MAX_VALUE;
            var idxNearestLeft = -1;
            var valNearestRight = Number.MAX_VALUE;
            var idxNearestRight = -1;
            var valNearestTop = Number.MAX_VALUE;
            var idxNearestTop = -1;
            var valNearestBot = Number.MAX_VALUE;
            var idxNearestBot = -1;
            var valNearest = Number.MAX_VALUE;
            var idxNearest = -1;

            var findArea = 46;

            for (j = 0; j < cnt; j++) {
                var some = rectInfoList[j];
                var resultTopVal = distanceTop(aSourcePosData, some, findArea);
                var resultLeftVal = distanceLeft(aSourcePosData, some, findArea);
                var resultBottomVal = distanceBottom(aSourcePosData, some, findArea);
                var resultRightVal = distanceRight(aSourcePosData, some, findArea);

                if (valNearestTop > resultTopVal) {
                    valNearestTop = resultTopVal;
                    idxNearestTop = j;
                }
                if (valNearestLeft > resultLeftVal) {
                    valNearestLeft = resultLeftVal;
                    idxNearestLeft = j;
                    if (resultLeftVal < valNearest) {
                        valNearest = resultLeftVal;
                        idxNearest = j;
                    }
                }
                if (valNearestBot > resultBottomVal) {
                    valNearestBot = resultBottomVal;
                    idxNearestBot = j;
                }
                if (valNearestRight > resultRightVal) {
                    valNearestRight = resultRightVal;
                    idxNearestRight = j;
                    if (resultRightVal < valNearest) {
                        valNearest = resultRightVal;
                        idxNearest = j;
                    }
                }
            }
            //result
            if (!aKeyMapItem.l && idxNearestLeft != -1) {
                aKeyMapItem.l = idxNearestLeft;
            }
            if (!aKeyMapItem.r && idxNearestRight != -1) {
                aKeyMapItem.r = idxNearestRight;
            }
            if (!aKeyMapItem.u && idxNearestTop != -1) {
                aKeyMapItem.u = idxNearestTop;
            }
            if (!aKeyMapItem.d && idxNearestBot != -1) {
                aKeyMapItem.d = idxNearestBot;
            }
            return idxNearest;
        };
        for (i = 0; i < cnt; i++) {
            el = aFocusable[i];
            var item: TKeyMapItem = {
                el: el
            };
            var me = rectInfoList[i];
            fillKeyMapItem(item, me);
            aKeyMap.addMapItem(item);
        }
        aKeyMap.setActiveFocus(startIndex);
        if (aPrevFocusInfo) {
            var prevPosData = getPosByRect(aPrevFocusInfo.rect);
            var item: TKeyMapItem = {
                el: null
            };
            var nearestIndex = fillKeyMapItemAndReturnNearestIndex(item, prevPosData);
            if (aPrevKeyStr) {
                aKeyMap.doKey(aPrevKeyStr);
            }
            if (aPrevFocusInfo.activeFocus) {
                aKeyMap.getFocusedElement().classList.add(KClassActiveFocusedLeaf);
            }
        }
        /*
         aFocusable[startIndex].classList.add(KClassFocused);
         aKeyMap.setActiveFocus(startIndex);
         if (this._parent) {
         if (!this._parent.isFocused()) {
         return;
         }
         }
         if (aPrevFocused) {
         aFocusable[startIndex].classList.add(KClassActiveFocusedLeaf);
         }
         */
    }

    interface TSignalHandlerInfo {
        holder: any;
        slotName: string;
    }
    export class CSignalSource {
        private _signalTypes: { [signalName: string]: TSignalHandlerInfo[]; } = {};
        constructor() {
        }
        destroy() {
            this._signalTypes = null;
        }
        registerSignal(aSignalList: string[]) {
            var i, len, signalName: string;
            for (i = 0, len = aSignalList.length; i < len; i++) {
                signalName = aSignalList[i];
                if (this._signalTypes[signalName]) {
                    throw "Event [" + signalName + "] already exists";
                }

                this._signalTypes[signalName] = [];
            }
        }
        connect(aSignalName: string, aHolder: any, aSlotName: string) {

            if (!(aHolder[aSlotName] instanceof Function)) {
                throw "holder does not have the slot";
            }

            var signalHandlers: TSignalHandlerInfo[];
            var signalHandler: TSignalHandlerInfo;
            signalHandlers = this._signalTypes[aSignalName];
            var i, len;
            for (i = 0, len = signalHandlers.length; i < len; i++) {
                signalHandler = signalHandlers[i];
                if (signalHandler.holder == aHolder) {
                    signalHandler.slotName = aSlotName;
                    return;
                }
            }
            signalHandlers.push({
                holder: aHolder,
                slotName: aSlotName
            });
        }
        disconnect(aHolder: {}) {
            var signalName: string;
            var signalHandlers: TSignalHandlerInfo[];
            var signalHandler: TSignalHandlerInfo;
            var i;
            for (signalName in this._signalTypes) {
                if (this._signalTypes.hasOwnProperty(signalName)) {
                    signalHandlers = this._signalTypes[signalName];
                    for (i = signalHandlers.length - 1; i >= 0; i--) {
                        signalHandler = signalHandlers[i];
                        if (signalHandler.holder == aHolder) {
                            signalHandlers.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        }
        emit(...args: any[]) {
            var signalName: string;
            var i, len, handlerInfoList: TSignalHandlerInfo[], handlerInfo: TSignalHandlerInfo;
            var holder;
            signalName = args.shift();
            handlerInfoList = this._signalTypes[signalName];
            for (i = 0, len = handlerInfoList.length; i < len; i++) {
                handlerInfo = handlerInfoList[i];
                handlerInfo.holder[handlerInfo.slotName].apply(handlerInfo.holder, args);
            }
        }
    }

    export enum TFocusInfo {
        KFocusUnknown,
        KFocusNone,
        KFocusAble,
        KFocused
    }

    var KParamStrScrollSchemeVertical = "scrollingSchemeVertical";
    var KParamStrScrollSchemeHorizontal = "scrollingSchemeHorizontal";
    var KParamStrScrollSchemeFixedUnitVertical = "scrollingSchemeFixedUnitVertical";
    var KParamStrScrollSchemeFixedUnitHorizontal = "scrollingSchemeFixedUnitHorizontal";
    export enum TParamScrollScheme {
        EUnknown,
        EByItem,
        EByPage,
        EByFocusRemains,
        EByFocusRemainsRolling,
        EByFixed
    }

    var KParamStrOrientation = "orientation";
    export enum TParamOrientation {
        EUnknown,
        EVertical,
        EHorizontal
    }
    var KParamStrItemHeight = "itemHeight";
    var KParamStrItemWidth = "itemWidth";
    var KParamStrMaxColCount = "maxColCount";
    var KParamStrMargin = "margin";
    var KParamStrViewCount = "viewCount";
    var KParamStrAnchorIndex = "anchorIndex";
    var KParamStrAnchorHeight = "anchorHeight";
    var KParamStrAnchorWidth = "anchorWidth";
    var KParamStrStartIndex = "startIndex";
    var KParamStrMaxKeyQueueCount = "maxKeyQueueCount";
    var KParamStrTransparentAnchor = "transparentAnchor";
    var KParamStrDrawEffect = "drawEffect";

    export interface TMargin {
        t: number;
        l: number;
        r: number;
        b: number;
    }
    var KParamStrPadding = "padding";
    var KParamStrChildVAlign = "childVAlign";
    export enum TParamVAlign {
        EUnkown,
        ETop,
        ECenter,
        EBottom,
    }
    var KParamStrChildHAlign = "childHAlign";
    export enum TParamHAlign {
        EUnkown,
        ELeft,
        ECenter,
        ERight,
    }
    var KParamAnimation = "animation";
    var KParamUserAnimationCSS = "userAnimationCSS";
    var KParamAnimationInterval = "animationInterval";
    var KParamKeepFocus = "keepFocus";
    /* -- DEPRECATED
     private KParamStrReDrawByKey = "reDrawByKey";
     interface TReDrawHintByKey {
     keyStr: string;
     prevFocusedRect: TRect;
     }
     */

    export interface FFocusGained {
        (aControl: CControl): void;
    }
    export interface FFocusLost {
        (aControl: CControl): void;
    }
    export interface FItemSelected {
        (aControl: CControl, aIndex: number, aEl: HTMLElement): void;
    }
    export interface FItemInserted {
        (aDrawnElements: CDrawnElements, aNeedFocus?: boolean): void;
    }
    export interface FItemRemoved {
        (aDrawnElements: CDrawnElements, aUnsetFocus?: boolean): void;
    }

    export interface TSize {
        width: number;
        height: number;
    }

    export class TRect {
        top: number = 0;
        left: number = 0;
        right: number = 0;
        bottom: number = 0;
        centerX: number;
        centerY: number;
        constructor(aParam?: { top: number; left: number; right: number; bottom: number; }) {
            if (aParam) {
                this.top = aParam.top;
                this.left = aParam.left;
                this.right = aParam.right;
                this.bottom = aParam.bottom;
            }
        }
        getHeight(): number {
            return this.bottom - this.top;
        }
        getWidth(): number {
            return this.right - this.left;
        }
        getCenterX(): number {
            return this.left + Math.floor(this.getWidth() / 2);
        }
        getCenterY(): number {
            return this.top + Math.floor(this.getHeight() / 2);
        }
        hasSize(): boolean {
            return this.getHeight() > 0 || this.getWidth() > 0;
        }
        setHeight(aHeight: number) {
            this.bottom = this.top + aHeight;
        }
        setWidth(aWidth: number) {
            this.right = this.left + aWidth;
        }
        moveTop(aIncrement: number) {
            this.top += aIncrement;
            this.bottom += aIncrement;
        }
        moveLeft(aIncrement: number) {
            this.left += aIncrement;
            this.right += aIncrement;
        }
        getIntersectedRect(aRect: TRect): TRect {
            var ret: TRect = new TRect;
            var x0 = Math.max(this.left, aRect.left);
            var x1 = Math.min(this.right, aRect.right);

            if (x0 <= x1) {
                var y0 = Math.max(this.top, aRect.top);
                var y1 = Math.min(this.bottom, aRect.bottom);

                if (y0 <= y1) {
                    ret.left = x0;
                    ret.top = y0;
                    ret.right = x1;
                    ret.bottom = y1;
                    return ret;
                }
            }
            return null;
        }
    }

    export interface TContentAvail {
        up?: number;
        down?: number;
        left?: number;
        right?: number;
    }

    export class CControl extends CSignalSource {

        // Constructor & destructor
        _element: HTMLElement;
        _keyMap: CKeyMap;
        _root: boolean = false;
        _group: boolean = false;
        _parent: CControl;

        constructor(aElement: HTMLElement, className?: string) {
            super();
            this._element = aElement || document.createElement("div");
            this._element.style.position = "absolute";
            this._element.classList.add(className || KClassControl);
            this.registerSignal(["FocusChanged", "FocusGained", "FocusLost", "ItemSelected", "RedrawRequired"]);
        }

        destroy() {
            super.destroy();
            if (this._element) {
                Util.remove(this._element);
                this._element = null;
            }
        }

        getElement(): HTMLElement {
            return this._element;
        }

        setParent(aParentControl: CControl) {
            this._parent = aParentControl;
        }

        // Draw param
        private _drawParam: { [key: string]: any; } = {};
        private _drawParamVolitile: { [key: string]: any; } = {};
        _setDrawParam(aParamName: string, aValue: any, aVolitile: boolean) {
            if (aVolitile) {
                this._drawParamVolitile[aParamName] = aValue;
            } else {
                this._drawParam[aParamName] = aValue;
            }
        }
        _getDrawParam(aParamName: string): any {
            var ret = this._drawParamVolitile[aParamName];
            if (ret == null) {
                ret = this._drawParam[aParamName];
            }
            return ret;
        }
        private _prepareParam() {
            var ret: { [key: string]: any; } = {};
            var key: string;
            for (key in this._drawParam) {
                if (this._drawParam.hasOwnProperty(key)) {
                    ret[key] = this._drawParam[key];
                }
            }
            for (key in this._drawParamVolitile) {
                if (this._drawParamVolitile.hasOwnProperty(key)) {
                    ret[key] = this._drawParamVolitile[key];
                }
            }
            return ret;
        }
        private _clearVolitile() {
            this._drawParamVolitile = {};
        }
        // Orientation
        setOrientation(aLayout: TParamOrientation) {
            this._setDrawParam(KParamStrOrientation, aLayout, false);
        }
        getOrientation(): TParamOrientation {
            var ret = TParamOrientation.EUnknown;
            var value = this._getDrawParam(KParamStrOrientation);
            if (value) {
                ret = value;
            }
            return ret;
        }
        // Item info
        setItemHeight(aItemHeight: number) {
            this._setDrawParam(KParamStrItemHeight, aItemHeight, false);
        }
        getItemHeight(): number {
            return this._getDrawParam(KParamStrItemHeight) || 0;
        }
        setItemWidth(aItemWidth: number) {
            this._setDrawParam(KParamStrItemWidth, aItemWidth, false);
        }
        getItemWidth(): number {
            return this._getDrawParam(KParamStrItemWidth) || 0;
        }
        setMaxColCount(aMaxColCount: number) {
            this._setDrawParam(KParamStrMaxColCount, aMaxColCount, false);
        }
        getMaxColCount(): number {
            return this._getDrawParam(KParamStrMaxColCount) || false;
        }
        // Margin
        setMargins(aMargins: number[]) {
            this._setDrawParam(KParamStrMargin, aMargins, false);
        }
        getMargins(): TMargin {
            var margins = this._getDrawParam(KParamStrMargin);
            var ret: TMargin = {
                t: 0,
                r: 0,
                b: 0,
                l: 0
            }, i;
            if (margins && margins.length) {
                ret.t = margins[0];
                ret.r = margins[1] || ret.t;
                ret.b = margins[2] || ret.t;
                ret.l = margins[3] || ret.r;
            }
            return ret;
        }
        // Padding
        setPadding(aPadding: number) {
            this._setDrawParam(KParamStrPadding, aPadding, false);
        }
        getPadding(): number {
            return this._getDrawParam(KParamStrPadding) || 0;
        }
        // Child align
        setChildVAlign(aChildVAlign: TParamVAlign) {
            this._setDrawParam(KParamStrChildVAlign, aChildVAlign, false);
        }
        getChildVAlign(): TParamVAlign {
            return this._getDrawParam(KParamStrChildVAlign) || 0;
        }
        setChildHAlign(aChildHAlign: TParamHAlign) {
            this._setDrawParam(KParamStrChildHAlign, aChildHAlign, false);
        }
        getChildHAlign(): TParamHAlign {
            return this._getDrawParam(KParamStrChildHAlign) || 0;
        }
        // Animaion
        setAnimation(aAnimation: boolean) {
            this._setDrawParam(KParamAnimation, aAnimation, false);
        }
        getAnimation(): boolean {
            return this._getDrawParam(KParamAnimation) || false;
        }
        // User Animation CSS
        setUseUserAnimationCSS(aAnimation: boolean) {
            this._setDrawParam(KParamUserAnimationCSS, aAnimation, false);
        }
        getUseUserAnimationCSS(): boolean {
            return this._getDrawParam(KParamUserAnimationCSS) || false;
        }
        // AnimationInterval
        setAnimationInterval(aAnimationInterval: number) {
            this._setDrawParam(KParamAnimationInterval, aAnimationInterval, false);
        }
        getAnimationInterval(): number {
            return this._getDrawParam(KParamAnimationInterval) || 0;
        }
        // ViewCount
        setViewCount(aViewCount: number) {
            this._setDrawParam(KParamStrViewCount, aViewCount, false);
        }
        getViewCount(): number {
            return this._getDrawParam(KParamStrViewCount) || 0;
        }
        // AnchorIndex
        setAnchorIndex(aAnchorIndex: number) {
            this._setDrawParam(KParamStrAnchorIndex, aAnchorIndex, false);
        }
        getAnchorIndex(): number {
            return this._getDrawParam(KParamStrAnchorIndex) || 0;
        }
        // AnchorHeight
        setAnchorHeight(aAnchorHeight: number) {
            this._setDrawParam(KParamStrAnchorHeight, aAnchorHeight, false);
        }
        getAnchorHeight(): number {
            return this._getDrawParam(KParamStrAnchorHeight) || 0;
        }
        // AnchorWidth
        setAnchorWidth(aAnchorWidth: number) {
            this._setDrawParam(KParamStrAnchorWidth, aAnchorWidth, false);
        }
        getAnchorWidth(): number {
            return this._getDrawParam(KParamStrAnchorWidth) || 0;
        }
        // StartIndex
        setStartIndex(aStartIndex: number) {
            this._setDrawParam(KParamStrStartIndex, aStartIndex, false);
        }
        getStartIndex(): number {
            return this._getDrawParam(KParamStrStartIndex) || 0;
        }
        // MaxKeyQueueCount
        setMaxKeyQueueCount(aMaxKeyQueueCount: number) {
            this._setDrawParam(KParamStrMaxKeyQueueCount, aMaxKeyQueueCount, false);
        }
        getMaxKeyQueueCount(): number {
            return this._getDrawParam(KParamStrMaxKeyQueueCount) || 0;
        }
        // TransparentAnchor
        setTransparentAnchor(aTransparentAnchor: boolean) {
            this._setDrawParam(KParamStrTransparentAnchor, aTransparentAnchor, false);
        }
        getTransparentAnchor(): boolean {
            return this._getDrawParam(KParamStrTransparentAnchor) || false;
        }
        // DrawEfect
        setDrawEfect(aDrawEfect: string) {
            this._setDrawParam(KParamStrDrawEffect, aDrawEfect, true);
        }
        getDrawEfect(): string {
            return this._getDrawParam(KParamStrDrawEffect) || null;
        }
        // Scrolling scheme
        setScrollScheme(aScheme: TParamScrollScheme, aFixedScrollUnit?: number) {
            this._setDrawParam(KParamStrScrollSchemeVertical, aScheme, false);
            this._setDrawParam(KParamStrScrollSchemeHorizontal, aScheme, false);
            if (aScheme == TParamScrollScheme.EByFixed) {
                if (aFixedScrollUnit) {
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitVertical, aFixedScrollUnit, false);
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitHorizontal, aFixedScrollUnit, false);
                } else {
                    throw "fixed scroll unit is missiong"
                }
            }
        }
        setVerticalScrollScheme(aScheme: TParamScrollScheme, aFixedScrollUnit?: number) {
            this._setDrawParam(KParamStrScrollSchemeVertical, aScheme, false);
            if (aScheme == TParamScrollScheme.EByFixed) {
                if (aFixedScrollUnit) {
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitVertical, aFixedScrollUnit, false);
                } else {
                    throw "fixed scroll unit is missiong"
                }
            }
        }
        getVerticalScrollScheme(): TParamScrollScheme {
            return this._getDrawParam(KParamStrScrollSchemeVertical) || TParamScrollScheme.EByItem;
        }
        setHorizontalScrollScheme(aScheme: TParamScrollScheme, aFixedScrollUnit?: number) {
            this._setDrawParam(KParamStrScrollSchemeHorizontal, aScheme, false);
            if (aScheme == TParamScrollScheme.EByFixed) {
                if (aFixedScrollUnit) {
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitHorizontal, aFixedScrollUnit, false);
                } else {
                    throw "fixed scroll unit is missiong"
                }
            }
        }
        getHorizontalScrollScheme(): TParamScrollScheme {
            return this._getDrawParam(KParamStrScrollSchemeHorizontal) || TParamScrollScheme.EByItem;
        }
        getDataRolling() {
            return false;
        }

        // Keep focus
        setKeepFocus(aKeepFocus: boolean) {
            this._setDrawParam(KParamKeepFocus, aKeepFocus, true);
        }
        getKeepFocus() {
            return this._getDrawParam(KParamKeepFocus) || false;
        }

        // draw hint
        /* === DEPRECATED
         _setReDrawHintByKey(aKeyStr: string) {
         var focused: HTMLElement = this.getFocusedElement();
         var rect: TRect = new TRect({
         top: focused.offsetTop,
         left: focused.offsetLeft,
         right: focused.offsetTop + focused.offsetWidth,
         bottom: focused.offsetLeft + focused.offsetHeight
         });
         var hint: TReDrawHintByKey = {
         keyStr: aKeyStr,
         prevFocusedRect: rect,
         };
         this._setDrawParam(KParamStrReDrawByKey, hint, true);
         }
         _getReDrawHintByKey(): any {
         return this._getDrawParam(KParamStrReDrawByKey);
         }
         */

        // Draw
        private _prevFocusInfo: TPrevFocusInfo;
        private _prevKeyStr: string;
        private _saveFocusInfo() {
            if (this._keyMap) {
                var prevFocusedEl: HTMLElement = this._keyMap.getFocusedElement();
                this._prevFocusInfo = {
                    rect: Util.getRect(prevFocusedEl),
                    activeFocus: prevFocusedEl.classList.contains(KClassActiveFocusedLeaf),
                    prevFocusedEl: prevFocusedEl
                };
            }
        }

        _drawn: boolean;
        draw(aRect?: TRect) {
            aRect = aRect || null;
            var keepFocus = this.getKeepFocus();
            var param = this._prepareParam();
            var drawnElements: HTMLElement[];
            drawnElements = this._doDraw(aRect, param);
            this._drawn = true;
            this._clearVolitile();
            this._makeKeyMap(drawnElements, false, keepFocus);
            this._saveFocusInfo();
        }

        protected _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }): HTMLElement[] {
            var ret: HTMLElement[];
            return ret;
        }

        _keyMapBuilder: FKeyMapBuilder;
        _makeKeyMap(drawnElements: HTMLElement[], aUpdateFocusInfo: boolean, aKeepFocus: boolean): void {

            if (!this._drawn) {
                return;
            }

            if (aUpdateFocusInfo) {
                this._saveFocusInfo();
            }
            if (drawnElements && drawnElements.length) {
                var keyMap = new CKeyMap((aOld: HTMLElement, aNew: HTMLElement) => {
                    this._keyMapFocusChanged(aOld, aNew);
                }, this._group ? KClassActiveFocused : KClassActiveFocusedLeaf);
                this._keyMapBuilder(keyMap, drawnElements, this._prevFocusInfo, aKeepFocus ? null: this._prevKeyStr);
                this._keyMap = keyMap;
                this._element.classList.add(KClassFocusable);
            } else {
                this._keyMap = null;
                this._element.classList.remove(KClassFocusable);
            }
        }

        // Key navigation
        _keyMapFocusChanged(aOld: HTMLElement, aNew: HTMLElement) {
            this._handleFocusChanged(aOld, aNew);
        }
        doKey(aKeyStr: string, aParam?: any): boolean {
            if (this._transitioning) {
                return true;
            }
            this._prevKeyStr = aKeyStr;

            var handled = false;

            var funcName = "_doKey" + aKeyStr;
            if (this[funcName]) {
                handled = this[funcName](aParam);
            }

            if (!handled && this._keyMap) {
                handled = this._keyMap.doKey(aKeyStr);
            }

            funcName += "Latent";
            if (!handled && this[funcName]) {
                handled = this[funcName](aParam);
            }

            return handled;
        }

        protected _doKeyEnterLatent() {
            if (this._keyMap) {
                this._emitItemSelected(this._keyMap.getFocusedIndex(), this._keyMap.getFocusedElement());
            }
            return false;
        }

        // Signals
        protected _handleFocusChanged(aElOld: HTMLElement, aElNew: HTMLElement) {
            this._emitFocusChanged(aElOld, aElNew);
        }
        connectFocusChanged(aHolder: any, aSlotName: string, aSlot: FFocusChanged) {
            this.connect("FocusChanged", aHolder, aSlotName);
        }
        private _emitFocusChanged(aOld: HTMLElement, aNew: HTMLElement) {
            this.emit.call(this, "FocusChanged", aOld, aNew);
        }
        connectFocusGained(aHolder: any, aSlotName: string, aSlot: FFocusGained) {
            this.connect("FocusGained", aHolder, aSlotName);
        }
        private _emitFocusGained() {
            this.emit.call(this, "FocusGained", this);
        }
        connectFocusLost(aHolder: any, aSlotName: string, aSlot: FFocusLost) {
            this.connect("FocusLost", aHolder, aSlotName);
        }
        private _emitFocusLost() {
            this.emit.call(this, "FocusLost", this);
        }
        connectItemSelected(aHolder: any, aSlotName: string, aSlot: FItemSelected) {
            this.connect("ItemSelected", aHolder, aSlotName);
        }
        private _emitItemSelected(aIndex: number, aEl: HTMLElement) {
            this.emit.call(this, "ItemSelected", this, aIndex, aEl);
        }
        connectItemInserted(aHolder: any, aSlotName: string, aSlot: FItemInserted) {
            this.connect("ItemInserted", aHolder, aSlotName);
        }
        connectItemRemoved(aHolder: any, aSlotName: string, aSlot: FItemRemoved) {
            this.connect("ItemRemoved", aHolder, aSlotName);
        }
        connectRedrawRequired(aHolder: any, aSlotName: string, aSlot: () => void) {
            this.connect("RedrawRequired", aHolder, aSlotName);
        }
        protected _emitRedrawRequired() {
            this.emit.call(this, "RedrawRequired", this);
        }

        // Utilities
        isFocusable(): boolean {
            return this._element.classList.contains(KClassFocusable);
        }
        isFocused(): boolean {
            return this._element.classList.contains(KClassFocused);
        }
        getFocusedElement(): HTMLElement {
            return this._keyMap ? this._keyMap.getFocusedElement(): null;
        }
        clearFocusable() {
            this._element.classList.remove(KClassFocusable);
        }
        clearFocused() {
            this._element.classList.remove(KClassFocused);
        }
        setFocusedElement(aElement: HTMLElement): boolean {
            var ret = false;
            var elementIndex = this._keyMap.getIndex(aElement);
            if (elementIndex != -1) {
                var focusedIndex = this._keyMap.getFocusedIndex();
                if (focusedIndex != elementIndex) {
                    this._keyMap.changeFocus(elementIndex);
                    ret = true;
                }
            }
            return ret;
        }
        setFocusedElementByIndex(aIndex: number): boolean {
            var ret = false;
            var focusedIndex = this._keyMap.getFocusedIndex();
            if (0 <= aIndex && aIndex < this._keyMap.getMapCount()) {
                if (focusedIndex != aIndex) {
                    this._keyMap.changeFocus(aIndex);
                    ret = true;
                }
            }
            return ret;
        }
        _setActiveFocus(aFocus: boolean) {
            if (this.isFocusable()) {
                var focused: HTMLElement = this.getFocusedElement();
                if (aFocus) {
                    focused.classList.add(KClassActiveFocusedLeaf);
                    this._saveFocusInfo();
                    this._handleFocusGainged();
                } else {
                    focused.classList.remove(KClassActiveFocusedLeaf);
                    this._handleFocusLost();
                }
            }
        }

        private _handleFocusGainged() {
            this._emitFocusGained();
        }

        private _handleFocusLost() {
            this._emitFocusLost();
        }

        setActiveFocus() {
            this._setActiveFocus(true);
        }
        empty() {
            var i, len, childNodes = this._element.childNodes;
            for (i = childNodes.length - 1; i >= 0; i--) {
                this._element.removeChild(childNodes[i]);
            }
        }
        setId(aId: string) {
            this._element.id = aId;
        }
        getId(): string {
            return this._element.id;
        }
        addClass(aClass: string) {
            this._element.classList.add(aClass);
        }

        _transitioning = false;
        setTransition(aTransition: boolean) {
            this._transitioning = aTransition;
        }
        isTransitioning() {
            return this._transitioning ? true : false;
        }

        getSize(): TSize {
            return {
                width: this._element.offsetWidth,
                height: this._element.offsetHeight
            }
        }

        // avail
        _contentAvail: TContentAvail;
        getContentAvail(): TContentAvail {
            return this._contentAvail;
        }

        setContentAvail(aContentAvail: TContentAvail) {
            this._contentAvail = aContentAvail;
        }

        updateContentAvail(aKeyStr: string, aDrawnRect: TRect) {
            var focusedItem = this.getFocusedElement();
            var focusedRect = new TRect({
                top: focusedItem.offsetTop,
                left: focusedItem.offsetLeft,
                right: focusedItem.offsetLeft + focusedItem.offsetWidth,
                bottom: focusedItem.offsetTop + focusedItem.offsetHeight
            });

            var size = this.getSize();
            var contentAvailable: TContentAvail = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var totalAvailable: TContentAvail = {
                up: aDrawnRect.top,
                left: aDrawnRect.left,
                right: size.width - (aDrawnRect.right),
                down: size.height - (aDrawnRect.bottom)
            };

            //// This case is (items draw Rect < drawnRect)
            //if (totalAvailable.right < 0 || totalAvailable.down < 0) {
            //    // when simulation in Chrome, totalAvailable is invalid..(will be fixed?)
            //    return;
            //}

            var orientation = this._getDrawParam(KParamStrOrientation);
            if (orientation === TParamOrientation.EVertical) {
                switch (aKeyStr) {
                    case KKeyStrLeft:
                    case KKeyStrRight:
                        this._contentAvail = contentAvailable;
                        return;
                }
            } else if (orientation === TParamOrientation.EHorizontal) {
                switch (aKeyStr) {
                    case KKeyStrUp:
                    case KKeyStrDown:
                        this._contentAvail = contentAvailable;
                        return;
                }
            }

            var up = aKeyStr == KKeyStrUp;
            var down = aKeyStr == KKeyStrDown;
            if (up || down) {
                this._contentAvail = this._updateContentAvailVertical(totalAvailable, aDrawnRect, focusedRect, up, down);
            }
            var left = aKeyStr == KKeyStrLeft;
            var right = aKeyStr == KKeyStrRight;
            if (left || right) {
                this._contentAvail = this._updateContentAvailHorizontal(totalAvailable, aDrawnRect, focusedRect, left, right);
            }
        }

        private _updateContentAvailVertical(aTotalAvailable: TContentAvail, aDrawnRect: TRect, aFocusedRect: TRect, aUp: boolean, aDown: boolean): TContentAvail {
            var nextTop;
            var contentAvailable: TContentAvail = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var scrollSchemeVertical = this.getVerticalScrollScheme();
            var scrollUnit = this._getDrawParam(KParamStrScrollSchemeFixedUnitVertical);
            var itemHeight = this.getItemHeight() || aFocusedRect.getHeight();
            switch (scrollSchemeVertical) {
                case TParamScrollScheme.EByFocusRemainsRolling:
                    if (aUp) {
                        contentAvailable.up = aDrawnRect.getHeight() - itemHeight;
                    }
                    if (aDown) {
                        contentAvailable.down = aFocusedRect.top - aDrawnRect.top;
                    }
                    break;

                case TParamScrollScheme.EByFocusRemains:

                    if (aUp) {
                        nextTop = aDrawnRect.getHeight() - itemHeight;
                        if (nextTop <= 0) {
                            contentAvailable.up = Math.min(aTotalAvailable.up, itemHeight);
                        } else {
                            contentAvailable.up = Math.min(aTotalAvailable.up, nextTop);
                        }
                    }

                    if (aDown) {
                        nextTop = aFocusedRect.top - aDrawnRect.top;
                        if (nextTop > 0) {
                            contentAvailable.down = Math.min(aTotalAvailable.down, nextTop);
                        } else {
                            contentAvailable.down = Math.min(aTotalAvailable.down, itemHeight);
                        }
                    }

                    break;
                case TParamScrollScheme.EByItem:

                    if (aUp) {
                        nextTop = itemHeight;
                        contentAvailable.up = Math.min(aTotalAvailable.up, nextTop);
                    }

                    if (aDown) {
                        nextTop = itemHeight;
                        contentAvailable.down = Math.min(aTotalAvailable.down, nextTop);
                    }

                    break;

                case TParamScrollScheme.EByFixed:
                    nextTop = scrollUnit;
                    if (aUp && 0 < aTotalAvailable.up) {
                        contentAvailable.up = scrollUnit;
                    }

                    if (aDown && 0 < aTotalAvailable.down) {
                        contentAvailable.down = scrollUnit;
                    }
                    break;

                default:
                    break;
            }
            return contentAvailable;
        }

        private _updateContentAvailHorizontal(aTotalAvailable: TContentAvail, aDrawnRect: TRect, aFocusedRect: TRect, aLeft: boolean, aRight: boolean): TContentAvail {
            var nextLeft;
            var contentAvailable: TContentAvail = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var scrollSchemeHorizontal = this.getHorizontalScrollScheme();
            var scrollUnit = this._getDrawParam(KParamStrScrollSchemeFixedUnitHorizontal);
            var itemWidth = this.getItemWidth() || aFocusedRect.getWidth();
            switch (scrollSchemeHorizontal) {
                case TParamScrollScheme.EByFocusRemainsRolling:
                    if (aLeft) {
                        contentAvailable.left = aDrawnRect.getWidth() - itemWidth;
                    }
                    if (aRight) {
                        contentAvailable.right = aFocusedRect.left - aDrawnRect.left;
                    }
                    break;

                case TParamScrollScheme.EByFocusRemains:

                    if (aLeft) {
                        nextLeft = aDrawnRect.getWidth() - itemWidth;
                        if (nextLeft <= 0) {
                            contentAvailable.left = Math.min(aTotalAvailable.left, itemWidth);
                        } else {
                            contentAvailable.left = Math.min(aTotalAvailable.left, nextLeft);
                        }
                    }

                    if (aRight) {
                        nextLeft = aFocusedRect.left - aDrawnRect.left;
                        if (nextLeft > 0) {
                            contentAvailable.right = Math.min(aTotalAvailable.right, nextLeft);
                        } else {
                            contentAvailable.right = Math.min(aTotalAvailable.right, itemWidth);
                        }
                    }

                    break;
                case TParamScrollScheme.EByItem:

                    if (aLeft) {
                        nextLeft = itemWidth;
                        contentAvailable.left = Math.min(aTotalAvailable.left, nextLeft);
                    }

                    if (aRight) {
                        nextLeft = itemWidth;
                        contentAvailable.right = Math.min(aTotalAvailable.right, nextLeft);
                    }

                    break;

                case TParamScrollScheme.EByFixed:

                    nextLeft = scrollUnit;
                    if (aLeft && 0 < aTotalAvailable.left) {
                        contentAvailable.left = scrollUnit;
                    }

                    if (aRight && 0 < aTotalAvailable.right) {
                        contentAvailable.right = scrollUnit;
                    }

                    //if (aLeft) {
                    //    nextLeft = scrollUnit;
                    //    contentAvailable.left = Math.min(aTotalAvailable.left, nextLeft);
                    //}
                    //
                    //if (aRight) {
                    //    nextLeft = scrollUnit;
                    //    contentAvailable.right = Math.min(aTotalAvailable.right, nextLeft);
                    //}

                    break;

                default:
                    break;
            }

            return contentAvailable;
        }
    }

    export interface FItemDrawer {
        (aElement: HTMLElement, aIndex: number): TFocusInfo;
    }

    export class CLayoutControl extends CControl {

        constructor(element: HTMLElement) {
            super(element);
            this._element.classList.add("-lay");
        }

        protected _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            var ret: HTMLElement[] = [];
            var i, len, el: HTMLElement;
            this.empty();

            var horizontal = (aDrawParam[KParamStrOrientation] === TParamOrientation.EHorizontal);
            this._keyMapBuilder = horizontal ? KBuilderLeftRight : KBuilderTopDown;
            var drawer: (element: HTMLElement, index: number) => TFocusInfo;
            var drawnElements: HTMLElement[] = [];
            for (i = 0, len = this._itemDrawers.length; i < len; i++) {
                drawer = this._itemDrawers[i];
                if (drawer) {
                    el = document.createElement("div");
                    el.attributes["data"] = i;
                    el.style.position = "absolute";
                    this._element.appendChild(el);
                    switch (drawer(el, i)) {
                        case TFocusInfo.KFocusAble:
                            el.classList.add(KClassFocusable);
                            ret.push(el);
                            break;
                        case TFocusInfo.KFocused:
                            el.classList.add(KClassFocusable);
                            el.classList.add(KClassFocused);
                            ret.push(el);
                            break;
                    }
                    drawnElements.push(el);
                } else {
                    drawnElements.push(null);
                }
            }
            FLayoutElement(
                this._element,
                drawnElements,
                this.getOrientation(),
                this.getChildVAlign(),
                this.getChildHAlign(),
                this.getMargins(),
                this.getPadding());
            return ret;
        }

        private _itemDrawers: {
            (aElement: HTMLElement, aIndex: number): TFocusInfo;
        }[] = null;
        setItemDrawers(aDrawers: FItemDrawer[]) {
            this._itemDrawers = aDrawers;
        }
    }

    export class CDrawnElements {
        _drawnElements: {} = {};
        constructor() {
        }
        destroy() {
            this.removeAll();
        }
        removeAll() {
            var key, el: HTMLElement;
            for (key in this._drawnElements) {
                if (this._drawnElements.hasOwnProperty(key)) {
                    el = this._drawnElements[key];
                    Util.remove(el);
                }
            }
            this._drawnElements = {};
        }
        getCount(): number {
            return Object.keys(this._drawnElements).length;
        }
        getElements(): HTMLElement[] {
            var ret: HTMLElement[] = [], key;
            for (key in this._drawnElements) {
                if (this._drawnElements.hasOwnProperty(key)) {
                    ret.push(this._drawnElements[key]);
                }
            }
            return ret;
        }
        getElement(aKey: any): HTMLElement {
            return this._drawnElements[aKey];
        }
        setElement(aKey: any, aItem: HTMLElement) {
            this._drawnElements[aKey] = aItem;
        }

        /**
         * Get key from drawn element
         * @param aItem
         * @returns {string|any}
         */
        getKey(aItem: HTMLElement) {
            var keys = Object.keys(this._drawnElements);
            var i, len = keys.length, k, el;
            for (i=0; i<len; i++) {
                k = keys[i];
                el = this._drawnElements[k];
                if (aItem === el) {
                    return k;
                }
            }
        }
        pickElement(aKey: any): HTMLElement {
            var ret: HTMLElement = null;
            if (this._drawnElements.hasOwnProperty(aKey)) {
                ret = this._drawnElements[aKey];
                delete this._drawnElements[aKey];
            }
            return ret;
        }
        remove(aKey: any) {
            var el: HTMLElement = this._drawnElements[aKey];
            if (el) {
                Util.remove(el);
            }
            delete this._drawnElements[aKey];
        }
        forEach(fn: (aKey: any, aItem: HTMLElement) => boolean) {
            var key;
            for (key in this._drawnElements) {
                if (this._drawnElements.hasOwnProperty(key)) {
                    if (fn(key, this._drawnElements[key])) {
                        break;
                    }
                }
            }
        }
        setAnimation(aEnable: boolean) {
            if (aEnable) {
                this.forEach(function (aKey: any, aItem: HTMLElement) {
                    aItem.style[KCssPropTransition] = KCssTransitionParamPos;
                    return false;
                });
            } else {
                this.forEach(function (aKey: any, aItem: HTMLElement) {
                    delete aItem.style[KCssPropTransition];
                    return false;
                });
            }
        }
    }

    export class CDataProvider extends CSignalSource {
        constructor() {
            super();
            this.registerSignal(['ItemInserted', 'ItemUpdated', 'ItemMoved', 'ItemRemoved', 'ItemRefreshed']);
        }
        destroy() {
            super.destroy();
        }

        getItem(aKey: any): any {
            throw "not implemented";
            return null;
        }

        getLength(): number {
            throw "not implemented";
            return 0;
        }

        insertItem(aKey: any, aItem: any) {
            this._doInsertItems(aKey, aItem);
            this.emit("ItemInserted", aKey, aItem);
        }
        protected _doInsertItems(aKey: any, aItem: any[]): void {

        }
        removeItems(aKeys: any[]) {
            this._doRemoveItems(aKeys);
            this.emit("ItemRemoved", aKeys);
        }
        protected _doRemoveItems(aKeys: any[]): void {

        }
        updateItems(aKeys: any[], aItems?: any[]) {
            this._doUpdateItems(aKeys, aItems);
            this.emit("ItemUpdated", aKeys, aItems);
        }
        //_doUpdateItems: (aKey: any[], aItem: any[]) => boolean;
        protected _doUpdateItems(aKey: number[], aItem: any[]): boolean {
            return false;
        }
        connectItemInserted(aHolder: any, aSlotName: string, aHandler: { (aKey: any, aItems: any[]): void; }) {
            this.connect("ItemInserted", aHolder, aSlotName);
        }
        connectItemRemoved(aHolder: any, aSlotName: string, aHandler: { (aKeys: any[]): void; }) {
            this.connect("ItemRemoved", aHolder, aSlotName);
        }
        connectItemUpdated(aHolder: any, aSlotName: string, aHandler: { (aKeys: any[], aItems?: any[]): void; }) {
            this.connect("ItemUpdated", aHolder, aSlotName);
        }
    }

    export class CListDataProvider extends CDataProvider {
        _listData: any;
        _bDataRolling: boolean;
        constructor(aArray: any, aRolling?: boolean) {
            super();
            this._bDataRolling = aRolling;
            this._listData = (this._bDataRolling) ? new CCircularArray(aArray) : aArray.slice(0);
            this.getItem = this._getItem;
            this.getLength = this._getLength;
            this._doInsertItems = this._insertItems;
            this._doRemoveItems = this._removeItems;
            this._doUpdateItems = this._updateItems;
        }
        private _getItem(aKey: number): any {
            return (this._bDataRolling) ? this._listData.at(aKey) : this._listData[aKey];
        }
        private _getLength(): number {
            return (this._bDataRolling) ? this._listData.length() : this._listData.length;
        }
        private _insertItems(aKey: number, aItems: any[]) {
            var list = this._listData;
            if (aItems.length) {
                var front, end;
                front = list.slice(0, aKey);
                end = list.slice(aKey);
                this._listData = front.concat(aItems, end);
            } else {
                this._listData.splice(aKey, 0, aItems);
            }
        }
        private _removeItems(aKey: number[]) {
            var i;
            for (i = aKey.length - 1; i >= 0; i--) {
                this._listData.splice(i, 1);
            }
        }
        private _updateItems(aKey: number[], aItem: any[]) {
            var i, len;
            if (aItem) {
                for (i = 0, len = aKey.length; i < len; i++) {
                    this._listData[aKey[i]] = aItem[i];
                }
            }
            return true;
        }
    }

    export class CGridDataProvider extends CDataProvider {
        constructor(aArray: any[]) {
            super();
        }
    }

    export interface FDataDrawer {
        (aKey: any, aItem: any, aEl: HTMLElement): TFocusInfo;
        //(aEl: HTMLElement, aItem: any): TFocusInfo;
    }

    export interface FDataItemSelected {
        (aKey: any, aItem: any, aEl: HTMLElement): void;
    }

    export interface FFocusedDataItemChanged {
        (aKeyNew: any, aItemNew: any, aElNew: HTMLElement,
         aKeyOld: any, aItemOld: any, aElOld: HTMLElement): void;
    }

    export interface TFocusedInfo {
        el: HTMLElement;
        key: any;
        item: any;
    }

    export class CDataControl extends CControl {
        _ownedDataProvider: CDataProvider;
        _drawer: FDataDrawer;
        _drawnElements: CDrawnElements;
        _prevDrawnElements: CDrawnElements;
        private _redrawAfterOperation: boolean = false;

        constructor(aElement: HTMLElement) {
            super(aElement);
            this._drawnElements = new CDrawnElements();
            this.registerSignal(["DataItemSelected", "FocusedDataItemChanged"]);
        }
        destroy() {
            this._drawnElements.destroy();
            this._ownedDataProvider.destroy();
        }

        draw(aRect?: TRect) {
            if (!this._drawer) {
                throw "data drawer must be provided to draw";
            }
            super.draw(aRect);
        }

        setDataDrawer(aDrawer: FDataDrawer) {
            this._drawer = aDrawer;
        }

        getFocusedItemInfo(): TFocusedInfo {
            var el: HTMLElement = this.getFocusedElement();
            var key, item;
            if (el) {
                key = el.attributes["data"];
                item = this._ownedDataProvider.getItem(key);
                return {
                    el: el,
                    key: key,
                    item: item
                }
            }
            return null;
        }

        setFocusedItem(aKey: string) {
            var el: HTMLElement = this._drawnElements.getElement(aKey);
            if (el) {
                this.setFocusedElement(el);
            }
        }

        protected doItemChagned(aKeys: any[]): void {

        }

        protected doItemInserted(aKey: any, aItems: any[], aNeedFocus?: boolean): void {

        }

        protected doItemRemoved(aKey: number, aUnsetFocus?: boolean): void {

        }

        setRedrawAfterOperation (aRedraw: boolean) {
            this._redrawAfterOperation = aRedraw;
        }

        private _slItemChanged(aKeys: any[]) {
            var i, len, key, el: HTMLElement;
            for (i = 0, len = aKeys.length; i < len; i++) {
                key = aKeys[i];
                el = this._drawnElements.getElement(key);
                if (el) {
                    this._drawer(key, this._ownedDataProvider.getItem(key), el);
                }
            }
            this.doItemChagned(aKeys);
        }

        private _slItemInserted(aKey: any, aItems: any[]) {
            var drawnElements = this._drawnElements;
            var keys = Object.keys(drawnElements._drawnElements);
            var i, dest = parseInt(aKey);
            var replacedKey = keys.length;
            var element: HTMLElement;
            var width = this.getItemWidth() || 0;
            var height = this.getItemHeight() || 0;
            var fnCreateElement = () => {
                var index = aKey.toString();
                var el: HTMLElement = document.createElement("div");
                var item: any = this._ownedDataProvider.getItem(aKey);
                el.classList.add("-list-item");
                el.attributes["data"] = index;
                el.style.position = "absolute";
                el.style.top = index * height + "px";
                el.style.left = index * width + "px";
                var focusInfo: TFocusInfo = this._drawer(aKey, item, el);
                if (focusInfo === TFocusInfo.KFocusAble) {
                    el.classList.add(KClassFocusable);
                }
                this._element.appendChild(el);
                return el;
            };
            var needFocus: boolean = (keys.length === 0);
            if (replacedKey >= 0) {
                for (i = keys.length - 1; i >= dest; i--) {
                    element = drawnElements.pickElement(i.toString());
                    drawnElements.setElement(replacedKey.toString(), element);
                    if (this._redrawAfterOperation) {
                        this._drawer(replacedKey.toString(), this._ownedDataProvider.getItem(replacedKey.toString()), element);
                    }
                    element.style.left = parseInt(element.style.left) + width + 'px';
                    element.style.top = parseInt(element.style.top) + height + 'px';
                    replacedKey = i;
                }
                drawnElements.setElement(aKey, fnCreateElement());
                this.doItemInserted(aKey, aItems, needFocus);
            }
            this._emitRedrawRequired();
        }

        private _slItemRemoved(aKeys: any[]) {
            //TODO implement
        }

        setOwnedDataProvider(dataProvider: CDataProvider) {
            var self: CDataControl = this;
            this._drawnElements.removeAll();
            if (this._ownedDataProvider) {
                this._ownedDataProvider.destroy();
            }
            this._ownedDataProvider = dataProvider;
            this._ownedDataProvider.connectItemUpdated(this, "_slItemChanged", this._slItemChanged);
            this._ownedDataProvider.connectItemInserted(this, "_slItemInserted", this._slItemInserted);
            this._ownedDataProvider.connectItemRemoved(this, "_slItemRemoved", this._slItemRemoved);
        }
        clearDrawnElements() {
            this._clearDrawnElements();
        }
        _clearDrawnElements() {
            this._drawnElements.removeAll();
        }
        _setDrawnElement(aKey: any, el: HTMLElement) {
            this._drawnElements.setElement(aKey, el);
        }
        _getDrawnElement(aKey: any): HTMLElement {
            return this._drawnElements.getElement(aKey);
        }
        _getDrawnElements(): HTMLElement[]{
            return this._drawnElements.getElements();
        }
        _removeDrawnElement(aKey: any) {
            this._drawnElements.remove(aKey);
            this._prevDrawnElements.remove(aKey);
        }
        _pickDrawnElements() {
            var ret = this._drawnElements;
            this._drawnElements = new CDrawnElements();
            return ret;
        }
        _setPrevDrawnElements(aDrawnElements: CDrawnElements) {
            if (this._prevDrawnElements) {
                this._prevDrawnElements.destroy();
            }
            aDrawnElements.forEach(function (aKey: any, aEl: HTMLElement) {
                aEl.classList.remove(KClassActiveFocusedLeaf);
                aEl.classList.remove(KClassFocused);
                return false;
            });
            this._prevDrawnElements = aDrawnElements;
        }

        protected _handleFocusChanged(aElOld: HTMLElement, aElNew: HTMLElement) {
            super._handleFocusChanged(aElOld, aElNew);
            var keyNew = this._drawnElements.getKey(aElNew);
            var keyOld = this._drawnElements.getKey(aElOld);
            var itemNew = this._ownedDataProvider.getItem(keyNew);
            var itemOld = this._ownedDataProvider.getItem(keyOld);
            this._emitFocusedDataItemChanged(
                keyNew, itemNew, aElNew,
                keyOld, itemOld, aElOld);
        }

        /*
         Signals
         */
        protected _doKeyEnterLatent() {
            super._doKeyEnterLatent();
            var focusedInfo = this.getFocusedItemInfo();
            this._emitDataItemSelected(focusedInfo.key, focusedInfo.item, focusedInfo.el);
            return true;
        }
        connectDataItemSelected(aHolder: any, aSlotName: string, aSlot: FDataItemSelected) {
            this.connect("DataItemSelected", aHolder, aSlotName);
        }
        private _emitDataItemSelected(aKey: any, aItem: any, aEl: HTMLElement) {
            this.emit.call(this, "DataItemSelected", aKey, aItem, aEl);
        }
        connectFocusedDataItemChanged(aHolder: any, aSlotName: string, aSlot: FFocusedDataItemChanged) {
            this.connect("FocusedDataItemChanged", aHolder, aSlotName);
        }
        private _emitFocusedDataItemChanged(aKeyNew: any, aItemNew: any, aElNew: HTMLElement,
                                            aKeyOld: any, aItemOld: any, aElOld: HTMLElement) {
            this.emit.call(this, "FocusedDataItemChanged",
                aKeyNew, aItemNew, aElNew,
                aKeyOld, aItemOld, aElOld);
        }
    }

    export class CListDataControl extends CDataControl {
        private _bDataRolling: boolean;
        constructor(aElement: HTMLElement, aRolling?: boolean) {
            super(aElement);
            this._bDataRolling = aRolling;
            this._element.classList.add("-list");
            this.registerSignal(["ItemInserted", "ItemRemoved"]);
        }
        protected doItemInserted(aKey: any, aItems: any[], aNeedFocus?: boolean) {
            this.emit.call(this, "ItemInserted", this._drawnElements, aNeedFocus);
        }
        protected doItemRemoved(aKey: number, aUnsetFocus?: boolean) {
            this.emit.call(this, "ItemRemoved", this._drawnElements, aUnsetFocus);
        }
        protected doItemChanged(aKeys: number[]) {
            var i, len, key, drawnEl;
            for (i = 0, len = aKeys.length; i < len; i++) {
                key = aKeys[i];
                drawnEl = this._getDrawnElement(key);
                if (drawnEl) {
                    this._drawer(key, this._ownedDataProvider.getItem(key), drawnEl);
                }
            }
        }
        setDataRolling(aRolling: boolean) {
            this._bDataRolling = aRolling;
        }
        getDataRolling() {
            return this._bDataRolling;
        }
        getSize(): { width: number; height: number; } {
            var itemHeight: number = this._getDrawParam(KParamStrItemHeight) || 0;
            var itemWidth: number = this._getDrawParam(KParamStrItemWidth) || 0;
            var horizontal: boolean = (this._getDrawParam(KParamStrOrientation) === TParamOrientation.EHorizontal);
            var count = this._ownedDataProvider ? this._ownedDataProvider.getLength() : 0;
            if (this._bDataRolling) {
                var w = horizontal ? Number.MAX_VALUE : itemWidth;
                var h = horizontal ? itemHeight : Number.MAX_VALUE;
            } else {
                var w = horizontal ? itemWidth * count : itemWidth;
                var h = horizontal ? itemHeight : itemHeight * count;
            }
            return {
                width: w,
                height: h
            }
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            var focusableElements: HTMLElement[] = [];
            var horizontal: boolean = (aDrawParam[KParamStrOrientation] === TParamOrientation.EHorizontal);
            var dp: CDataProvider = this._ownedDataProvider;
            var fixedItemSize: number = horizontal ? aDrawParam[KParamStrItemWidth] : aDrawParam[KParamStrItemHeight];
            var drawPosStart: number = horizontal ? aRect.left : aRect.top;
            var drawPosEnd: number = horizontal ? aRect.right : aRect.bottom;
            var drawSize: number = horizontal ? aRect.getHeight() : aRect.getWidth();
            var posProp: string = horizontal ? "left" : "top";
            var startIndex: number = drawSize ? Math.floor(drawPosStart / fixedItemSize) : 0;
            var itemCount: number = this._bDataRolling ? startIndex + dp.getLength() : dp.getLength();
            var i;
            var prevDrawnItem = this._pickDrawnElements();
            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            this._keyMapBuilder = horizontal ? KBuilderLeftRight : KBuilderTopDown;
            for (i = startIndex; i < itemCount; i++) {
                var elPosStart = i * fixedItemSize;
                var elPosEnd = elPosStart + fixedItemSize;
                if (elPosStart <= drawPosEnd) { // inbound
                    // draw element if necessary
                    var el: HTMLElement = prevDrawnItem.pickElement(i);
                    var item: any = dp.getItem(i);
                    if (!el) {
                        el = document.createElement("div");
                        el.classList.add("-list-item");
                        el.attributes["data"] = i;
                        el.style.position = "absolute";
                        el.style[posProp] = i * fixedItemSize + "px";
                        var focusInfo: TFocusInfo = this._drawer(i, item, el);
                        if (focusInfo === TFocusInfo.KFocusAble) {
                            el.classList.add(KClassFocusable);
                        }
                        this._element.appendChild(el);
                    }
                    this._setDrawnElement(i, el);
                    if (drawPosStart <= elPosStart && elPosEnd <= drawPosEnd && el.classList.contains(KClassFocusable)) {
                        focusableElements.push(el);
                    }

                    // check content available
                    if (elPosStart < drawPosStart) {
                        if (horizontal) {
                            contentAvailable.left = drawPosStart - elPosStart;
                        } else {
                            contentAvailable.up = drawPosStart - elPosStart;
                        }
                    }
                    if (drawPosEnd < elPosEnd) {
                        if (horizontal) {
                            contentAvailable.right = elPosEnd - drawPosEnd;
                        } else {
                            contentAvailable.down = elPosEnd - drawPosEnd;
                        }
                    }
                }
            }
            prevDrawnItem.destroy();

            // check content available
            if (horizontal) {
                if (contentAvailable.left === 0 && startIndex) {
                    contentAvailable.left = fixedItemSize;
                }
                if (contentAvailable.right === 0 && i !== itemCount) {
                    contentAvailable.right = fixedItemSize;
                }
            } else {
                if (contentAvailable.up === 0 && startIndex) {
                    contentAvailable.up = fixedItemSize;
                }
                if (contentAvailable.down === 0 && i !== itemCount) {
                    contentAvailable.down = fixedItemSize;
                }
            }
            this._contentAvail = contentAvailable;

            return focusableElements;
        }
        prependItem(aItem: any) {
            this._ownedDataProvider.insertItem(0, aItem);
        }
        insertItem(position: number, aItem: any) {
            this._ownedDataProvider.insertItem(position, aItem);
        }
        appendItem(aItem: any) {
            this._ownedDataProvider.insertItem(this._ownedDataProvider.getLength(), aItem);
        }
        removeItem(index: number) {
            this._ownedDataProvider.removeItems([index]);
        }
        removeItems(index: number[]) {
            this._ownedDataProvider.removeItems(index);
        }
    }

    export class CGridDataControl extends CDataControl {
        constructor(aElement: HTMLElement) {
            super(aElement);
            this._element.classList.add("-grid");
        }

        getSize(): { width: number; height: number; } {
            var itemHeight: number = this._getDrawParam(KParamStrItemHeight) || 0;
            var itemWidth: number = this._getDrawParam(KParamStrItemWidth) || 0;
            var maxColCount: number = this._getDrawParam(KParamStrMaxColCount) || 1;
            var count = this._ownedDataProvider.getLength();
            var w = itemWidth * maxColCount;
            var h = itemHeight * Math.ceil(count / maxColCount);
            return {
                width: w,
                height: h
            }
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            var focusableElements: HTMLElement[] = [];
            var dp: CDataProvider = this._ownedDataProvider;
            var itemCount: number = dp.getLength();
            var itemWidth: number = aDrawParam[KParamStrItemWidth];
            var itemHeight: number = aDrawParam[KParamStrItemHeight];
            var maxColCount: number = aDrawParam[KParamStrMaxColCount];

            var curCol: number = aRect ? Math.floor(aRect.left / itemWidth) : 0;
            var curRow: number = aRect ? Math.floor(aRect.top / itemHeight) : 0;

            var startIndex: number = aRect ? curRow * maxColCount + curCol : 0;

            var prevDrawnItem = this._pickDrawnElements();

            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };

            var i;
            this._keyMapBuilder = KBuilderGrid;
            for (i = startIndex; i < itemCount; i++) {
                var colCount = i % maxColCount;
                var rowCount = Math.floor(i / maxColCount);
                var elTop = rowCount * itemHeight;
                var elLeft = colCount * itemWidth;
                var elBottom = elTop + itemHeight;
                var elRight = elLeft + itemWidth;
                if (elTop <= aRect.bottom && elLeft <= aRect.right) {
                    var el: HTMLElement = prevDrawnItem.pickElement(i);
                    var item: any = dp.getItem(i);
                    if (!el) {
                        el = document.createElement('div');
                        el.setAttribute("data", i);
                        el.classList.add('-grid-item');
                        el.attributes['data'] = i;
                        el.style.position = 'absolute';
                        el.style.top = elTop + 'px';
                        el.style.left = elLeft + 'px';
                        var focusInfo: TFocusInfo = this._drawer(i, item, el);
                        if (focusInfo === TFocusInfo.KFocusAble) {
                            el.classList.add(KClassFocusable);
                        }
                        this._element.appendChild(el);
                    }
                    this._setDrawnElement(i, el);
                    if (aRect.top <= elTop && aRect.left <= elLeft && aRect.bottom >= elBottom && aRect.right >= elRight && el.classList.contains(KClassFocusable)) {
                        focusableElements.push(el);
                    }

                    if (elBottom > aRect.bottom) {
                        contentAvailable.down = elBottom - aRect.bottom;
                    } else if (elRight > aRect.right) {
                        contentAvailable.right = elRight - aRect.right;
                    } else if (elTop < aRect.top) {
                        contentAvailable.up = aRect.top - elTop;
                    } else if (elLeft < aRect.left) {
                        contentAvailable.left = aRect.left - elLeft;
                    }
                }
            }
            prevDrawnItem.destroy();
            if (contentAvailable.up === 0 && curRow) {
                contentAvailable.up = itemHeight;
            } else if (contentAvailable.down === 0 && i !== itemCount) {
                contentAvailable.down = itemHeight;
            } else if (contentAvailable.left === 0 && curCol) {
                contentAvailable.left = itemWidth;
            } else if (contentAvailable.right === 0 && i !== itemCount) {
                contentAvailable.right = itemWidth;
            }
            this._contentAvail = contentAvailable;
            return focusableElements;
        }

        //updateContentAvail(aKeyStr: string) {
        //    if (aKeyStr === KKeyStrRight || aKeyStr === KKeyStrDown) {
        //        var focusedIndex: number = this.getFocusedItemInfo().key;
        //        var maxColCount: number = this.getMaxColCount();
        //        var db: CDataProvider = this._ownedDataProvider;
        //        var itemCount: number = db.getLength();
        //        var rowCount: number = Math.floor(itemCount / maxColCount);
        //        var restCount: number = itemCount % maxColCount;
        //        var focusedRow: number = Math.floor(focusedIndex / maxColCount);
        //        var focusedCol: number = focusedIndex % maxColCount;
        //        var itemWidth: number = this._getDrawParam(KParamStrItemWidth);

        //        if (focusedIndex === itemCount - 1) {
        //            this._contentAvail.right = 0;
        //            this._contentAvail.down = 0;
        //        } else if (focusedRow === rowCount - 1 && focusedCol > restCount) {
        //            this._contentAvail.down = 0;
        //        } else if (focusedIndex !== itemCount - 1 && focusedCol !== maxColCount - 1 && this._contentAvail.right === 0) {
        //            this._contentAvail.right = itemWidth;
        //        }
        //    }
        //}
    }

    export interface TDrawingData {
        rect: TRect;
        data: any;
        rowIndex?: number;
        key?: string;
    }

    export interface FGetDrawingDataListCompleted {
        (aDrawingDataList: TDrawingData[]): void;
    }

    export interface FGetDrawingDataListByRowCompleted {
        (aRowAndDrawingDataListPair: { [rowIndex: number]: TDrawingData[]; }): void;
    }

    export enum TDrawingDataGrouping {
        ENone,
        ERow,
        ECol,
        EFreeStyle
    }

    export class CDrawingDataProvider extends CDataProvider {

        private _grouping: TDrawingDataGrouping;
        private _drawingDataCache: { [key: string]: TDrawingData; } = {};
        private _drawingDataByRow: { [rowIndex: number]: TDrawingData[]; } = <any>{};

        constructor(aGrouping: TDrawingDataGrouping) {
            super();
            this._grouping = aGrouping;
            this.getItem = this._doGetItem;
        }

        destroy() {
            this._drawingDataCache = null;
        }

        getItem(aKey: any): any {
            return this._drawingDataCache[aKey];
        }

        getLength(): number {
            return Object.keys(this._drawingDataCache).length;
        }

        getPrevDrawingDataByRow(aRowIndex: number) {
            return this._drawingDataByRow[aRowIndex];
        }

        // get drawing data
        getDrawingDataList(aRect: TRect, aFocusedInfo: TFocusedInfo, aCallback: FGetDrawingDataListCompleted) {

            if (this._grouping && this._doGetDrawingDataListByRow) {
            }

            this._doDrawingDataList(aRect, aFocusedInfo, (aDrawingDataList: TDrawingData[]) => {
                var i, len, drawingData: TDrawingData;
                for (i = 0, len = aDrawingDataList.length; i < len; i++) {
                    drawingData = aDrawingDataList[i];
                    this._handleNewItem(drawingData);
                }
                aCallback(aDrawingDataList);
            });
        }

        // get whole drawable area
        getSize(): TSize {
            throw "implement this";
        }

        _doDrawingDataList(aRect: TRect, aFocusedInfo: TFocusedInfo, aCallback: FGetDrawingDataListCompleted): void {
            throw "implement this";
        }

        _doGetDrawingDataListByRow: { (aRect: TRect, aFocusedInfo: TFocusedInfo, aCallback: FGetDrawingDataListByRowCompleted): boolean; };

        private _handleNewItem(aDrawingData: TDrawingData, aInserted: boolean = false) {
            aDrawingData.key = aDrawingData.key || aDrawingData.rect.top + "x" + aDrawingData.rect.left;
            if (aInserted && this._drawingDataCache[aDrawingData.key]) {
                throw "data already exists";
            }
            this._drawingDataCache[aDrawingData.key] = aDrawingData;
            if (aDrawingData.rowIndex !== undefined) {
                if (!this._drawingDataByRow[aDrawingData.rowIndex]) {
                    this._drawingDataByRow[aDrawingData.rowIndex] = [];
                }
                this._drawingDataByRow[aDrawingData.rowIndex].push(aDrawingData);
            }
        }

        private _doGetItem(aKey: string) {
            return this._drawingDataCache[aKey];
        }

        /*protected*/ _doUpdateItems(aKey: any[], aItem: any[]): boolean {
            return true;
        }

        /*protected*/ _doInsertItems(aKey: any, aItems: TDrawingData[]): void {
            var i, len;
            for (i = 0, len = aItems.length; i < len; i += 1) {
                this._handleNewItem(aItems[i], true);
            }
        }

        /*protected*/ _doRemoveItems(aKeys: any[]) {
            var i, iLen, k, item: TDrawingData, j, jLen, rowList: TDrawingData[];
            for (i = 0, iLen = aKeys.length; i < iLen; i += 1) {
                k = aKeys[i];
                item = this._drawingDataCache[k];
                delete this._drawingDataCache[k];
                if (item.rowIndex !== undefined) {
                    rowList = this._drawingDataByRow[item.rowIndex];
                    for (j = 0, jLen = rowList.length; j < jLen; j += 1) {
                        if (rowList[j].key == k) {
                            rowList.slice(j, 1);
                            break;
                        }
                    }
                }
            }
        }
    }

    export interface FRowIndexChanged {
        (aRowIndex: number): void;
    }

    export class CDrawingDataControl extends CDataControl {

        private _drawnRect: TRect;
        private _currentRowIndex: number = 0;

        constructor(aElement: HTMLElement) {
            super(aElement);
            this.registerSignal(["RowIndexChanged"]);
        }

        getSize(): { width: number; height: number;} {
            return (<CDrawingDataControl><any>this._ownedDataProvider).getSize();
        }

        destroy() {
            this._ownedDataProvider.destroy();
        }

        setOwnedDataProvider(aDrawingDataProvider: CDrawingDataProvider) {
            this._ownedDataProvider = aDrawingDataProvider;
            this._ownedDataProvider.connectItemInserted(this, "_dataInserted", this._dataInserted);
            this._ownedDataProvider.connectItemUpdated(this, "_dataUpdated", this._dataUpdated);
            this._ownedDataProvider.connectItemRemoved(this, "_dataRemoved", this._dataRemoved);
        }

        setDataDrawer(aDrawingDataDrawer: FDataDrawer) {
            this._drawer = aDrawingDataDrawer;
        }

        private _changeCurrentRow(aRowIndex: number): boolean {
            if (this._currentRowIndex != aRowIndex) {
                this._currentRowIndex = aRowIndex;
                this._emitRowIndexChanged(aRowIndex);
                return true;
            }
            return false;
        }

        /*
         private _handleFocusGained() {
         var el: HTMLElement = this.getFirstElementByRow(this._curretRowIndex);
         this.setFocusedElement(el);
         }
         */

        setCurrentRow(aRowIndex: number) {
            if (this._changeCurrentRow(aRowIndex)) {
                var el: HTMLElement = this.getFirstElementByRow(this._currentRowIndex);
                if (el) {
                    this.setFocusedElement(el);
                }
            }
        }

        getCurrentRow(): number {
            return this._currentRowIndex;
        }

        getFirstElementByRow(aRowIndex: number): HTMLElement {
            var el, rowIndexStr = "" + aRowIndex;
            this._drawnElements.forEach(function (aKey: any, aItem: HTMLElement) {
                if (aItem.attributes["data-row-index"] == rowIndexStr) {
                    el = aItem;
                    return true;
                }
            });
            return el;
        }

        connectRowIndexChanged(aHolder: any, aSlotName: string, aSlot: FRowIndexChanged) {
            this.connect("RowIndexChanged", aHolder, aSlotName);
        }

        private _emitRowIndexChanged(aRowIndex: number) {
            this.emit.call(this, "RowIndexChanged", aRowIndex);
        }

        _handleFocusChanged(aElOld: HTMLElement, aElNew: HTMLElement) {
            super._handleFocusChanged(aElOld, aElNew);
            if (aElNew.attributes["data-row-index"]) {
                var rowIndex = parseInt(aElNew.attributes["data-row-index"], 10);
                this._changeCurrentRow(rowIndex);
            }
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            var focusableElements: HTMLElement[] = [];
            var drawingSize = (<CDrawingDataControl><any>this._ownedDataProvider).getSize();
            this._element.style.width = drawingSize.width + "px";
            this._element.style.height = drawingSize.height + "px";
            this._keyMapBuilder = KBuilderWeightDistance;
            var intersectedRect: TRect;
            var focusedInfo = this.getFocusedItemInfo();
            var rect = new TRect({
                top: aRect.top,
                left: aRect.left,
                right: aRect.right,
                bottom: aRect.bottom
            });
            if (this._drawnRect) {
                var scrollScheme = this.getVerticalScrollScheme();
                if (scrollScheme == TParamScrollScheme.EByFocusRemains || scrollScheme == TParamScrollScheme.EByFocusRemainsRolling) {
                    if (rect.top < this._drawnRect.bottom && this._drawnRect.bottom < rect.bottom) {
                        rect.top = Math.max(this._drawnRect.bottom, rect.top);
                    }
                    if (rect.top < this._drawnRect.top && this._drawnRect.top < rect.bottom) {
                        rect.bottom = Math.min(this._drawnRect.top, rect.bottom);
                    }
                }
            }
            (<CDrawingDataProvider><any>this._ownedDataProvider).getDrawingDataList(rect, focusedInfo, (aDrawingDataList: TDrawingData[]) => {
                var i, len, drawingData: TDrawingData, el: HTMLElement;
                var drawnElements: CDrawnElements = this._pickDrawnElements();

                drawnElements.forEach((aKey: any, aItem: HTMLElement): boolean => {
                    if (this._isItemFocusable(aRect, aKey, aItem)) {
                        drawnElements.pickElement(aKey);
                        focusableElements.push(aItem);
                        this._setDrawnElement(aKey, aItem);
                    }
                    return false;
                });
                var focused = false;
                for (i = 0, len = aDrawingDataList.length; i < len; i++) {
                    drawingData = aDrawingDataList[i];
                    intersectedRect = aRect.getIntersectedRect(drawingData.rect);
                    if (intersectedRect) {
                        el = drawnElements.pickElement(drawingData.key);
                        if (!el) {
                            el = this._createDrawItem(drawingData);
                        }
                        if (el.classList.contains(KClassFocusable) &&
                            intersectedRect.getWidth() && intersectedRect.getWidth() <= drawingData.rect.getWidth() &&
                            intersectedRect.getHeight() && intersectedRect.getHeight() <= drawingData.rect.getHeight()) {
                            if (intersectedRect.right < aRect.right || intersectedRect.right == this._element.offsetWidth || intersectedRect.getWidth() >= aRect.getWidth()) {
                                focusableElements.push(el);
                            }
                        }
                        if (!focused && drawingData.rowIndex == this._currentRowIndex) {
                            focused = true;
                            el.classList.add(KClassFocused);
                        }
                        this._setDrawnElement(drawingData.key, el);
                    }
                }
                this._setPrevDrawnElements(drawnElements);
            });
            this._drawnRect = aRect;
            console.log("data: " + this._ownedDataProvider.getLength() + " drawn: " + this._drawnElements.getCount());
            return focusableElements;
        }

        private _createDrawItem(aDrawingData: TDrawingData): HTMLElement {
            var el = document.createElement("div");
            el.style.position = "absolute";
            el.attributes["data"] = aDrawingData.key;
            if (aDrawingData.rowIndex !== undefined) {
                el.attributes["data-row-index"] = "" + aDrawingData.rowIndex;
            }
            el.style.top = aDrawingData.rect.top + "px";
            el.style.left = aDrawingData.rect.left + "px";
            el.style.width = aDrawingData.rect.getWidth() + "px";
            el.style.height = aDrawingData.rect.getHeight() + "px";
            this._element.appendChild(el);
            if (this._drawer(aDrawingData.key, aDrawingData, el) === TFocusInfo.KFocusAble) {
                el.classList.add(KClassFocusable);
            }
            return el;
        }

        private _isItemFocusable(aDrawRect: TRect, aKey: any, aDrawnElement?: HTMLElement): boolean {
            var el: HTMLElement = aDrawnElement || this._getDrawnElement(aKey);
            if (el.classList.contains(KClassFocusable)) {
                var drawingData: TDrawingData = this._ownedDataProvider.getItem(aKey);
                if (drawingData) {
                    var rect = drawingData.rect;
                    var intersectedRect = aDrawRect.getIntersectedRect(drawingData.rect);
                    if (intersectedRect && intersectedRect.getWidth() == rect.getWidth() && intersectedRect.getHeight() == rect.getHeight()) {
                        return true;
                    }
                }
            }
            return false;
        }

        private _dataInserted(aKey: any, aItems: TDrawingData[]): void {
            var i, len;
            var drawnElements = this._getDrawnElements();
            var drawingData: TDrawingData, drawnElement: HTMLElement;
            var focused = false;
            for (i = 0, len = aItems.length; i < len; i += 1) {
                drawingData = aItems[i];
                drawnElement = this._createDrawItem(drawingData);
                if (!focused && drawingData.rowIndex == this._currentRowIndex) {
                    focused = true;
                    drawnElement.classList.add(KClassFocused);
                }
                drawnElements.push(drawnElement);
                this._setDrawnElement(drawingData.key, drawnElement);
            }
            this._makeKeyMap(drawnElements, false, true);
            console.log("data: " + this._ownedDataProvider.getLength() + " drawn: " + this._drawnElements.getCount());
        }

        private _dataUpdated(aKeys: any[], aItems?: any[]): void {
            var i, len, key;
            for (i = 0, len = aKeys.length; i < len; i++) {
                key = aKeys[i];
                this._drawer(key, this._ownedDataProvider.getItem(key), this._getDrawnElement(key));
            }
        }

        private _dataRemoved(aKeys: any[]): void {
            var i, len, k;
            for (i = 0, len = aKeys.length; i < len; i += 1) {
                k = aKeys[i];
                this._removeDrawnElement(k);
            }
        }
    }

    export interface FChildFocusChanged {
        (aOld: CControl, aNew: CControl): void;
    }
    export interface FChildViewMoved {
        (aControl: CControl, aIncrement: { top: number; left: number; } ): void;
    }

    export class CGroupControl extends CControl {

        _child: CControl[];
        constructor(aElement: HTMLElement) {
            super(aElement, "-group");
            this._group = true;
            this._child = [];
            this.registerSignal(["ChildFocusChanged"]);
            this.registerSignal(["ChildViewMoved"]);
        }
        destroy() {
            this._destroyChild();
        }

        private _destroyChild() {
            var i, len, c: CControl;
            for (i = 0, len = this._child; i < len; i++) {
                c = this._child[i];
                c.destroy();
            }
        }

        setKeyBuilder(aLayout: TParamOrientation) {
            if (aLayout == TParamOrientation.EVertical) {
                this._keyMapBuilder = KBuilderTopDown;
            } else if (aLayout == TParamOrientation.EHorizontal) {
                this._keyMapBuilder = KBuilderLeftRight;
            } else {
                this._keyMapBuilder = KBuilderLeftRight;
            }
        }

        setOwnedChildControls(aChildControls: CControl[]) {
            this._destroyChild();
            var i, len;
            for (i = 0, len = aChildControls.length; i < len; i += 1) {
                aChildControls[i].setParent(this);
            }
            this._child = aChildControls;
        }

        insertOwnedChild(aIndex: number, aControl: CControl) {
            this._child.unshift(aControl);
        }

        appendOwnedChild(aControl: CControl) {
            this._child.push(aControl);
        }

        removeOwnedControl(aControl: CControl) {
            var index = this._child.indexOf(aControl);
            if (index != -1) {
                this._child.splice(index, 1);
                aControl.destroy();
            }
        }
        /*
         updateKeyMap(aFocusedControl?: CControl) {
         var ret: HTMLElement[] = [];
         var i, len, c: CControl, el: HTMLElement;
         for (i = 0, len = this._child.length; i < len; i++) {
         c = this._child[i];
         el = c._element;
         el.attributes["data"] = i;
         this._element.appendChild(el);
         c.draw(aRect);
         if (c.isFocusable()) {
         ret.push(el);
         }
         }
         return ret;
         }
         */

        doKey(aKeyStr: string, aParam?: any): boolean {
            if (this._transitioning) {
                return true;
            }
            //this._prevKeyStr = aKeyStr;

            var handled = false;

            var funcName = "_doKey" + aKeyStr;
            if (this[funcName]) {
                handled = this[funcName](aParam);
            }

            if (!handled) {
                var child = this._child.slice(0);
                var i, len, c: CControl, bUpdated: boolean, size = this.getSize();
                for (i = 0, len = child.length; i < len; i++) {
                    c = child[i];
                    if (c.isFocused() && c.doKey(aKeyStr, aParam)) {
                        handled = true;
                        break;
                    }
                }
            }

            if (!handled && this._keyMap) {
                handled = this._keyMap.doKey(aKeyStr);
            }

            funcName += "Latent";
            if (!handled && this[funcName]) {
                handled = this[funcName](aParam);
            }

            return handled;
        }

        draw(aRect?: TRect) {
            super.draw(aRect);
            if (this._root) {
                this.setActiveFocus();
            }
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            return this._doDrawCommon(this._element, aRect, aDrawParam);
        }

        _doDrawCommon(aParent: HTMLElement, aRect: TRect, aDrawParam: { [key: string]: any; }) {
            var ret: HTMLElement[] = [];
            if (this._root) {
                this._element.classList.add(KClassFocused);
            }
            var i, len, c: CControl, el: HTMLElement;
            for (i = 0, len = this._child.length; i < len; i++) {
                c = this._child[i];
                el = c._element;
                el.attributes["data"] = i;
                aParent.appendChild(el);
                c.draw(aRect);
                if (c.isFocusable()) {
                    ret.push(el);
                }
            }
            return ret;
        }

        getFocusedChild(): CControl {
            var i, len, c: CControl;
            for (i = 0, len = this._child.length; i < len; i++) {
                c = this._child[i];
                if (c.isFocused()) {
                    return c;
                }
            }
            return null;
        }

        _setActiveFocus(aFocus: boolean) {
            var focusedChild: CControl;
            if (this.isFocusable()) {
                focusedChild = this.getFocusedChild();
                focusedChild._setActiveFocus(aFocus);
            }
        }

        setActiveFocus() {
            this._setActiveFocus(true);
        }

        _handleFocusChanged(elOld: HTMLElement, elNew: HTMLElement) {
            var oldIndex: number = parseInt(elOld.attributes["data"]);
            var newIndex: number = parseInt(elNew.attributes["data"]);
            var oldChild: CControl = this._child[oldIndex];
            var newChild: CControl = this._child[newIndex];
            oldChild._setActiveFocus(false);
            newChild._setActiveFocus(true);
            this._emitChildFocusChanged(oldChild, newChild);
        }

        // CGroupControl events
        connectChildFocusChanged(aHolder: any, aSlotName: string, aSlot: FChildFocusChanged) {
            this.connect("ChildFocusChanged", aHolder, aSlotName);
        }
        private _emitChildFocusChanged(aOld: CControl, aNew: CControl) {
            this.emit.call(this, "ChildFocusChanged", aOld, aNew);
        }
        _handleViewMoved(aControl: CControl, aIncrement: { top: number; left: number; }) {
            this._emitChildViewMoved(aControl, aIncrement);
        }
        connectChildViewMoved(aHolder: any, aSlotName: string, aSlot: FChildViewMoved) {
            this.connect("ChildViewMoved", aHolder, aSlotName);
        }
        private _emitChildViewMoved(aControl: CControl, aIncrement: { top: number; left: number; }) {
            this.emit.call(aControl, "ChildViewMoved", this, aIncrement);
        }
    }

    var FLayoutElement = function (aEl: HTMLElement, aChild: HTMLElement[], aOrientation: TParamOrientation, aVAlign: TParamVAlign, aHAlign: TParamHAlign, aMargins: TMargin, aPadding: number) {
        if (aEl.offsetHeight == 0 && aVAlign != TParamVAlign.EUnkown) {
            throw "vertical align meaningless without height";
        }
        if (aEl.offsetWidth == 0 && aHAlign != TParamHAlign.EUnkown) {
            throw "horizontal align meaningless without width";
        }

        var maxWidth = 0;
        var maxHeight = 0;
        var totalWidth = 0;
        var totalHeight = 0;
        var i, len, el: HTMLElement, w, h;
        for (i = 0, len = aChild.length; i < len; i++) {
            el = aChild[i];
            if (el) {
                w = el.offsetWidth;
                h = el.offsetHeight;
                maxWidth = Math.max(maxWidth, w);
                maxHeight = Math.max(maxHeight, h);
                totalWidth += w;
                totalHeight += h;
            }
        }
        if (aPadding && len) {
            totalWidth += (len - 1) * aPadding;
            totalHeight += (len - 1) * aPadding;
        }
        if (aOrientation == TParamOrientation.EHorizontal) {
            FLayoutElementHorizontal(aEl, aChild, aVAlign, aHAlign, aMargins, aPadding, maxWidth, maxHeight, totalWidth, totalHeight);
        } else {
            FLayoutElementVertical(aEl, aChild, aVAlign, aHAlign, aMargins, aPadding, maxWidth, maxHeight, totalWidth, totalHeight);
        }
    };

    var FLayoutElementVertical = function (
        aEl: HTMLElement,
        aChild: HTMLElement[],
        aVAlign: TParamVAlign,
        aHAlign: TParamHAlign,
        aMargins: TMargin,
        aPadding: number,
        aMaxWidth: number,
        aMaxHeight: number,
        aTotalWidth: number,
        aTotalHeight: number) {

        var height = aMargins.t + aTotalHeight + aMargins.b;
        var posTop = aMargins.t;
        if (aVAlign == TParamVAlign.ECenter) {
            posTop = (aEl.offsetHeight - aTotalHeight) / 2;
        } else if (aVAlign == TParamVAlign.EBottom) {
            posTop = aEl.offsetHeight - (aMargins.b + aTotalHeight);
        }
        var posLeft = aMargins.l;

        var i, len, el: HTMLElement, posLeft: number;
        for (i = 0, len = aChild.length; i < len; i++) {
            el = aChild[i];
            if (el) {
                el.style.top = posTop + "px";
                if (aHAlign == TParamHAlign.ECenter) {
                    posLeft = (aEl.offsetWidth - el.offsetWidth) / 2;
                } else if (aHAlign == TParamHAlign.ERight) {
                    posLeft = aEl.offsetWidth - (aMargins.r + el.offsetWidth);
                }
                el.style.left = posLeft + "px";
                posTop += el.offsetHeight + aPadding;
            } else {
                if (aEl.offsetHeight == 0) {
                    throw "Height must be provided for expending";
                }
                posTop = aEl.offsetHeight - (aTotalHeight - posTop);
            }
        }

        if (aEl.offsetHeight == 0) {
            aEl.style.height = height + "px";
        }
        if (aEl.offsetWidth == 0) {
            aEl.style.width = aMargins.l + aMaxWidth + aMargins.r + 'px';
        }
    };

    var FLayoutElementHorizontal = function (
        aEl: HTMLElement,
        aChild: HTMLElement[],
        aVAlign: TParamVAlign,
        aHAlign: TParamHAlign,
        aMargins: TMargin,
        aPadding: number,
        aMaxWidth: number,
        aMaxHeight: number,
        aTotalWidth: number,
        aTotalHeight: number) {

        var width = aMargins.l + aTotalWidth + aMargins.r;
        var posLeft = aMargins.l;
        if (aHAlign == TParamHAlign.ECenter) {
            posLeft = (aEl.offsetWidth - aTotalWidth) / 2;
        } else if (aHAlign == TParamHAlign.ERight) {
            posLeft = aEl.offsetWidth - (aMargins.l + aTotalWidth);
        }
        var posTop = aMargins.t;
        var i, len, el: HTMLElement, posLeft: number;
        for (i = 0, len = aChild.length; i < len; i++) {
            el = aChild[i];
            el.style.left = posLeft + "px";
            if (aVAlign == TParamVAlign.ECenter) {
                posTop = (aEl.offsetHeight - el.offsetHeight) / 2;
            } else if (aVAlign == TParamVAlign.EBottom) {
                posTop = aEl.offsetHeight - (aMargins.b + el.offsetHeight);
            }
            el.style.top = posTop + "px";
            posLeft += el.offsetWidth + aPadding;
        }

        if (aEl.offsetHeight == 0) {
            aEl.style.height = aMargins.t + aMaxHeight + aMargins.b + "px";
        }
        if (aEl.offsetWidth == 0) {
            aEl.style.width = width + 'px';
        }
    };

    export class CLayoutGroupControl extends CGroupControl {

        constructor(aElement: HTMLElement) {
            super(aElement);
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            var ret: HTMLElement[] = super._doDraw(aRect, aDrawParam);
            var i, len, e: HTMLElement, childEl = [];
            for (i = 0, len = this._child.length; i < len; i++) {
                childEl.push(this._child[i]._element);
            }
            FLayoutElement(this._element, childEl, this.getOrientation(), this.getChildVAlign(), this.getChildHAlign(), this.getMargins(), this.getPadding());

            if (this.getOrientation() == TParamOrientation.EHorizontal) {
                this._keyMapBuilder = KBuilderLeftRight;
            } else {
                this._keyMapBuilder = KBuilderTopDown;
            }

            return ret;
        }
    }

    export class CViewGroupControl extends CGroupControl {

        _container: HTMLElement;
        _containerPosForAni: { top: number; left: number; };
        _targetChild: CControl;

        private _drawnRect: TRect;

        constructor(aElement: HTMLElement) {
            super(aElement);
            this._element.classList.add("-view");
            this._element.style.overflow = "hidden";
            this._container = document.createElement("div");
            this._container.style.position = "absolute";
            this._container.style.top = "0px";
            this._container.style.left = "0px";
            this._element.appendChild(this._container);
            this._keyMapBuilder = KBuilderTopDown;
        }

        setOwnedChildControls(aChildControls: CControl[]) {
            if (aChildControls.length != 1) {
                throw "just single child supported";
            }
            this._targetChild = aChildControls[0];
            aChildControls.forEach((c) => {
                c.connectRedrawRequired(this, "_slRedrawRequired", this._slRedrawRequired);
            });
            super.setOwnedChildControls(aChildControls);
        }

        private _redrawTimer;
        protected _slRedrawRequired() {
            clearTimeout(this._redrawTimer);
            this._redrawTimer = setTimeout(() => {
                this.draw();
            }, 0);
        }

        setScrollScheme(aScheme: TParamScrollScheme, aFixedScrollUnit?: number) {
            aFixedScrollUnit = aFixedScrollUnit || this.getItemHeight() || this.getItemWidth();
            super.setScrollScheme(aScheme, aFixedScrollUnit);
            this._targetChild.setScrollScheme(aScheme, aFixedScrollUnit);
        }

        setVerticalScrollScheme(aScheme: TParamScrollScheme, aFixedScrollUnit?: number) {
            super.setVerticalScrollScheme(aScheme, aFixedScrollUnit);
            this._targetChild.setVerticalScrollScheme(aScheme, aFixedScrollUnit);
        }

        setHorizontalScrollScheme(aScheme: TParamScrollScheme, aFixedScrollUnit?: number) {
            super.setHorizontalScrollScheme(aScheme, aFixedScrollUnit);
            this._targetChild.setHorizontalScrollScheme(aScheme, aFixedScrollUnit);
        }

        setKeepFocus(aKeepFocus: boolean) {
            super.setKeepFocus(aKeepFocus);
            this._targetChild.setKeepFocus(aKeepFocus);
        }

        setViewSize(aRect: TRect) {
            this._element.style.left = aRect.left + "px";
            this._element.style.top = aRect.top + "px";
            this._element.style.height = aRect.getHeight() + "px";
            this._element.style.width = aRect.getWidth() + "px";
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            if (this._element.offsetWidth == 0 || this._element.offsetHeight == 0) {
                throw "drawing view group without size meaning-less";
            }
            var focusableElements: HTMLElement[] = [];
            var drawPosTop: number;
            var drawPosLeft: number;
            if (this.getAnimation() && this._getContainerPosForAni()) {
                drawPosTop = -this._getContainerPosForAni().top;
                drawPosLeft = -this._getContainerPosForAni().left;
                this._setContainerPosForAni(undefined);
            } else {
                drawPosTop = -this._container.offsetTop;
                drawPosLeft = -this._container.offsetLeft;
            }
            var drawRect: TRect = new TRect({
                top: drawPosTop,
                left: drawPosLeft,
                right: drawPosLeft + this._element.offsetWidth,
                bottom: drawPosTop + this._element.offsetHeight
            });
            var i, len, c: CControl, el: HTMLElement; // looping param
            var childRect: TRect = new TRect; // rectangle for child control
            var childSize: { width: number; height: number; }; // size of child control
            var drawRectForChild: TRect; // rectangle param for child control
            for (i = 0, len = this._child.length; i < len; i++) {
                c = this._child[i];
                el = c._element;
                el.style.top = childRect.top + "px";
                this._container.appendChild(el);
                childSize = c.getSize();
                childRect.setHeight(childSize.height);
                childRect.setWidth(childSize.width);
                var scrollSchemeVertical = this._getDrawParam(KParamStrScrollSchemeVertical);
                var scrollSchemeHorizontal = this._getDrawParam(KParamStrScrollSchemeHorizontal);
                if (scrollSchemeVertical === TParamScrollScheme.EByFocusRemainsRolling || scrollSchemeHorizontal === TParamScrollScheme.EByFocusRemainsRolling) {
                    drawRectForChild = drawRect;
                } else {
                    drawRectForChild = drawRect.getIntersectedRect(childRect);
                }
                c.draw(drawRectForChild || new TRect());
                if (c.isFocusable()) {
                    focusableElements.push(el);
                }
                childRect.moveTop(childRect.getHeight());
            }
            this._drawnRect = drawRect;
            return focusableElements;
        }

        private _getNextMove(aKeyStr: string, aControl: CControl): { top: number; left: number; } {
            var ret = {
                top: 0,
                left: 0
            };
            var contentAvail = aControl.getContentAvail();
            var size = this.getSize();
            if (contentAvail) {
                switch (aKeyStr) {
                    case KKeyStrUp:
                        if (contentAvail.up) {
                            ret.top = Math.min(contentAvail.up, size.height);
                        }
                        break;
                    case KKeyStrDown:
                        if (contentAvail.down) {
                            ret.top = -Math.min(contentAvail.down, size.height);
                        }
                        break;
                    case KKeyStrLeft:
                        if (contentAvail.left) {
                            ret.left = Math.min(contentAvail.left, size.width);
                        }
                        break;
                    case KKeyStrRight:
                        if (contentAvail.right) {
                            ret.left = -Math.min(contentAvail.right, size.width);
                        }
                        break;
                }
            }
            return ret;
        }

        private _setContainerPosForAni(aPosition: { top: number; left: number; }) {
            this._containerPosForAni = aPosition;
        }

        private _getContainerPosForAni(): { top: number; left: number; } {
            return this._containerPosForAni;
        }

        private _getContainerPos(): { top: number; left: number; } {
            var containerTop = this._container.offsetTop;
            var containerLeft = this._container.offsetLeft;
            return {
                top: containerTop,
                left: containerLeft
            };
        }

        doKey(aKeyStr: string, aParam?: any): boolean {
            if (this.isTransitioning()) {
                return true;
            }
            var handled: boolean = super.doKey(aKeyStr);
            if (!handled) {
                var focusedChild: CControl = this.getFocusedChild();
                focusedChild.updateContentAvail(aKeyStr, this._drawnRect);
                var increment = this._getNextMove(aKeyStr, focusedChild);
                if (increment.top || increment.left) {
                    this._handleViewMoved(this, increment);
                    var scrollScheme = this.getVerticalScrollScheme();
                    if ((aKeyStr == KKeyStrUp || aKeyStr == KKeyStrDown) && (scrollScheme == TParamScrollScheme.EByFocusRemains || scrollScheme == TParamScrollScheme.EByFocusRemainsRolling)) {
                        this.setKeepFocus(true);
                    }
                    this.moveDrawPosition(increment);
                    handled = true;
                }
            }
            return handled;
        }
        moveDrawPosition(aPosition: { top: number; left: number; }) {
            var contPos = this._getContainerPos();
            this.setDrawPosition({
                top: contPos.top + aPosition.top,
                left: contPos.left + aPosition.left
            });
        }
        initDrawPosition(aPosition?: { top: number; left: number; }) {
            var pos = (aPosition) ? aPosition : { top: 0, left: 0 };
            this._setContainerPosForAni(pos);
            this._container.style.top = pos.top + "px";
            this._container.style.left = pos.left + "px";
            this.draw();
        }
        setDrawPosition(aPosition: { top: number; left: number; }) {
            if (this.getAnimation()) {
                Util.afterTransition(this._container, () => {
                    this.setTransition(false);
                    this.draw();
                });
                this._setContainerPosForAni(aPosition);
                this.setTransition(true);
                this._container.style.top = aPosition.top + "px";
                this._container.style.left = aPosition.left + "px";
            } else {
                this._container.style.top = aPosition.top + "px";
                this._container.style.left = aPosition.left + "px";
                this.draw();
            }
        }
        setAnimation(aAnimation: boolean) {
            super.setAnimation(aAnimation);
            if (aAnimation) {
                this._container.style[KCssPropTransition] = KCssTransitionParamPos;
            }
        }
    }

    export class CListControl extends CViewGroupControl {
        private _listDataControl: CListDataControl;
        constructor(aElement: HTMLElement) {
            super(aElement);
            this._listDataControl = new CListDataControl(null);
            this.setOwnedChildControls([this._listDataControl]);
            this.setListData([]);
            this.connectItemInserted(this, "_slItemInserted", this._slItemInserted);
            this.connectItemRemoved(this, "_slItemRemoved", this._slItemRemoved);
        }
        destroy() {
            super.destroy();
        }
        setDataRolling(aRolling: boolean) {
            this._listDataControl.setDataRolling(aRolling);
        }
        getDataRolling() {
            return this._listDataControl.getDataRolling();
        }
        setItemHeight(aItemHeight: number) {
            super.setItemHeight(aItemHeight);
            this._listDataControl.setItemHeight(aItemHeight);
        }
        setItemWidth(aItemWidth: number) {
            super.setItemWidth(aItemWidth);
            this._listDataControl.setItemWidth(aItemWidth);
        }
        setOrientation(aLayout: TParamOrientation) {
            this._listDataControl._setDrawParam(KParamStrOrientation, aLayout, false);
        }
        setListData(aData: any[], aDataRolling?: boolean) {
            var bRolling = (aDataRolling) ? aDataRolling : false;
            this.setDataRolling(bRolling);
            this._listDataControl.setOwnedDataProvider(new CListDataProvider(aData, bRolling));
        }
        setOwnedDataProvider(aDataProvider: CListDataProvider) {
            this._listDataControl.setOwnedDataProvider(aDataProvider);
        }
        setDataDrawer(aDrawer: FDataDrawer) {
            this._listDataControl.setDataDrawer(aDrawer);
        }
        getFocusedElement(): HTMLElement {
            return this._listDataControl.getFocusedElement();
        }
        setFocusedItem(aKey: any) {
            this._listDataControl.setFocusedItem(aKey);
        }
        getListDataControl() {
            return this._listDataControl;
        }
        connectFocusChanged(aHolder: any, aSlotName: string, aSlot: FFocusChanged) {
            this._listDataControl.connectFocusChanged(aHolder, aSlotName, aSlot);
        }
        connectFocusGained(aHolder: any, aSlotName: string, aSlot: FFocusGained) {
            this._listDataControl.connectFocusGained(aHolder, aSlotName, aSlot);
        }
        connectFocusLost(aHolder: any, aSlotName: string, aSlot: FFocusLost) {
            this._listDataControl.connectFocusLost(aHolder, aSlotName, aSlot);
        }
        connectFocusedDataItemChanged(aHolder: any, aSlotName: string, aSlot: FFocusedDataItemChanged) {
            this._listDataControl.connectFocusedDataItemChanged(aHolder, aSlotName, aSlot);
        }
        connectDataItemSelected(aHolder: any, aSlotName: string, aSlot: FDataItemSelected) {
            this._listDataControl.connectDataItemSelected(aHolder, aSlotName, aSlot);
        }
        connectItemSelected(aHolder: any, aSlotName: string, aSlot: FItemSelected) {
            this._listDataControl.connectItemSelected(aHolder, aSlotName, aSlot);
        }
        connectItemInserted(aHolder: any, aSlotName: string, aSlot: FItemInserted) {
            this._listDataControl.connectItemInserted(aHolder, aSlotName, aSlot);
        }
        connectItemRemoved(aHolder: any, aSlotName: string, aSlot: FItemRemoved) {
            this._listDataControl.connectItemRemoved(aHolder, aSlotName, aSlot);
        }

        setRedrawAfterOperation(aRedraw: boolean) {
            this._listDataControl.setRedrawAfterOperation(aRedraw);
        }
        prependItem(aItem: any) {
            this._listDataControl.insertItem(0, aItem);
        }
        insertItem(position: number, aItem: any) {
            this._listDataControl.insertItem(position, [aItem]);
        }
        appendItem(aItem: any) {
            this._listDataControl.appendItem(aItem);
        }
        removeItem(index: number) {
            this._listDataControl.removeItems([index]);
        }
        removeItems(index: number[]) {
            this._listDataControl.removeItems(index);
        }

        /**
         * slot for item insert signal
         *
         * @param drawnElements inserted drawn items
         * @param aNeedFocus
         * @private
         */
        private _slItemInserted(drawnElements: CDrawnElements, aNeedFocus?: boolean) {
            var rect = this.getSize();
            var height = this._listDataControl.getItemHeight();
            var width = this._listDataControl.getItemWidth();
            var keys = Object.keys(drawnElements._drawnElements);
            var count = keys.length;
            var cut: number = 0;
            var removeEl: HTMLElement;

            if (width) {
                cut = count - (rect.width / width);
            } else if (height) {
                cut = count - (rect.height / height);
            }

            for (; cut > 0; cut--) {
                removeEl = drawnElements.pickElement('' + (count - cut));
                if (removeEl) {
                    Util.remove(removeEl);
                }
            }
            this._listDataControl._makeKeyMap(drawnElements.getElements(), false, false);
            if (aNeedFocus) {
                this._listDataControl._setActiveFocus(true);
            }
        }

        private _slItemRemoved(drawnElements: CDrawnElements, aUnsetFocus?: boolean) {
            //TODO: implement
            this._listDataControl._makeKeyMap(drawnElements.getElements(), false, false);
            if (aUnsetFocus) {
                this._listDataControl._setActiveFocus(false);
            }
        }
    }

    export class CGridControl extends CViewGroupControl {
        private _gridDataControl: CGridDataControl;
        constructor(aElement: HTMLElement) {
            super(aElement);
            this._gridDataControl = new CGridDataControl(null);
            this.setOwnedChildControls([this._gridDataControl]);
            this.setListData([]);
        }
        destroy() {
            this._gridDataControl.destroy();
            super.destroy();
        }
        // set draw param
        setMaxColCount(aMaxColCount: number) {
            this._gridDataControl.setMaxColCount(aMaxColCount);
        }
        setItemWidth(aItemWidth: number) {
            this._gridDataControl.setItemWidth(aItemWidth);
        }
        setItemHeight(aItemHeight: number) {
            this._gridDataControl.setItemHeight(aItemHeight);
        }
        // set data
        setListData(aData: any[]) {
            this._gridDataControl.setOwnedDataProvider(new CListDataProvider(aData, false));
        }
        setOwnedDataProvider(aDataProvider: CListDataProvider) {
            this._gridDataControl.setOwnedDataProvider(aDataProvider);
        }
        // set drawer
        setDataDrawer(aDrawer: FDataDrawer) {
            this._gridDataControl.setDataDrawer(aDrawer);
        }
        // connect event
        connectFocusChanged(aHolder: any, aSlotName: string, aSlot: FFocusChanged) {
            this._gridDataControl.connectFocusChanged(aHolder, aSlotName, aSlot);
        }
        connectItemSelected(aHolder: any, aSlotName: string, aSlot: FItemSelected) {
            this._gridDataControl.connectItemSelected(aHolder, aSlotName, aSlot);
        }
    }

    export class CDrawingControl extends CViewGroupControl {
        private _drawingDataControl: CDrawingDataControl;
        constructor(aElement: HTMLElement) {
            super(aElement);
            this._drawingDataControl = new CDrawingDataControl(null);
            this.setOwnedChildControls([this._drawingDataControl]);
        }
        destroy() {
            this._drawingDataControl.destroy();
            super.destroy();
        }
        setItemHeight(aItemHeight: number) {
            this._drawingDataControl.setItemHeight(aItemHeight);
        }

        setOwnedDataProvider(aDataProvider: CDrawingDataProvider) {
            this._drawingDataControl.setOwnedDataProvider(aDataProvider);
        }

        setCurrentRowIndex(aRowIndex: number) {
            this._drawingDataControl.setCurrentRow(aRowIndex);
        }

        getCurrentRowIndex(): number {
            return this._drawingDataControl.getCurrentRow();
        }

        // set drawer
        setDataDrawer(aDrawer: FDataDrawer) {
            this._drawingDataControl.setDataDrawer(aDrawer);
        }

        getFirstElementByRow(aIndex: number) {
            return this._drawingDataControl.getFirstElementByRow(aIndex);
        }

        clearDrawnElements() {
            this._drawingDataControl.clearDrawnElements();
        }

        // connect event
        connectFocusChanged(aHolder: any, aSlotName: string, aSlot: FFocusChanged) {
            this._drawingDataControl.connectFocusChanged(aHolder, aSlotName, aSlot);
        }
        connectItemSelected(aHolder: any, aSlotName: string, aSlot: FItemSelected) {
            this._drawingDataControl.connectItemSelected(aHolder, aSlotName, aSlot);
        }
        connectRowIndexChanged(aHolder: any, aSlotName: string, aSlot: FRowIndexChanged) {
            this._drawingDataControl.connectRowIndexChanged(aHolder, aSlotName, aSlot);
        }
    }

    export interface TCreateLayerParam {
        addClass?: string;
        transition?: {
            custom?: {
                fnCreate: (aPrevLayer: HTMLElement, aNewLayer: HTMLElement) => Function;
                fnRemove: (aPrevLayer: HTMLElement, aNewLayer: HTMLElement) => Function;
            };
            prevLayer?: string;
            newLayer?: string;
            fnAfterTransition?: Function;
        };
    }

    interface TLayerInfo {
        createParam: TCreateLayerParam;
        elLayer: HTMLElement;
        keyMap: CKeyMap;
        keyMapBuilder: FKeyMapBuilder;
        childControls: CControl[];
    }

    export class CLayeredGroupControl extends CGroupControl {
        private _layerInfoStack: TLayerInfo[] = [];
        private _createParam: TCreateLayerParam;
        private _elLayer: HTMLElement;
        constructor(aElement: HTMLElement) {
            super(aElement);
            this.addClass("-layered");
        }
        destroy() {
            var i, iLen, layerInfo: TLayerInfo, j, jLen, controls: CControl[];
            for (i = 0, iLen = this._layerInfoStack.length; i < iLen; i++) {
                layerInfo = this._layerInfoStack[i];
                controls = layerInfo.childControls;
                for (j = 0, jLen = controls.length; j < jLen; j++) {
                    controls[j].destroy();
                }
                Util.remove(layerInfo.elLayer);
            }
            this._layerInfoStack = null;
            super.destroy();
        }

        getLayoutElement(aClassName: string) {
            var ret: HTMLElement;
            var elements: NodeList = this._elLayer.getElementsByClassName(aClassName);
            if (elements.length == 1) {
                ret = <HTMLElement> elements.item(0);
            } else if (elements.length == 0) {
                ret = document.createElement("div");
                ret.classList.add(aClassName);
                this._elLayer.appendChild(ret);
            } else {
                throw "Layout element duplicated";
            }
            return ret;
        }

        getCurrentLayerElement(): HTMLElement {
            return this._elLayer;
        }

        createLayer(aParam: TCreateLayerParam = {}): HTMLElement {
            var elLayerPrev = this._elLayer;
            if (this._elLayer) {
                this._layerInfoStack.push({
                    createParam: this._createParam,
                    elLayer: this._elLayer,
                    keyMap: this._keyMap,
                    keyMapBuilder: this._keyMapBuilder,
                    childControls: this._child
                });
                this._createParam = null;
                this._elLayer = null;
                this._keyMap = null;
                this._child = [];
            }

            var elLayer = document.createElement("div");
            elLayer.classList.add("-layer");
            elLayer.style.position = "absolute";
            elLayer.style.width = "inherit";
            elLayer.style.height = "inherit";

            if (aParam.addClass) {
                elLayer.classList.add(aParam.addClass);
            }

            var executeNext: Function[] = [];
            if (aParam.transition) {
                this.setTransition(true);
                if (aParam.transition.custom) {
                    executeNext.push(aParam.transition.custom.fnCreate(elLayerPrev, elLayer));
                } else {
                    if (elLayerPrev) {
                        switch (aParam.transition.prevLayer) {
                            case "fadeOut":
                                elLayerPrev.style.transition = KCssTransitionParamOpa;
                                executeNext.push(() => {
                                    elLayerPrev.style.opacity = "0";
                                });
                                break;
                            case "moveLeft":
                                elLayerPrev.style.transition = KCssTransitionParamPos;
                                executeNext.push(() => {
                                    elLayerPrev.style.left = -this._element.offsetWidth + "px";
                                });
                                break;
                        }
                    }
                    switch (aParam.transition.newLayer) {
                        case "fadeIn":
                            elLayer.style.opacity = "0";
                            elLayer.style.transition = KCssTransitionParamOpa;
                            executeNext.push(() => {
                                elLayer.style.opacity = "1";
                            });
                            break;
                        case "moveLeft":
                            elLayer.style.transition = KCssTransitionParamPos;
                            elLayer.style.left = this._element.offsetWidth + "px";
                            executeNext.push(() => {
                                elLayer.style.left = "0px";
                            });
                            break;
                    }
                }
                Util.afterTransition(elLayer, () => {
                    this.setTransition(false);
                    if (aParam.transition.fnAfterTransition) {
                        aParam.transition.fnAfterTransition();
                    }
                });
            }

            this._element.appendChild(elLayer);
            this._elLayer = elLayer;
            this._createParam = aParam;

            if (executeNext.length) {
                setTimeout(() => {
                    var i, len;
                    for (i = 0, len = executeNext.length; i < len; i++) {
                        executeNext[i]();
                    }
                }, 1);
            }
            return elLayer;
        }

        removeLayer() {
            var prevChild = this._child;
            var prevElLayer = this._elLayer;
            var prevCreateParam = this._createParam;

            var destroy = () => {
                var i, len, control: CControl;
                for (i = 0, len = prevChild.length; i < len; i++) {
                    control = prevChild[i];
                    control.destroy();
                }
                Util.remove(prevElLayer);
                prevChild = null;
                prevElLayer = null;
                prevCreateParam = null;
            };

            this._child = [];
            if (this._keyMap) {
                this._keyMap.destroy();
            }
            this._keyMap = null;
            this._elLayer = null;

            var layerInfo: TLayerInfo = this._layerInfoStack.pop();

            if (layerInfo) {
                this._child = layerInfo.childControls;
                this._keyMap = layerInfo.keyMap;
                this._keyMapBuilder = layerInfo.keyMapBuilder;
                this._elLayer = layerInfo.elLayer;
                this._elLayer.classList.remove("-stacked");
                this._createParam = layerInfo.createParam;

                var transitionParam = prevCreateParam.transition;
                if (transitionParam) {

                    if (transitionParam.custom) {
                        transitionParam.custom.fnRemove(prevElLayer, this._elLayer);
                    } else {
                        switch (transitionParam.prevLayer) {
                            case "fadeOut":
                                this._elLayer.style.opacity = "1";
                                break;
                            case "moveLeft":
                                this._elLayer.style.left = "0px";
                                break;
                        }
                        switch (transitionParam.newLayer) {
                            case "fadeIn":
                                prevElLayer.style.opacity = "0";
                                break;
                            case "moveLeft":
                                prevElLayer.style.left = this._element.offsetWidth + "px";
                                break;
                        }
                    }

                    this.setTransition(true);
                    Util.afterTransition(prevElLayer, () => {
                        destroy();
                        this.setTransition(false);
                    });
                } else {
                    destroy();
                }
            } else {
                destroy();
            }

        }

        draw(aRect?: TRect) {
            super.draw(aRect);
            this.setActiveFocus();
        }

        _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }) {
            if (!this._elLayer) {
                throw "Layer must be created before draw";
            }
            return this._doDrawCommon(this._elLayer, aRect, aDrawParam);
        }

        createLayoutControl(aItemDrawers: FItemDrawer[]): CLayoutControl {
            if (!this._elLayer) {
                throw "Layer must be created before set controls";
            }
            this._keyMapBuilder = KBuilderTopDown;
            var layoutControl = new CLayoutControl(null);
            layoutControl.setItemDrawers(aItemDrawers);
            this.setOwnedChildControls([layoutControl]);
            return layoutControl;
        }

        createLayoutGroupControl(aControls: CControl[]): CLayoutGroupControl {
            if (!this._elLayer) {
                throw "Layer must be created before set controls";
            }
            this._keyMapBuilder = KBuilderTopDown;
            var layoutGroupControl = new CLayoutGroupControl(null);
            layoutGroupControl.setOwnedChildControls(aControls);
            this.setOwnedChildControls([layoutGroupControl]);
            return layoutGroupControl;
        }

        setControl(aControl: CControl) {
            if (!this._elLayer) {
                throw "Layer must be created before set controls";
            }
            this._keyMapBuilder = KBuilderTopDown;
            this.setOwnedChildControls([aControl]);
        }
    }

    export interface TViewItem {
        index: number;
        data: any;
    }

    export class CViewItemResult {
        items: TViewItem[] = [];
        firstAvailIndex(): number {
            var i: number;
            for (i = 0 ; i < this.items.length ; i += 1) {
                if (this.items[i]) return i;
            }
            return -1;
        }
        lastAvailIndex(): number {
            var i: number;
            for (i = this.items.length - 1 ; i >= 0 ; i -= 1) {
                if (this.items[i]) return i;
            }
            return -1;
        }
    }

    export class CCircularArray {
        _array: any;
        _idxCur: number;
        _idxLast: number;
        constructor(aArray: any) {
            if (aArray) {
                this.setArray(aArray);
            }
        }
        getArray(): any {
            return this._array;
        }
        setArray(aArray: any): void {
            this._array = aArray;
            this._idxCur = 0;
            this._idxLast = aArray.length - 1;
        }
        appendArray(aArray: any): void {
            this._array.concat(aArray);
            this._idxLast = aArray.length - 1;
        }
        cur(): number {
            return this._idxCur;
        }
        curItem(): any {
            return this._array[this._idxCur];
        }
        setCur(aIndex: number): void {
            this._idxCur = this.indexing(aIndex);
        }
        inc(aCount: number): void {
            this._idxCur = this.indexing(this._idxCur + aCount);
        }
        dec(aCount: number): void {
            this._idxCur = this.indexing(this._idxCur - aCount);
        }
        indexing(aIndex: number): number {
            return aIndex >= 0 ? aIndex % this._array.length : this._array.length + aIndex % this._array.length;
        }
        at(aIndex: number): any {
            return aIndex >= 0 ? this._array[aIndex % this._array.length] : this._array[this._array.length + aIndex % this._array.length];
        }
        getViewItems(aCount: number, aOffset: number): CViewItemResult {
            var ret = new CViewItemResult();
            var len = this._array.length;
            var i: number;

            if (aCount > len) {
                var halfCount = Math.floor(len / 2);
                var centering = halfCount <= aOffset && halfCount <= aCount - aOffset;
                var start, index;

                for (i = 0 ; i < aCount; i += 1) {
                    ret.items.push(null);
                }
                if (centering) {
                    start = aOffset - halfCount;
                    for (i = 0 ; i < len ; i += 1) {
                        index = this.indexing(this._idxCur - halfCount + i);
                        ret.items[i + start] = {
                            index: index,
                            data: this._array[index]
                        }
                    }
                } else if (len - 1 <= aOffset) { // has enough space in upper index.
                    start = aOffset - len - 1;
                    for (i = 0 ; i < len ; i += 1) {
                        index = this.indexing(this._idxCur + i + 1);
                        ret.items[i + start] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                } else if (len <= aCount - aOffset) { // has enough space in lower index.
                    start = aOffset;
                    for (i = 0 ; i < len ; i += 1) {
                        index = this.indexing(this._idxCur + i);
                        ret.items[i + start] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                } else {
                    for (i = 0 ; i < len ; i += 1) {
                        index = this.indexing(this._idxCur - aOffset + i);
                        ret.items[i] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                }
            }
            else {
                for (i = 0 ; i < aCount ; i += 1) {
                    index = this.indexing(this._idxCur - aOffset + i);
                    ret.items.push({
                        index: index,
                        data: this._array[index]
                    });
                }
            }
            return ret;
        }
        del(aIndex: number): void {
            var compromised = this.indexing(aIndex);
            if (isNaN(compromised)) {
                return;
            }
            this._array.splice(compromised, 1);
        }
        each(aFn: Function, aOffset: number): void {
            var index = aOffset ? this.indexing(this._idxCur + aOffset) : this._idxCur;
            var need = false;
            do {
                need = aFn(index, this.at(index));
                index = this.indexing(index + 1);
            } while (need && index != this._idxCur);
        }
        eachReverse(aFn: Function): void {
            var index = this._idxCur;
            var need = false;
            do {
                need = aFn(index, this.at(index));
                index = this.indexing(index - 1);
            } while (need && index != this._idxCur);
        }
        eachArray(aFn: Function): void {
            var index = this._idxCur;
            var need = false;
            do {
                if (index < this._array.length) {
                    need = aFn(index, this.at(index));
                } else {
                    need = aFn(-1, undefined);
                }
                index += 1;
            } while (need);
        }
        length(): number {
            var ret = 0;
            if (this._array) {
                ret = this._array.length;
            }
            return ret;
        }
        clone(): CCircularArray {
            var ret = new CCircularArray(this._array);
            ret.setCur(this._idxCur);
            return ret;
        }
    }

    export interface FCarouselDataDrawer {
        (aElement: HTMLElement, aItem: any, aIndex: number): void;
    }
    export interface FCarouselAnchorDrawer {
        (aElement: HTMLElement, aItem: any, aIndex: number): void;
    }
    export interface FCarouselCurrentItemChanged {
        (aElement: HTMLElement, aItem: any, aIndex: number): void;
    }
    export interface FCarouselStartToChange {
        (aElement: HTMLElement, aItem: any, aIndex: number): void;
    }

    export class CCarouselControl extends CControl {
        static KClassCarousel = "-carousel";
        static KClassAnchor = "-carousel-anchor";
        static KClassItem = "-carousel-item";
        static KClassDistPrefix = "-carousel-dist";
        static KClassUpper = "-upper";
        static KClassLower = "-lower";
        static KSelectorItem = ".-carousel-item";

        _dataDrawer: FCarouselDataDrawer;
        _anchorDrawer: FCarouselAnchorDrawer;
        _anchorBackground: boolean;
        _cirMenuItems: CCircularArray;
        _dataChanged: boolean;
        _upperBoundHeight: number;
        _upperBoundWidth: number;
        _upperBoundEl: HTMLElement;
        _lowerBoundTop: number;
        _lowerBoundHeight: number;
        _lowerBoundWidth: number;
        _lowerBoundLeft: number;
        _lowerBoundEl: HTMLElement;
        _height: number;
        _width: number;
        _anchorEl: HTMLElement;
        _keyQueue = [];
        fnSafeUpdate: Function;

        constructor(aElement: HTMLElement) {
            super(aElement);
            this._element.classList.add(CCarouselControl.KClassCarousel);
            this._element.style.overflow = "hidden";
            this.setOrientation(TParamOrientation.EVertical);
            this.registerSignal(["CurrentItemChanged", "StartToChange"]);
        }
        connectCurrentItemChanged(aHolder: any, aSlotName: string, aHandler: FCarouselCurrentItemChanged) {
            this.connect("CurrentItemChanged", aHolder, aSlotName);
        }
        private _emitCurrentItemChanged(aElement: HTMLElement, aItem: any, aIndex: number) {
            this.emit.call(this, "CurrentItemChanged", aElement, aItem, aIndex);
        }
        connectStartToChange(aHolder: any, aSlotName: string, aHandler: FCarouselStartToChange) {
            this.connect("StartToChange", aHolder, aSlotName);
        }
        private _emitStartToChange(aElement: HTMLElement, aItem: any, aIndex: number) {
            this.emit.call(this, "StartToChange", aElement, aItem, aIndex);
        }
        setDataDrawer(aDrawer: FCarouselDataDrawer) {
            this._dataDrawer = aDrawer;
        }
        setAnchorDrawer(aAnchorDrawer: FCarouselAnchorDrawer, aBackground?: boolean) {
            this._anchorDrawer = aAnchorDrawer;
            if (aBackground) {
                this._anchorBackground = aBackground;
            }
        }
        getAnchorElement(): HTMLElement {
            return this._anchorEl;
        }
        setData(aMenuItems: any[]) {
            if (this._cirMenuItems) {
                this._cirMenuItems = null;
            }
            this._cirMenuItems = new CCircularArray(aMenuItems);
            this._dataChanged = true;
        }
        getCurrentIndex(): number {
            return this._cirMenuItems.cur();
        }
        getCurrentItem(): any {
            return this._cirMenuItems.curItem();
        }
        setCurrentIndex(aIndex: number) {
            if (aIndex < 0 || this._cirMenuItems.length() <= aIndex) {
                throw "CCarouselControl OUT OF BOUNDS";
            }
            this._cirMenuItems.setCur(aIndex);
            this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
        }
        getCurrentViewingItemInfos(): { item: any; index: number; el: HTMLElement; }[] {
            var viewCount = this.getViewCount();
            var anchorIndex = this.getAnchorIndex();
            var result = this._cirMenuItems.getViewItems(viewCount, anchorIndex);
            var ret: any = [], i, item, element = this._element, itemEl;
            for (i = 0; i < result.items.length; i += 1) {
                item = result.items[i];
                if (item) {
                    itemEl = this._element.querySelector('.' + CCarouselControl.KClassItem + '[data="' + item.index + '"]');
                    ret.push({
                        item: item.data,
                        index: item.index,
                        el: itemEl ? itemEl : null
                    });
                } else {
                    ret.push(null);
                }
            }
            return ret;
        }
        safeUpdate (fnUpdate: Function) {
            if (this.isTransitioning()) {
                this.fnSafeUpdate = fnUpdate;
            } else {
                fnUpdate();
            }
        }
        private _drawItem(aItemEl: HTMLElement, aItem: any, aIndex: number) {
            if (this._dataDrawer) {
                this._dataDrawer(aItemEl, aItem, aIndex);
            } else {
                aItemEl.innerHTML = aItem;
            }
        }
        private _createItem(aItem: { index: number; data: any; }, aTop: number, aClassName?: string): HTMLElement {
            var orientation: TParamOrientation = this.getOrientation();
            var animation: boolean = this.getAnimation();
            var useUserAnimationCSS: boolean = this.getUseUserAnimationCSS();
            var animationInterval = this.getAnimationInterval();
            if (!animationInterval) {
                animationInterval = 0.3;
            }

            //var classNames = aClassName ? ['-carousel-item', aClassName] : ['-carousel-item'];
            var classNames: string[] = [CCarouselControl.KClassItem];
            if (aClassName) {
                classNames.push(aClassName);
            }
            var itemEl = document.createElement('div');
            itemEl.style.position = "absolute";
            var i, len;
            for (i = 0, len = classNames.length; i < len; i += 1) {
                itemEl.classList.add(classNames[i]);
            }
            if (orientation === TParamOrientation.EHorizontal) {
                if (animation && !useUserAnimationCSS) {
                    itemEl.style.transition = 'left ' + animationInterval + 's linear';
                }
                itemEl.style.left = aTop + 'px';
            } else {
                if (animation && !useUserAnimationCSS) {
                    itemEl.style.transition = 'top ' + animationInterval + 's linear';
                }
                itemEl.style.top = aTop + 'px';
            }
            if (aItem) {
                this._drawItem(itemEl, aItem.data, aItem.index);
            }
            return itemEl;
        }
        /*protected*/ _doDraw(aRect: TRect, aDrawParam: { [key: string]: any; }): HTMLElement[] {
            var ret: HTMLElement[];
            this.setTransition(false);
            if (this._dataChanged) {
                if (this.getOrientation() == TParamOrientation.EHorizontal) {
                    this._keyMapBuilder = KBuilderLeftRight;
                } else {
                    this._keyMapBuilder = KBuilderTopDown;
                }
                this._doDrawItems();
            }
            ret = [this._anchorEl];
            return ret;
        }
        private _doDrawItems(): HTMLElement {
            var align: TParamOrientation = this.getOrientation();
            var menuLen: number = this._cirMenuItems.length();
            var viewCount: number = this.getViewCount();
            var itemWidth: number = this.getItemWidth();
            var itemHeight: number = this.getItemHeight();
            var anchorIndex: number = this.getAnchorIndex();
            var startIndex: number = this.getStartIndex();
            var transparentAnchor: boolean = this.getTransparentAnchor();
            var drawEffect: string = this.getDrawEfect();
            var drawnItems: any = [];
            var i: number;

            if (!viewCount) {
                throw "setViewCount required";
            }

            if (align == TParamOrientation.EVertical) {
                var anchorHeight: number = this.getAnchorHeight();
                var anchorTop: number = anchorIndex * itemHeight;
                if (!itemHeight) {
                    throw "setItemHeight required";
                }
                if (!anchorHeight) {
                    anchorHeight = itemHeight;
                }
            } else {
                var anchorWidth: number = this.getAnchorWidth();
                var anchorLeft: number = anchorIndex * itemWidth;
                if (!itemWidth) {
                    throw "setItemWidth required";
                }
                if (!anchorWidth) {
                    anchorWidth = itemWidth;
                }
            }

            this._element.innerText = '';
            this._cirMenuItems.setCur(startIndex);
            if (transparentAnchor) {
                this._upperBoundEl = document.createElement('div');
                this._upperBoundEl.style.position = 'absolute';
                this._upperBoundEl.style.overflow = 'hidden';
                this._lowerBoundEl = document.createElement('div');
                this._lowerBoundEl.style.position = 'absolute';
                this._lowerBoundEl.style.overflow = 'hidden';
                if (align == TParamOrientation.EVertical) {
                    this._upperBoundHeight = anchorIndex * itemHeight;
                    this._upperBoundEl.style.width = itemWidth + 'px';
                    this._upperBoundEl.style.height = this._upperBoundHeight + 'px';
                    this._lowerBoundTop = anchorIndex * itemHeight + anchorHeight;
                    this._lowerBoundHeight = (viewCount - anchorIndex - 1) * itemHeight;
                    this._lowerBoundEl.style.top = this._lowerBoundTop + 'px';
                    this._lowerBoundEl.style.width = itemWidth + 'px';
                    this._lowerBoundEl.style.height = this._lowerBoundHeight + 'px';
                } else {
                    this._upperBoundWidth = anchorIndex * itemWidth;
                    this._upperBoundEl.style.height = itemHeight + 'px';
                    this._upperBoundEl.style.width = this._upperBoundWidth + 'px';
                    this._lowerBoundLeft = anchorIndex * itemWidth + anchorWidth;
                    this._lowerBoundWidth = (viewCount - anchorIndex - 1) * itemWidth;
                    this._lowerBoundEl.style.left = this._lowerBoundLeft + 'px';
                    this._lowerBoundEl.style.height = itemHeight + 'px';
                    this._lowerBoundEl.style.width = this._lowerBoundWidth + 'px';
                }
                this._element.appendChild(this._upperBoundEl);
                this._element.appendChild(this._lowerBoundEl);
            }

            /*
             * Make draw info for each items
             */
            var result = this._cirMenuItems.getViewItems(viewCount, anchorIndex);
            var parentEl: HTMLElement = null;
            var drawInfos: { position: number; parentEl: HTMLElement; positionStart: number; }[] = [];
            var nextPosition: number = 0;
            var itemPosition: number = 0;
            if (align == TParamOrientation.EVertical) {
                var itemPositionStart: number = anchorTop;
            } else {
                var itemPositionStart: number = anchorLeft;
            }

            for (i = 0; i < result.items.length; i+= 1) {
                if (transparentAnchor) {
                    if (i <= anchorIndex) {
                        parentEl = this._upperBoundEl;
                        itemPosition = nextPosition;
                        if (align == TParamOrientation.EVertical) {
                            itemPositionStart = this._upperBoundHeight;
                        } else {
                            itemPositionStart = this._lowerBoundWidth;
                        }
                    } else if (anchorIndex < i) {
                        parentEl = this._lowerBoundEl;
                        if (align == TParamOrientation.EVertical) {
                            itemPosition = nextPosition - this._lowerBoundTop;
                            itemPositionStart = -itemHeight;
                        } else {
                            itemPosition = nextPosition - this._lowerBoundLeft;
                            itemPositionStart = -itemWidth;
                        }
                    }
                } else {
                    parentEl = this._element;
                    itemPosition = nextPosition;
                }
                drawInfos.push({
                    position: itemPosition,
                    parentEl: parentEl,
                    positionStart: itemPositionStart
                });
                if (align == TParamOrientation.EVertical) {
                    nextPosition += i === anchorIndex ? anchorHeight : itemHeight;
                } else {
                    nextPosition += i == anchorIndex ? anchorWidth : itemWidth;
                }
            }
            for (i = 0; i < drawInfos.length; i++) {
                var item = result.items[i];
                var diff = i - anchorIndex;
                var dist = Math.abs(diff);
                var distClassName = CCarouselControl.KClassDistPrefix + dist;
                var drawInfo = drawInfos[i];
                var itemEl = null;
                if (drawInfo.parentEl) {
                    if (drawEffect == 'spreadOut') {
                        itemEl = this._createItem(item, drawInfo.positionStart, distClassName);
                    } else {
                        itemEl = this._createItem(item, drawInfo.position, distClassName);
                    }
                    if (diff !== 0) {
                        if (diff < 0) {
                            itemEl.classList.add(CCarouselControl.KClassUpper);
                        } else {
                            itemEl.classList.add(CCarouselControl.KClassLower);
                        }
                    }
                    drawInfo.parentEl.appendChild(itemEl);
                }
                drawnItems.push(itemEl);
            }
            if (drawEffect == 'spreadOut') {
                setTimeout(() => {
                    for (i = 0; i < drawInfos.length; i++) {
                        if (drawnItems[i]) {
                            if (align == TParamOrientation.EVertical) {
                                drawnItems[i].style.top = drawInfos[i].position + 'px';
                            } else {
                                drawnItems[i].style.left = drawInfos[i].position + 'px';
                            }
                        }
                    }
                }, 1);
            }

            var anchorEl = document.createElement('div');
            anchorEl.classList.add(CCarouselControl.KClassAnchor);
            anchorEl.style.position = 'absolute';
            if (align == TParamOrientation.EVertical) {
                anchorEl.style.top = anchorTop + 'px';
                //anchorEl.style.height = anchorHeight + 'px';
                //anchorEl.style.width = itemWidth + 'px';
            } else {
                anchorEl.style.left = anchorLeft + 'px';
                //anchorEl.style.width = anchorWidth + 'px';
                //anchorEl.style.height = itemHeight + 'px';
            }

            if (this._anchorDrawer) {
                this._anchorDrawer(anchorEl, result.items[anchorIndex].data, result.items[anchorIndex].index);
            }
            if (this._anchorBackground) {
                Util.prepend(this._element, anchorEl);
            } else {
                this._element.appendChild(anchorEl);
            }

            this._anchorEl = anchorEl;
            if (align == TParamOrientation.EVertical) {
                this._height = anchorHeight + (itemHeight * (viewCount - 1));
                this._element.style.height = this._height + 'px';
            } else {
                this._width = anchorWidth + (itemWidth * (viewCount - 1));
                this._element.style.width = this._width + 'px';
            }

            if (this._dataChanged) {
                this._dataChanged = false;
                this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
            }
            return this._element;
        }
        private _moveItemsLeftward(aItemsEl: NodeList, aItemWidth: number, aAnchorIndex: number, aIndexOffset: number, aAnchorWidth: number) {
            var nextLeft = 0, i;
            for (i = 0; i < aItemsEl.length; i += 1) {
                var itemEl: HTMLElement = <HTMLElement> aItemsEl[i];
                var itemIndex = i + aIndexOffset;
                var prevDiff = itemIndex - 1 - aAnchorIndex;
                var prevDist = Math.abs(prevDiff);
                var prevDirection = prevDiff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var prevDistClassName = CCarouselControl.KClassDistPrefix + prevDist;
                var diff = itemIndex - aAnchorIndex;
                var dist = Math.abs(diff);
                var direction = diff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var distClassName = CCarouselControl.KClassDistPrefix + dist;
                itemEl.style.left = nextLeft + 'px';
                itemEl.classList.remove(prevDistClassName);
                itemEl.classList.add(distClassName);
                if (diff === 0) {
                    itemEl.classList.remove(prevDirection);
                } else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextLeft += (aAnchorWidth && itemIndex == aAnchorIndex) ? aAnchorWidth : aItemWidth;
            }
        }
        private _moveItemsRightward(aItemsEl: NodeList, aItemWidth: number, aAnchorIndex: number, aIndexOffset: number, aAnchorWidth: number) {
            var nextLeft = -aItemWidth, i;
            for (i = 0; i < aItemsEl.length; i += 1) {
                var itemEl: HTMLElement = <HTMLElement> aItemsEl[i];
                var itemIndex = i + aIndexOffset;
                var prevDiff = itemIndex + 1 - aAnchorIndex;
                var prevDist = Math.abs(prevDiff);
                var prevDirection = prevDiff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var prevDistClassName = CCarouselControl.KClassDistPrefix + prevDist;
                var diff = itemIndex - aAnchorIndex;
                var dist = Math.abs(diff);
                var direction = diff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var distClassName = CCarouselControl.KClassDistPrefix + dist;
                itemEl.style.left = nextLeft + 'px';
                itemEl.classList.remove(prevDistClassName);
                itemEl.classList.add(distClassName);
                if (diff === 0) {
                    itemEl.classList.remove(prevDirection);
                } else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextLeft += (aAnchorWidth && itemIndex == aAnchorIndex) ? aAnchorWidth : aItemWidth;
            }
        }
        private _moveItemsDownward(aItemsEl: NodeList, aItemHeight: number, aAnchorIndex: number, aIndexOffset: number, aAnchorHeight: number) {
            var nextTop = 0;
            var i, len;
            for (i = 0, len = aItemsEl.length; i < len; i += 1) {
                var itemEl: HTMLElement = <HTMLElement> aItemsEl[i];
                var itemIndex = i + aIndexOffset;
                var prevDiff = itemIndex - 1 - aAnchorIndex;
                var prevDist = Math.abs(prevDiff);
                var prevDirection = prevDiff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var prevDistClassName = CCarouselControl.KClassDistPrefix + prevDist;
                var diff = itemIndex - aAnchorIndex;
                var dist = Math.abs(diff);
                var direction = diff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var distClassName = CCarouselControl.KClassDistPrefix + dist;
                itemEl.style.top = nextTop + 'px';
                itemEl.classList.remove(prevDistClassName);
                itemEl.classList.add(distClassName);
                if (diff === 0) {
                    itemEl.classList.remove(prevDirection);
                } else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextTop += (aAnchorHeight && itemIndex === aAnchorIndex) ? aAnchorHeight : aItemHeight;
            }
        }
        private _moveItemsUpward(aItemsEl: NodeList, aItemHeight: number, aAnchorIndex: number, aIndexOffset: number, aAnchorHeight: number) {
            var nextTop = -aItemHeight;
            var i, len;
            for (i = 0, len = aItemsEl.length; i < len; i += 1) {
                var itemEl: HTMLElement = <HTMLElement> aItemsEl[i];
                var itemIndex = i + aIndexOffset;
                var prevDiff = itemIndex + 1 - aAnchorIndex;
                var prevDist = Math.abs(prevDiff);
                var prevDirection = prevDiff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var prevDistClassName = CCarouselControl.KClassDistPrefix + prevDist;
                var diff = itemIndex - aAnchorIndex;
                var dist = Math.abs(diff);
                var direction = diff < 0 ? CCarouselControl.KClassUpper : CCarouselControl.KClassLower;
                var distClassName = CCarouselControl.KClassDistPrefix + dist;
                itemEl.style.top = nextTop + 'px';
                itemEl.classList.remove(prevDistClassName);
                itemEl.classList.add(distClassName);
                if (diff === 0) {
                    itemEl.classList.remove(prevDirection);
                } else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextTop += (aAnchorHeight && itemIndex === aAnchorIndex) ? aAnchorHeight : aItemHeight;
            }
        }
        private _handleTransitionEnd() {
            this.setTransition(false);
            if (this.fnSafeUpdate) {
                this.fnSafeUpdate();
                this.fnSafeUpdate = null;
                this._keyQueue = [];
            } else {
                if (this._keyQueue.length) {
                    this[this._keyQueue.shift()]();
                } else {
                    this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
                }
            }
        }
        private _doTransitionAndAfter(aTargetEl: HTMLElement, aFnAfter: Function) {
            Util.afterTransition(aTargetEl, () => {
                this.setTransition(false);
                aFnAfter();
                this._handleTransitionEnd();
            });
        }
        private _update2(aDown: boolean) {
            var menuLen: number = this._cirMenuItems.length();
            var itemHeight: number = this.getItemHeight();
            var itemWidth: number = this.getItemWidth();
            var anchorHeight: number = this.getAnchorHeight();
            var anchorWidth: number = this.getAnchorWidth();
            var anchorIndex: number = this.getAnchorIndex();
            var transparentAnchor: boolean = this.getTransparentAnchor();
            var align: TParamOrientation = this.getOrientation();
            var itemOffset: number;
            var anchorOffset: number;
            var fnMoveItemUpper, fnMoveItemlower;

            if (align == TParamOrientation.EVertical) {
                itemOffset = itemHeight;
                anchorOffset = anchorHeight;
                fnMoveItemUpper = this._moveItemsUpward;
                fnMoveItemlower = this._moveItemsDownward;
            } else {
                itemOffset = itemWidth;
                anchorOffset = anchorWidth;
                fnMoveItemUpper = this._moveItemsRightward;
                fnMoveItemlower = this._moveItemsLeftward;
            }
            if (transparentAnchor) {
                var upperItemsEl = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                var lowerItemsEl = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                if (aDown) {
                    fnMoveItemUpper(upperItemsEl, itemOffset, anchorIndex, -1);
                    fnMoveItemUpper(lowerItemsEl, itemOffset, anchorIndex, anchorIndex);
                    if (lowerItemsEl.length) {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[0]);
                        lowerItemsEl[0].parentNode.removeChild(lowerItemsEl[0]);
                    } else {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[0]);
                    }
                } else {
                    fnMoveItemlower(upperItemsEl, itemOffset, anchorIndex, 0);
                    fnMoveItemlower(lowerItemsEl, itemOffset, anchorIndex, anchorIndex + 1);
                    if (lowerItemsEl.length) {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[upperItemsEl.length - 1]);
                        lowerItemsEl[0].parentNode.removeChild(lowerItemsEl[lowerItemsEl.length - 1]);
                    } else {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[upperItemsEl.length - 1]);
                    }
                }
            } else {
                var itemsEl = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                if (aDown) {
                    fnMoveItemUpper(itemsEl, itemOffset, anchorIndex, -1, anchorOffset);
                    itemsEl[0].parentNode.removeChild(itemsEl[0]);
                } else {
                    fnMoveItemlower(itemsEl, itemOffset, anchorIndex, 0, anchorOffset);
                    itemsEl[0].parentNode.removeChild(itemsEl[itemsEl.length - 1]);
                }
            }
            this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
        }

        private _animate(aDown: boolean) {
            this.setTransition(true);
            this._emitStartToChange(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
            setTimeout(() => {
                var menuLen: number = this._cirMenuItems.length(), //
                    align: TParamOrientation,
                    anchorIndex: number = this.getAnchorIndex(),
                    anchorHeight: number = this.getAnchorHeight(),
                    anchorWidth: number = this.getAnchorWidth(),
                    itemHeight: number = this.getItemHeight(),
                    itemWidth: number = this.getItemWidth(),
                    transparentAnchor: boolean = this.getTransparentAnchor(),
                    nextTop: number = 0, //
                    itemOffset: number,
                    anchorOffset: number, //
                    fnMoveItemUpper, fnMoveItemlower;//
                //get align
                if (this.getOrientation() == TParamOrientation.EUnknown || undefined) {
                    align = TParamOrientation.EVertical;
                } else {
                    align = this.getOrientation();
                }

                if (align == TParamOrientation.EVertical) {
                    itemOffset = itemHeight;
                    anchorOffset = anchorHeight;
                    fnMoveItemUpper = this._moveItemsUpward;
                    fnMoveItemlower = this._moveItemsDownward;
                } else {
                    itemOffset = itemWidth;
                    anchorOffset = anchorWidth;
                    fnMoveItemUpper = this._moveItemsRightward;
                    fnMoveItemlower = this._moveItemsLeftward;
                }
                if (transparentAnchor) {
                    var upperItemNodeList = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    var lowerItemNodeList = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    if (aDown) {
                        fnMoveItemUpper(upperItemNodeList, itemOffset, anchorIndex, -1);
                        fnMoveItemUpper(lowerItemNodeList, itemOffset, anchorIndex, anchorIndex);
                        if (lowerItemNodeList.length) {
                            this._doTransitionAndAfter(<HTMLElement> lowerItemNodeList[lowerItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[0]);
                                lowerItemNodeList[0].parentNode.removeChild(lowerItemNodeList[0]);
                            });
                        } else {
                            this._doTransitionAndAfter(<HTMLElement> upperItemNodeList[upperItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[0]);
                            });
                        }
                    } else {
                        fnMoveItemlower(upperItemNodeList, itemOffset, anchorIndex, 0);
                        fnMoveItemlower(lowerItemNodeList, itemOffset, anchorIndex, anchorIndex + 1);
                        if (lowerItemNodeList.length) {
                            this._doTransitionAndAfter(<HTMLElement> lowerItemNodeList[lowerItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[upperItemNodeList.length - 1]);
                                lowerItemNodeList[0].parentNode.removeChild(lowerItemNodeList[lowerItemNodeList.length - 1]);
                            });
                        } else {
                            this._doTransitionAndAfter(<HTMLElement> upperItemNodeList[upperItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[upperItemNodeList.length - 1]);
                            });
                        }
                    }
                } else {
                    var itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                    if (aDown) {
                        fnMoveItemUpper(itemNodeList, itemOffset, anchorIndex, -1, anchorOffset);
                        this._doTransitionAndAfter(<HTMLElement> itemNodeList[itemNodeList.length - 1], function () {
                            itemNodeList[0].parentNode.removeChild(itemNodeList[0]);
                        });
                    } else {
                        fnMoveItemlower(itemNodeList, itemOffset, anchorIndex, 0, anchorOffset);
                        this._doTransitionAndAfter(<HTMLElement> itemNodeList[itemNodeList.length - 1], function () {
                            itemNodeList[0].parentNode.removeChild(itemNodeList[itemNodeList.length - 1]);
                        });
                    }
                }
            }, 1);
        }

        private _doTransitionBack() {
            var dataLen: number = this._cirMenuItems.length();
            var viewCount: number = this.getViewCount();
            var anchorIndex: number = this.getAnchorIndex();
            var align: TParamOrientation = this.getOrientation();
            var animation: boolean = this.getAnimation();
            var i: number;
            var len: number;
            var item: TViewItem;
            var itemEl: HTMLElement;
            var itemSize: number;
            var anchorSize: number;

            if (align == TParamOrientation.EVertical) {
                itemSize = this.getItemHeight();
                anchorSize = this.getAnchorHeight();
            } else {
                itemSize = this.getItemWidth();
                anchorSize = this.getAnchorWidth();
            }

            this._cirMenuItems.dec(1);
            var result = this._cirMenuItems.getViewItems(viewCount, anchorIndex);
            var items = result.items;
            if (this.getTransparentAnchor()) {
                var uppperItemNodeList = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                var lowerItemNodeList = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                var newUpperEl, newLowerEl;
                if (dataLen < viewCount) {
                    newUpperEl = this._createItem(null, -itemSize);
                    this._upperBoundEl.insertBefore(newUpperEl, uppperItemNodeList[0]);
                    uppperItemNodeList = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    for (i = 0, len = uppperItemNodeList.length; i < len; i += 1) {
                        itemEl = <HTMLElement> uppperItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                    newLowerEl = this._createItem(null, -itemSize, null);
                    this._lowerBoundEl.insertBefore(newLowerEl, lowerItemNodeList[0]);
                    lowerItemNodeList = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    for (i = 0, len = lowerItemNodeList.length; i < len; i += 1) {
                        itemEl = <HTMLElement> lowerItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i + anchorIndex + 1];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                } else {
                    newUpperEl = this._createItem(items[0], -itemSize, null);
                    newLowerEl = this._createItem(items[anchorIndex + 1], -itemSize, null);
                    uppperItemNodeList[0].parentNode.insertBefore(newUpperEl, uppperItemNodeList[0]);
                    lowerItemNodeList[0].parentNode.insertBefore(newLowerEl, lowerItemNodeList[0]);
                }
            } else {
                var itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                var newItemEl = this._createItem(items[0], -itemSize, CCarouselControl.KClassUpper);
                this._element.insertBefore(newItemEl, itemNodeList[0]);
                itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                if (dataLen < viewCount) {
                    for (i = 0, len = itemNodeList.length; i < len; i += 1) {
                        itemEl = <HTMLElement> itemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                }
            }
            if (animation) {
                this._animate(false);
            } else {
                this._update2(false);
            }
        }

        private _doTransitionNext() {
            var dataLen: number = this._cirMenuItems.length();
            var viewCount: number = this.getViewCount();
            var anchorIndex: number = this.getAnchorIndex();
            var align: TParamOrientation = this.getOrientation();
            var animation: boolean = this.getAnimation();
            var i: number;
            var len: number;
            var item: TViewItem;
            var itemEl: HTMLElement;
            var itemSize: number;
            var anchorSize: number;

            if (align == TParamOrientation.EVertical) {
                itemSize = this.getItemHeight();
                anchorSize = this.getAnchorHeight();
            } else {
                itemSize = this.getItemWidth();
                anchorSize = this.getAnchorWidth();
            }

            this._cirMenuItems.inc(1);
            var result = this._cirMenuItems.getViewItems(viewCount, anchorIndex);
            var items = result.items;
            if (this.getTransparentAnchor()) {
                var uppperItemNodeList = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                var lowerItemNodeList = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                var newUpperEl, newLowerEl;
                if (dataLen < viewCount) {
                    if (align == TParamOrientation.EVertical) {
                        newUpperEl = this._createItem(null, this._upperBoundHeight);
                    } else {
                        newUpperEl = this._createItem(null, this._upperBoundWidth);
                    }
                    this._upperBoundEl.appendChild(newUpperEl);
                    uppperItemNodeList = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    for (i = 0, len = uppperItemNodeList.length; i < len; i += 1) {
                        itemEl = <HTMLElement> uppperItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i - 1];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }

                    if (align == TParamOrientation.EVertical) {
                        newLowerEl = this._createItem(null, this._lowerBoundHeight);
                    } else {
                        newLowerEl = this._createItem(null, this._lowerBoundWidth);
                    }
                    this._lowerBoundEl.appendChild(newLowerEl);
                    lowerItemNodeList = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    for (i = 0, len = lowerItemNodeList.length; i < len; i += 1) {
                        itemEl = <HTMLElement> lowerItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i + anchorIndex];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                } else {
                    if (align == TParamOrientation.EVertical) {
                        newUpperEl = this._createItem(items[anchorIndex - 1], this._upperBoundHeight, null);
                        newLowerEl = this._createItem(items[items.length - 1], this._lowerBoundHeight, null);
                    } else {
                        newUpperEl = this._createItem(items[anchorIndex - 1], this._upperBoundWidth, null);
                        newLowerEl = this._createItem(items[items.length - 1], this._lowerBoundWidth, null);
                    }
                    uppperItemNodeList[0].parentNode.appendChild(newUpperEl);
                    lowerItemNodeList[0].parentNode.appendChild(newLowerEl);
                }
            } else {
                var itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                if (align == TParamOrientation.EVertical) {
                    var newItemEl = this._createItem(items[items.length - 1], this._height, CCarouselControl.KClassLower);
                } else {
                    var newItemEl = this._createItem(items[items.length - 1], this._width, CCarouselControl.KClassLower);
                }
                this._element.appendChild(newItemEl);
                if (dataLen < viewCount) {
                    for (i = 0, len = itemNodeList.length; i < len; i += 1) {
                        itemEl = <HTMLElement> itemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i - 1];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                }
            }
            if (animation) {
                this._animate(true);
            } else {
                this._update2(true);
            }
        }

        private _doKeyLeft(): boolean {
            var dataLen: number = this._cirMenuItems.length();
            var align: TParamOrientation = this.getOrientation();
            var maxKeyQueueCount: number = this.getMaxKeyQueueCount();

            if (align == TParamOrientation.EVertical) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionBack();
            } else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyLeft');
                } else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyLeft');
                }
            }
            return true;
        }
        private _doKeyRight(): boolean {
            var dataLen: number = this._cirMenuItems.length();
            var align: TParamOrientation = this.getOrientation();
            var maxKeyQueueCount: number = this.getMaxKeyQueueCount();

            if (align == TParamOrientation.EVertical) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionNext();
            } else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyRight');
                } else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyRight');
                }
            }
            return true;
        }
        private _doKeyUp(): boolean {
            var dataLen: number = this._cirMenuItems.length();
            var align: TParamOrientation = this.getOrientation();
            var maxKeyQueueCount: number = this.getMaxKeyQueueCount();

            if (align == TParamOrientation.EHorizontal) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionBack();
            } else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyUp');
                } else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyUp');
                }
            }
            return true;
        }
        private _doKeyDown(): boolean {
            var dataLen: number = this._cirMenuItems.length();
            var align: TParamOrientation = this.getOrientation();
            var maxKeyQueueCount: number = this.getMaxKeyQueueCount();

            if (align == TParamOrientation.EHorizontal) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionNext();
            } else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyDown');
                } else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyDown');
                }
            }
            return true;
        }
        private _doKeyEnter(): boolean {
            if (!this.isTransitioning()) {
                this.emit.call(this, "ItemSelected", this._anchorEl, this._cirMenuItems.curItem());
            }
            return true;
        }
    }

    export function makeNoneFocusable(aId: string, aHtml?: string): CControl {
        var focusInfo = new CLayoutControl(null);
        focusInfo.setId(aId);
        focusInfo.setItemDrawers([]);
        if (aHtml) {
            focusInfo.setItemDrawers([
                function(aElement: HTMLElement, aIndex: number) {
                    aElement.innerHTML = aHtml;
                    return TFocusInfo.KFocusNone;
                }
            ]);
        }
        return focusInfo;
    }

}
