// Module
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Controls;
(function (Controls) {
    var KClassControl = "-c";
    var KClassGroupControl = "-g";
    var KClassFocusable = "-f";
    var KClassFocused = "-fd";
    var KClassActiveFocused = "-afd";
    var KClassActiveFocusedLeaf = "-afd-leaf";
    var KCssPropTransition = 'transition';
    var KCssEventTransitionEnd = 'transitionend';
    var KCssTransitionDuration = 'transition-duration';
    Controls.TClassStr = {
        KClassControl: KClassControl,
        KClassGroupControl: KClassGroupControl,
        KClassFocusable: KClassFocusable,
        KClassFocused: KClassFocused,
        KClassActiveFocused: KClassActiveFocused,
        KClassActiveFocusedLeaf: KClassActiveFocusedLeaf
    };
    Controls.TTransitionStr = {
        KCssPropTransition: KCssPropTransition,
        KCssEventTransitionEnd: KCssEventTransitionEnd,
        KCssTransitionDuration: KCssTransitionDuration
    };
    var browser = (function () {
        var N = navigator.appName, ua = navigator.userAgent, tem;
        var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
        if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null)
            M[2] = tem[1];
        M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];
        return M;
    }());
    if (browser[0] == "chrome") {
        KCssPropTransition = '-webkit-transition';
        KCssEventTransitionEnd = 'webkitTransitionEnd';
        KCssTransitionDuration = '-webkit-transition-duration';
    }
    else if (browser[0] == "opera") {
        KCssPropTransition = '-o-transition';
        KCssEventTransitionEnd = 'oTransitionEnd otransitionend';
        KCssTransitionDuration = '-o-transition-duration';
    }
    else if (browser[0] == "msie") {
        KCssPropTransition = '-ms-transition';
        KCssEventTransitionEnd = 'msTransitionEnd mstransitionend';
        KCssTransitionDuration = '-ms-transition-duration';
    }
    var KCssTransitionParamPos = 'top .3s linear, left .3s linear';
    var KCssTransitionParamOpa = 'opacity .3s linear';
    // DOM helper
    var Util = (function () {
        function Util() {
        }
        Util.afterTransition = function (aElement, aCallBack) {
            var durations = ['0'];
            if (getComputedStyle) {
                if (getComputedStyle(aElement).transitionDuration) {
                    durations = getComputedStyle(aElement).transitionDuration.split(',');
                }
            }
            else {
                durations = aElement.style.transitionDuration.split(',');
            }
            var delay = parseFloat(durations[0].replace('s', '')) * 1000 || 300;
            if (delay) {
                setTimeout(aCallBack, delay);
            }
            else {
                throw "Invalid transition duration";
            }
        };
        Util.remove = function (aElement) {
            var parent = aElement.parentElement;
            if (parent) {
                parent.removeChild(aElement);
            }
            else {
                throw "Element has no parent";
            }
        };
        Util.prepend = function (aElement, aNewChild) {
            aElement.insertBefore(aNewChild, aElement.firstElementChild);
        };
        Util.getRect = function (aElement) {
            return new TRect({
                top: aElement.offsetTop,
                left: aElement.offsetLeft,
                right: aElement.offsetLeft + aElement.offsetWidth,
                bottom: aElement.offsetTop + aElement.offsetHeight
            });
        };
        return Util;
    })();
    var KKeyStrUp = "Up";
    var KKeyStrDown = "Down";
    var KKeyStrLeft = "Left";
    var KKeyStrRight = "Right";
    var KKeyStrEnter = "Enter";
    var KKeyStrPageUp = "PageUp";
    var KKeyStrPageDown = "PageDown";
    var KKeyStrBack = "Back";
    var KKeyStrEscape = "Escape";
    Controls.TKeyStr = {
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
    var CKeyMap = (function () {
        function CKeyMap(aFocusChanged, aActiveFocusClass) {
            this._index = -1;
            this._map = [];
            this._focusChanged = aFocusChanged;
            this._activeFocusClass = aActiveFocusClass;
        }
        CKeyMap.prototype.destroy = function () {
            this._map = null;
        };
        CKeyMap.prototype.addMapItem = function (aMapItem) {
            this._map.push(aMapItem);
        };
        CKeyMap.prototype.getMapItem = function (aIndex) {
            return this._map[aIndex];
        };
        CKeyMap.prototype.setActiveFocus = function (aIndex) {
            this._index = aIndex;
        };
        CKeyMap.prototype.getFocusedElement = function () {
            return this._map[this._index].el;
        };
        CKeyMap.prototype.getFocusedIndex = function () {
            return this._index;
        };
        CKeyMap.prototype.getMapCount = function () {
            return this._map.length;
        };
        CKeyMap.prototype.getIndex = function (aElement) {
            var index = -1;
            var i, len, item;
            for (i = 0, len = this._map.length; i < len; i++) {
                item = this._map[i];
                if (item.el == aElement) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        CKeyMap.prototype.changeFocus = function (aNewIndex) {
            var oldMapItem = this._map[this._index];
            var newMapItem = this._map[aNewIndex];
            var oldEl = oldMapItem.el;
            var newEl = newMapItem.el;
            oldEl.classList.remove(KClassFocused);
            newEl.classList.add(KClassFocused);
            if (oldEl.classList.contains(this._activeFocusClass)) {
                oldEl.classList.remove(this._activeFocusClass);
                newEl.classList.add(this._activeFocusClass);
            }
            this._focusChanged(oldEl, newEl);
            this._index = aNewIndex;
        };
        CKeyMap.prototype.doKey = function (aKeyStr) {
            var handlers = {};
            var oldMapItem = this._map[this._index];
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
        };
        return CKeyMap;
    })();
    Controls.CKeyMap = CKeyMap;
    Controls.KBuilderTopDown = function (aKeyMap, aFocusable, aPrevFocusInfo, aPrevKeyStr) {
        var i, len, el, mapItem, prevMapItem = null;
        var startIndex = 0;
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
            if (scrollingScheme === 3 /* EByFocusRemains */) {
                if (aPrevFocusInfo) {
                    aPrevFocusInfo.prevFocusedEl.classList.remove(KClassActiveFocusedLeaf);
                    aFocusable[startIndex].classList.add(KClassActiveFocusedLeaf);
                }
            }
            else {
                aKeyMap.doKey(aPrevKeyStr);
            }
        }
    };
    Controls.KBuilderLeftRight = function (aKeyMap, aFocusable, aPrevFocusInfo, aPrevKeyStr) {
        var i, j, len, el, mapItem, prevMapItem = null;
        var startIndex = 0;
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
            if (scrollingScheme === 3 /* EByFocusRemains */) {
                if (aPrevFocusInfo) {
                    aPrevFocusInfo.prevFocusedEl.classList.remove(KClassActiveFocusedLeaf);
                    aFocusable[startIndex].classList.add(KClassActiveFocusedLeaf);
                }
            }
            else {
                aKeyMap.doKey(aPrevKeyStr);
            }
        }
    };
    Controls.KBuilderGrid = function (aKeyMap, aFocusable, aPrevFocusInfo, aPrevKeyStr) {
        var i, j, len;
        var el;
        var mapItem;
        var prevMapItem = null;
        var aboveMapItem = null;
        var startIndex = 0;
        var rowCount = 0;
        var colCount = 0;
        var posY = -1;
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
            }
            else {
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
    Controls.KBuilderWeightDistance = function (aKeyMap, aFocusable, aPrevFocusInfo, aPrevKeyStr) {
        var i, j, cnt = aFocusable.length, el;
        var getPos = function (aElement) {
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
        var getPosByRect = function (aRect) {
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
            var item = {
                el: el
            };
            var me = rectInfoList[i];
            fillKeyMapItem(item, me);
            aKeyMap.addMapItem(item);
        }
        aKeyMap.setActiveFocus(startIndex);
        if (aPrevFocusInfo) {
            var prevPosData = getPosByRect(aPrevFocusInfo.rect);
            var item = {
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
    };
    var CSignalSource = (function () {
        function CSignalSource() {
            this._signalTypes = {};
        }
        CSignalSource.prototype.destroy = function () {
            this._signalTypes = null;
        };
        CSignalSource.prototype.registerSignal = function (aSignalList) {
            var i, len, signalName;
            for (i = 0, len = aSignalList.length; i < len; i++) {
                signalName = aSignalList[i];
                if (this._signalTypes[signalName]) {
                    throw "Event [" + signalName + "] already exists";
                }
                this._signalTypes[signalName] = [];
            }
        };
        CSignalSource.prototype.connect = function (aSignalName, aHolder, aSlotName) {
            if (!(aHolder[aSlotName] instanceof Function)) {
                throw "holder does not have the slot";
            }
            var signalHandlers;
            var signalHandler;
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
        };
        CSignalSource.prototype.disconnect = function (aHolder) {
            var signalName;
            var signalHandlers;
            var signalHandler;
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
        };
        CSignalSource.prototype.emit = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            var signalName;
            var i, len, handlerInfoList, handlerInfo;
            var holder;
            signalName = args.shift();
            handlerInfoList = this._signalTypes[signalName];
            for (i = 0, len = handlerInfoList.length; i < len; i++) {
                handlerInfo = handlerInfoList[i];
                handlerInfo.holder[handlerInfo.slotName].apply(handlerInfo.holder, args);
            }
        };
        return CSignalSource;
    })();
    Controls.CSignalSource = CSignalSource;
    (function (TFocusInfo) {
        TFocusInfo[TFocusInfo["KFocusUnknown"] = 0] = "KFocusUnknown";
        TFocusInfo[TFocusInfo["KFocusNone"] = 1] = "KFocusNone";
        TFocusInfo[TFocusInfo["KFocusAble"] = 2] = "KFocusAble";
        TFocusInfo[TFocusInfo["KFocused"] = 3] = "KFocused";
    })(Controls.TFocusInfo || (Controls.TFocusInfo = {}));
    var TFocusInfo = Controls.TFocusInfo;
    var KParamStrScrollSchemeVertical = "scrollingSchemeVertical";
    var KParamStrScrollSchemeHorizontal = "scrollingSchemeHorizontal";
    var KParamStrScrollSchemeFixedUnitVertical = "scrollingSchemeFixedUnitVertical";
    var KParamStrScrollSchemeFixedUnitHorizontal = "scrollingSchemeFixedUnitHorizontal";
    (function (TParamScrollScheme) {
        TParamScrollScheme[TParamScrollScheme["EUnknown"] = 0] = "EUnknown";
        TParamScrollScheme[TParamScrollScheme["EByItem"] = 1] = "EByItem";
        TParamScrollScheme[TParamScrollScheme["EByPage"] = 2] = "EByPage";
        TParamScrollScheme[TParamScrollScheme["EByFocusRemains"] = 3] = "EByFocusRemains";
        TParamScrollScheme[TParamScrollScheme["EByFocusRemainsRolling"] = 4] = "EByFocusRemainsRolling";
        TParamScrollScheme[TParamScrollScheme["EByFixed"] = 5] = "EByFixed";
    })(Controls.TParamScrollScheme || (Controls.TParamScrollScheme = {}));
    var TParamScrollScheme = Controls.TParamScrollScheme;
    var KParamStrOrientation = "orientation";
    (function (TParamOrientation) {
        TParamOrientation[TParamOrientation["EUnknown"] = 0] = "EUnknown";
        TParamOrientation[TParamOrientation["EVertical"] = 1] = "EVertical";
        TParamOrientation[TParamOrientation["EHorizontal"] = 2] = "EHorizontal";
    })(Controls.TParamOrientation || (Controls.TParamOrientation = {}));
    var TParamOrientation = Controls.TParamOrientation;
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
    var KParamStrPadding = "padding";
    var KParamStrChildVAlign = "childVAlign";
    (function (TParamVAlign) {
        TParamVAlign[TParamVAlign["EUnkown"] = 0] = "EUnkown";
        TParamVAlign[TParamVAlign["ETop"] = 1] = "ETop";
        TParamVAlign[TParamVAlign["ECenter"] = 2] = "ECenter";
        TParamVAlign[TParamVAlign["EBottom"] = 3] = "EBottom";
    })(Controls.TParamVAlign || (Controls.TParamVAlign = {}));
    var TParamVAlign = Controls.TParamVAlign;
    var KParamStrChildHAlign = "childHAlign";
    (function (TParamHAlign) {
        TParamHAlign[TParamHAlign["EUnkown"] = 0] = "EUnkown";
        TParamHAlign[TParamHAlign["ELeft"] = 1] = "ELeft";
        TParamHAlign[TParamHAlign["ECenter"] = 2] = "ECenter";
        TParamHAlign[TParamHAlign["ERight"] = 3] = "ERight";
    })(Controls.TParamHAlign || (Controls.TParamHAlign = {}));
    var TParamHAlign = Controls.TParamHAlign;
    var KParamAnimation = "animation";
    var KParamUserAnimationCSS = "userAnimationCSS";
    var KParamAnimationInterval = "animationInterval";
    var KParamKeepFocus = "keepFocus";
    var TRect = (function () {
        function TRect(aParam) {
            this.top = 0;
            this.left = 0;
            this.right = 0;
            this.bottom = 0;
            if (aParam) {
                this.top = aParam.top;
                this.left = aParam.left;
                this.right = aParam.right;
                this.bottom = aParam.bottom;
            }
        }
        TRect.prototype.getHeight = function () {
            return this.bottom - this.top;
        };
        TRect.prototype.getWidth = function () {
            return this.right - this.left;
        };
        TRect.prototype.getCenterX = function () {
            return this.left + Math.floor(this.getWidth() / 2);
        };
        TRect.prototype.getCenterY = function () {
            return this.top + Math.floor(this.getHeight() / 2);
        };
        TRect.prototype.hasSize = function () {
            return this.getHeight() > 0 || this.getWidth() > 0;
        };
        TRect.prototype.setHeight = function (aHeight) {
            this.bottom = this.top + aHeight;
        };
        TRect.prototype.setWidth = function (aWidth) {
            this.right = this.left + aWidth;
        };
        TRect.prototype.moveTop = function (aIncrement) {
            this.top += aIncrement;
            this.bottom += aIncrement;
        };
        TRect.prototype.moveLeft = function (aIncrement) {
            this.left += aIncrement;
            this.right += aIncrement;
        };
        TRect.prototype.getIntersectedRect = function (aRect) {
            var ret = new TRect;
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
        };
        return TRect;
    })();
    Controls.TRect = TRect;
    var CControl = (function (_super) {
        __extends(CControl, _super);
        function CControl(aElement, className) {
            _super.call(this);
            this._root = false;
            this._group = false;
            // Draw param
            this._drawParam = {};
            this._drawParamVolitile = {};
            this._transitioning = false;
            this._element = aElement || document.createElement("div");
            this._element.style.position = "absolute";
            this._element.classList.add(className || KClassControl);
            this.registerSignal(["FocusChanged", "FocusGained", "FocusLost", "ItemSelected", "RedrawRequired"]);
        }
        CControl.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            if (this._element) {
                Util.remove(this._element);
                this._element = null;
            }
        };
        CControl.prototype.getElement = function () {
            return this._element;
        };
        CControl.prototype.setParent = function (aParentControl) {
            this._parent = aParentControl;
        };
        CControl.prototype._setDrawParam = function (aParamName, aValue, aVolitile) {
            if (aVolitile) {
                this._drawParamVolitile[aParamName] = aValue;
            }
            else {
                this._drawParam[aParamName] = aValue;
            }
        };
        CControl.prototype._getDrawParam = function (aParamName) {
            var ret = this._drawParamVolitile[aParamName];
            if (ret == null) {
                ret = this._drawParam[aParamName];
            }
            return ret;
        };
        CControl.prototype._prepareParam = function () {
            var ret = {};
            var key;
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
        };
        CControl.prototype._clearVolitile = function () {
            this._drawParamVolitile = {};
        };
        // Orientation
        CControl.prototype.setOrientation = function (aLayout) {
            this._setDrawParam(KParamStrOrientation, aLayout, false);
        };
        CControl.prototype.getOrientation = function () {
            var ret = 0 /* EUnknown */;
            var value = this._getDrawParam(KParamStrOrientation);
            if (value) {
                ret = value;
            }
            return ret;
        };
        // Item info
        CControl.prototype.setItemHeight = function (aItemHeight) {
            this._setDrawParam(KParamStrItemHeight, aItemHeight, false);
        };
        CControl.prototype.getItemHeight = function () {
            return this._getDrawParam(KParamStrItemHeight) || 0;
        };
        CControl.prototype.setItemWidth = function (aItemWidth) {
            this._setDrawParam(KParamStrItemWidth, aItemWidth, false);
        };
        CControl.prototype.getItemWidth = function () {
            return this._getDrawParam(KParamStrItemWidth) || 0;
        };
        CControl.prototype.setMaxColCount = function (aMaxColCount) {
            this._setDrawParam(KParamStrMaxColCount, aMaxColCount, false);
        };
        CControl.prototype.getMaxColCount = function () {
            return this._getDrawParam(KParamStrMaxColCount) || false;
        };
        // Margin
        CControl.prototype.setMargins = function (aMargins) {
            this._setDrawParam(KParamStrMargin, aMargins, false);
        };
        CControl.prototype.getMargins = function () {
            var margins = this._getDrawParam(KParamStrMargin);
            var ret = {
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
        };
        // Padding
        CControl.prototype.setPadding = function (aPadding) {
            this._setDrawParam(KParamStrPadding, aPadding, false);
        };
        CControl.prototype.getPadding = function () {
            return this._getDrawParam(KParamStrPadding) || 0;
        };
        // Child align
        CControl.prototype.setChildVAlign = function (aChildVAlign) {
            this._setDrawParam(KParamStrChildVAlign, aChildVAlign, false);
        };
        CControl.prototype.getChildVAlign = function () {
            return this._getDrawParam(KParamStrChildVAlign) || 0;
        };
        CControl.prototype.setChildHAlign = function (aChildHAlign) {
            this._setDrawParam(KParamStrChildHAlign, aChildHAlign, false);
        };
        CControl.prototype.getChildHAlign = function () {
            return this._getDrawParam(KParamStrChildHAlign) || 0;
        };
        // Animaion
        CControl.prototype.setAnimation = function (aAnimation) {
            this._setDrawParam(KParamAnimation, aAnimation, false);
        };
        CControl.prototype.getAnimation = function () {
            return this._getDrawParam(KParamAnimation) || false;
        };
        // User Animation CSS
        CControl.prototype.setUseUserAnimationCSS = function (aAnimation) {
            this._setDrawParam(KParamUserAnimationCSS, aAnimation, false);
        };
        CControl.prototype.getUseUserAnimationCSS = function () {
            return this._getDrawParam(KParamUserAnimationCSS) || false;
        };
        // AnimationInterval
        CControl.prototype.setAnimationInterval = function (aAnimationInterval) {
            this._setDrawParam(KParamAnimationInterval, aAnimationInterval, false);
        };
        CControl.prototype.getAnimationInterval = function () {
            return this._getDrawParam(KParamAnimationInterval) || 0;
        };
        // ViewCount
        CControl.prototype.setViewCount = function (aViewCount) {
            this._setDrawParam(KParamStrViewCount, aViewCount, false);
        };
        CControl.prototype.getViewCount = function () {
            return this._getDrawParam(KParamStrViewCount) || 0;
        };
        // AnchorIndex
        CControl.prototype.setAnchorIndex = function (aAnchorIndex) {
            this._setDrawParam(KParamStrAnchorIndex, aAnchorIndex, false);
        };
        CControl.prototype.getAnchorIndex = function () {
            return this._getDrawParam(KParamStrAnchorIndex) || 0;
        };
        // AnchorHeight
        CControl.prototype.setAnchorHeight = function (aAnchorHeight) {
            this._setDrawParam(KParamStrAnchorHeight, aAnchorHeight, false);
        };
        CControl.prototype.getAnchorHeight = function () {
            return this._getDrawParam(KParamStrAnchorHeight) || 0;
        };
        // AnchorWidth
        CControl.prototype.setAnchorWidth = function (aAnchorWidth) {
            this._setDrawParam(KParamStrAnchorWidth, aAnchorWidth, false);
        };
        CControl.prototype.getAnchorWidth = function () {
            return this._getDrawParam(KParamStrAnchorWidth) || 0;
        };
        // StartIndex
        CControl.prototype.setStartIndex = function (aStartIndex) {
            this._setDrawParam(KParamStrStartIndex, aStartIndex, false);
        };
        CControl.prototype.getStartIndex = function () {
            return this._getDrawParam(KParamStrStartIndex) || 0;
        };
        // MaxKeyQueueCount
        CControl.prototype.setMaxKeyQueueCount = function (aMaxKeyQueueCount) {
            this._setDrawParam(KParamStrMaxKeyQueueCount, aMaxKeyQueueCount, false);
        };
        CControl.prototype.getMaxKeyQueueCount = function () {
            return this._getDrawParam(KParamStrMaxKeyQueueCount) || 0;
        };
        // TransparentAnchor
        CControl.prototype.setTransparentAnchor = function (aTransparentAnchor) {
            this._setDrawParam(KParamStrTransparentAnchor, aTransparentAnchor, false);
        };
        CControl.prototype.getTransparentAnchor = function () {
            return this._getDrawParam(KParamStrTransparentAnchor) || false;
        };
        // DrawEfect
        CControl.prototype.setDrawEfect = function (aDrawEfect) {
            this._setDrawParam(KParamStrDrawEffect, aDrawEfect, true);
        };
        CControl.prototype.getDrawEfect = function () {
            return this._getDrawParam(KParamStrDrawEffect) || null;
        };
        // Scrolling scheme
        CControl.prototype.setScrollScheme = function (aScheme, aFixedScrollUnit) {
            this._setDrawParam(KParamStrScrollSchemeVertical, aScheme, false);
            this._setDrawParam(KParamStrScrollSchemeHorizontal, aScheme, false);
            if (aScheme == 5 /* EByFixed */) {
                if (aFixedScrollUnit) {
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitVertical, aFixedScrollUnit, false);
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitHorizontal, aFixedScrollUnit, false);
                }
                else {
                    throw "fixed scroll unit is missiong";
                }
            }
        };
        CControl.prototype.setVerticalScrollScheme = function (aScheme, aFixedScrollUnit) {
            this._setDrawParam(KParamStrScrollSchemeVertical, aScheme, false);
            if (aScheme == 5 /* EByFixed */) {
                if (aFixedScrollUnit) {
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitVertical, aFixedScrollUnit, false);
                }
                else {
                    throw "fixed scroll unit is missiong";
                }
            }
        };
        CControl.prototype.getVerticalScrollScheme = function () {
            return this._getDrawParam(KParamStrScrollSchemeVertical) || 1 /* EByItem */;
        };
        CControl.prototype.setHorizontalScrollScheme = function (aScheme, aFixedScrollUnit) {
            this._setDrawParam(KParamStrScrollSchemeHorizontal, aScheme, false);
            if (aScheme == 5 /* EByFixed */) {
                if (aFixedScrollUnit) {
                    this._setDrawParam(KParamStrScrollSchemeFixedUnitHorizontal, aFixedScrollUnit, false);
                }
                else {
                    throw "fixed scroll unit is missiong";
                }
            }
        };
        CControl.prototype.getHorizontalScrollScheme = function () {
            return this._getDrawParam(KParamStrScrollSchemeHorizontal) || 1 /* EByItem */;
        };
        CControl.prototype.getDataRolling = function () {
            return false;
        };
        // Keep focus
        CControl.prototype.setKeepFocus = function (aKeepFocus) {
            this._setDrawParam(KParamKeepFocus, aKeepFocus, true);
        };
        CControl.prototype.getKeepFocus = function () {
            return this._getDrawParam(KParamKeepFocus) || false;
        };
        CControl.prototype._saveFocusInfo = function () {
            if (this._keyMap) {
                var prevFocusedEl = this._keyMap.getFocusedElement();
                this._prevFocusInfo = {
                    rect: Util.getRect(prevFocusedEl),
                    activeFocus: prevFocusedEl.classList.contains(KClassActiveFocusedLeaf),
                    prevFocusedEl: prevFocusedEl
                };
            }
        };
        CControl.prototype.draw = function (aRect) {
            aRect = aRect || null;
            var keepFocus = this.getKeepFocus();
            var param = this._prepareParam();
            var drawnElements;
            drawnElements = this._doDraw(aRect, param);
            this._drawn = true;
            this._clearVolitile();
            this._makeKeyMap(drawnElements, false, keepFocus);
            this._saveFocusInfo();
        };
        CControl.prototype._doDraw = function (aRect, aDrawParam) {
            var ret;
            return ret;
        };
        CControl.prototype._makeKeyMap = function (drawnElements, aUpdateFocusInfo, aKeepFocus) {
            var _this = this;
            if (!this._drawn) {
                return;
            }
            if (aUpdateFocusInfo) {
                this._saveFocusInfo();
            }
            if (drawnElements && drawnElements.length) {
                var keyMap = new CKeyMap(function (aOld, aNew) {
                    _this._keyMapFocusChanged(aOld, aNew);
                }, this._group ? KClassActiveFocused : KClassActiveFocusedLeaf);
                this._keyMapBuilder(keyMap, drawnElements, this._prevFocusInfo, aKeepFocus ? null : this._prevKeyStr);
                this._keyMap = keyMap;
                this._element.classList.add(KClassFocusable);
            }
            else {
                this._keyMap = null;
                this._element.classList.remove(KClassFocusable);
            }
        };
        // Key navigation
        CControl.prototype._keyMapFocusChanged = function (aOld, aNew) {
            this._handleFocusChanged(aOld, aNew);
        };
        CControl.prototype.doKey = function (aKeyStr, aParam) {
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
        };
        CControl.prototype._doKeyEnterLatent = function () {
            if (this._keyMap) {
                this._emitItemSelected(this._keyMap.getFocusedIndex(), this._keyMap.getFocusedElement());
            }
            return false;
        };
        // Signals
        CControl.prototype._handleFocusChanged = function (aElOld, aElNew) {
            this._emitFocusChanged(aElOld, aElNew);
        };
        CControl.prototype.connectFocusChanged = function (aHolder, aSlotName, aSlot) {
            this.connect("FocusChanged", aHolder, aSlotName);
        };
        CControl.prototype._emitFocusChanged = function (aOld, aNew) {
            this.emit.call(this, "FocusChanged", aOld, aNew);
        };
        CControl.prototype.connectFocusGained = function (aHolder, aSlotName, aSlot) {
            this.connect("FocusGained", aHolder, aSlotName);
        };
        CControl.prototype._emitFocusGained = function () {
            this.emit.call(this, "FocusGained", this);
        };
        CControl.prototype.connectFocusLost = function (aHolder, aSlotName, aSlot) {
            this.connect("FocusLost", aHolder, aSlotName);
        };
        CControl.prototype._emitFocusLost = function () {
            this.emit.call(this, "FocusLost", this);
        };
        CControl.prototype.connectItemSelected = function (aHolder, aSlotName, aSlot) {
            this.connect("ItemSelected", aHolder, aSlotName);
        };
        CControl.prototype._emitItemSelected = function (aIndex, aEl) {
            this.emit.call(this, "ItemSelected", this, aIndex, aEl);
        };
        CControl.prototype.connectItemInserted = function (aHolder, aSlotName, aSlot) {
            this.connect("ItemInserted", aHolder, aSlotName);
        };
        CControl.prototype.connectItemRemoved = function (aHolder, aSlotName, aSlot) {
            this.connect("ItemRemoved", aHolder, aSlotName);
        };
        CControl.prototype.connectRedrawRequired = function (aHolder, aSlotName, aSlot) {
            this.connect("RedrawRequired", aHolder, aSlotName);
        };
        CControl.prototype._emitRedrawRequired = function () {
            this.emit.call(this, "RedrawRequired", this);
        };
        // Utilities
        CControl.prototype.isFocusable = function () {
            return this._element.classList.contains(KClassFocusable);
        };
        CControl.prototype.isFocused = function () {
            return this._element.classList.contains(KClassFocused);
        };
        CControl.prototype.getFocusedElement = function () {
            return this._keyMap ? this._keyMap.getFocusedElement() : null;
        };
        CControl.prototype.clearFocusable = function () {
            this._element.classList.remove(KClassFocusable);
        };
        CControl.prototype.clearFocused = function () {
            this._element.classList.remove(KClassFocused);
        };
        CControl.prototype.setFocusedElement = function (aElement) {
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
        };
        CControl.prototype.setFocusedElementByIndex = function (aIndex) {
            var ret = false;
            var focusedIndex = this._keyMap.getFocusedIndex();
            if (0 <= aIndex && aIndex < this._keyMap.getMapCount()) {
                if (focusedIndex != aIndex) {
                    this._keyMap.changeFocus(aIndex);
                    ret = true;
                }
            }
            return ret;
        };
        CControl.prototype._setActiveFocus = function (aFocus) {
            if (this.isFocusable()) {
                var focused = this.getFocusedElement();
                if (aFocus) {
                    focused.classList.add(KClassActiveFocusedLeaf);
                    this._saveFocusInfo();
                    this._handleFocusGainged();
                }
                else {
                    focused.classList.remove(KClassActiveFocusedLeaf);
                    this._handleFocusLost();
                }
            }
        };
        CControl.prototype._handleFocusGainged = function () {
            this._emitFocusGained();
        };
        CControl.prototype._handleFocusLost = function () {
            this._emitFocusLost();
        };
        CControl.prototype.setActiveFocus = function () {
            this._setActiveFocus(true);
        };
        CControl.prototype.empty = function () {
            var i, len, childNodes = this._element.childNodes;
            for (i = childNodes.length - 1; i >= 0; i--) {
                this._element.removeChild(childNodes[i]);
            }
        };
        CControl.prototype.setId = function (aId) {
            this._element.id = aId;
        };
        CControl.prototype.getId = function () {
            return this._element.id;
        };
        CControl.prototype.addClass = function (aClass) {
            this._element.classList.add(aClass);
        };
        CControl.prototype.setTransition = function (aTransition) {
            this._transitioning = aTransition;
        };
        CControl.prototype.isTransitioning = function () {
            return this._transitioning ? true : false;
        };
        CControl.prototype.getSize = function () {
            return {
                width: this._element.offsetWidth,
                height: this._element.offsetHeight
            };
        };
        CControl.prototype.getContentAvail = function () {
            return this._contentAvail;
        };
        CControl.prototype.setContentAvail = function (aContentAvail) {
            this._contentAvail = aContentAvail;
        };
        CControl.prototype.updateContentAvail = function (aKeyStr, aDrawnRect) {
            var focusedItem = this.getFocusedElement();
            var focusedRect = new TRect({
                top: focusedItem.offsetTop,
                left: focusedItem.offsetLeft,
                right: focusedItem.offsetLeft + focusedItem.offsetWidth,
                bottom: focusedItem.offsetTop + focusedItem.offsetHeight
            });
            var size = this.getSize();
            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var totalAvailable = {
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
            if (orientation === 1 /* EVertical */) {
                switch (aKeyStr) {
                    case KKeyStrLeft:
                    case KKeyStrRight:
                        this._contentAvail = contentAvailable;
                        return;
                }
            }
            else if (orientation === 2 /* EHorizontal */) {
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
        };
        CControl.prototype._updateContentAvailVertical = function (aTotalAvailable, aDrawnRect, aFocusedRect, aUp, aDown) {
            var nextTop;
            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var scrollSchemeVertical = this.getVerticalScrollScheme();
            var scrollUnit = this._getDrawParam(KParamStrScrollSchemeFixedUnitVertical);
            var itemHeight = this.getItemHeight() || aFocusedRect.getHeight();
            switch (scrollSchemeVertical) {
                case 4 /* EByFocusRemainsRolling */:
                    if (aUp) {
                        contentAvailable.up = aDrawnRect.getHeight() - itemHeight;
                    }
                    if (aDown) {
                        contentAvailable.down = aFocusedRect.top - aDrawnRect.top;
                    }
                    break;
                case 3 /* EByFocusRemains */:
                    if (aUp) {
                        nextTop = aDrawnRect.getHeight() - itemHeight;
                        if (nextTop <= 0) {
                            contentAvailable.up = Math.min(aTotalAvailable.up, itemHeight);
                        }
                        else {
                            contentAvailable.up = Math.min(aTotalAvailable.up, nextTop);
                        }
                    }
                    if (aDown) {
                        nextTop = aFocusedRect.top - aDrawnRect.top;
                        if (nextTop > 0) {
                            contentAvailable.down = Math.min(aTotalAvailable.down, nextTop);
                        }
                        else {
                            contentAvailable.down = Math.min(aTotalAvailable.down, itemHeight);
                        }
                    }
                    break;
                case 1 /* EByItem */:
                    if (aUp) {
                        nextTop = itemHeight;
                        contentAvailable.up = Math.min(aTotalAvailable.up, nextTop);
                    }
                    if (aDown) {
                        nextTop = itemHeight;
                        contentAvailable.down = Math.min(aTotalAvailable.down, nextTop);
                    }
                    break;
                case 5 /* EByFixed */:
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
        };
        CControl.prototype._updateContentAvailHorizontal = function (aTotalAvailable, aDrawnRect, aFocusedRect, aLeft, aRight) {
            var nextLeft;
            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var scrollSchemeHorizontal = this.getHorizontalScrollScheme();
            var scrollUnit = this._getDrawParam(KParamStrScrollSchemeFixedUnitHorizontal);
            var itemWidth = this.getItemWidth() || aFocusedRect.getWidth();
            switch (scrollSchemeHorizontal) {
                case 4 /* EByFocusRemainsRolling */:
                    if (aLeft) {
                        contentAvailable.left = aDrawnRect.getWidth() - itemWidth;
                    }
                    if (aRight) {
                        contentAvailable.right = aFocusedRect.left - aDrawnRect.left;
                    }
                    break;
                case 3 /* EByFocusRemains */:
                    if (aLeft) {
                        nextLeft = aDrawnRect.getWidth() - itemWidth;
                        if (nextLeft <= 0) {
                            contentAvailable.left = Math.min(aTotalAvailable.left, itemWidth);
                        }
                        else {
                            contentAvailable.left = Math.min(aTotalAvailable.left, nextLeft);
                        }
                    }
                    if (aRight) {
                        nextLeft = aFocusedRect.left - aDrawnRect.left;
                        if (nextLeft > 0) {
                            contentAvailable.right = Math.min(aTotalAvailable.right, nextLeft);
                        }
                        else {
                            contentAvailable.right = Math.min(aTotalAvailable.right, itemWidth);
                        }
                    }
                    break;
                case 1 /* EByItem */:
                    if (aLeft) {
                        nextLeft = itemWidth;
                        contentAvailable.left = Math.min(aTotalAvailable.left, nextLeft);
                    }
                    if (aRight) {
                        nextLeft = itemWidth;
                        contentAvailable.right = Math.min(aTotalAvailable.right, nextLeft);
                    }
                    break;
                case 5 /* EByFixed */:
                    nextLeft = scrollUnit;
                    if (aLeft && 0 < aTotalAvailable.left) {
                        contentAvailable.left = scrollUnit;
                    }
                    if (aRight && 0 < aTotalAvailable.right) {
                        contentAvailable.right = scrollUnit;
                    }
                    break;
                default:
                    break;
            }
            return contentAvailable;
        };
        return CControl;
    })(CSignalSource);
    Controls.CControl = CControl;
    var CLayoutControl = (function (_super) {
        __extends(CLayoutControl, _super);
        function CLayoutControl(element) {
            _super.call(this, element);
            this._itemDrawers = null;
            this._element.classList.add("-lay");
        }
        CLayoutControl.prototype._doDraw = function (aRect, aDrawParam) {
            var ret = [];
            var i, len, el;
            this.empty();
            var horizontal = (aDrawParam[KParamStrOrientation] === 2 /* EHorizontal */);
            this._keyMapBuilder = horizontal ? Controls.KBuilderLeftRight : Controls.KBuilderTopDown;
            var drawer;
            var drawnElements = [];
            for (i = 0, len = this._itemDrawers.length; i < len; i++) {
                drawer = this._itemDrawers[i];
                if (drawer) {
                    el = document.createElement("div");
                    el.attributes["data"] = i;
                    el.style.position = "absolute";
                    this._element.appendChild(el);
                    switch (drawer(el, i)) {
                        case 2 /* KFocusAble */:
                            el.classList.add(KClassFocusable);
                            ret.push(el);
                            break;
                        case 3 /* KFocused */:
                            el.classList.add(KClassFocusable);
                            el.classList.add(KClassFocused);
                            ret.push(el);
                            break;
                    }
                    drawnElements.push(el);
                }
                else {
                    drawnElements.push(null);
                }
            }
            FLayoutElement(this._element, drawnElements, this.getOrientation(), this.getChildVAlign(), this.getChildHAlign(), this.getMargins(), this.getPadding());
            return ret;
        };
        CLayoutControl.prototype.setItemDrawers = function (aDrawers) {
            this._itemDrawers = aDrawers;
        };
        return CLayoutControl;
    })(CControl);
    Controls.CLayoutControl = CLayoutControl;
    var CDrawnElements = (function () {
        function CDrawnElements() {
            this._drawnElements = {};
        }
        CDrawnElements.prototype.destroy = function () {
            this.removeAll();
        };
        CDrawnElements.prototype.removeAll = function () {
            var key, el;
            for (key in this._drawnElements) {
                if (this._drawnElements.hasOwnProperty(key)) {
                    el = this._drawnElements[key];
                    Util.remove(el);
                }
            }
            this._drawnElements = {};
        };
        CDrawnElements.prototype.getCount = function () {
            return Object.keys(this._drawnElements).length;
        };
        CDrawnElements.prototype.getElements = function () {
            var ret = [], key;
            for (key in this._drawnElements) {
                if (this._drawnElements.hasOwnProperty(key)) {
                    ret.push(this._drawnElements[key]);
                }
            }
            return ret;
        };
        CDrawnElements.prototype.getElement = function (aKey) {
            return this._drawnElements[aKey];
        };
        CDrawnElements.prototype.setElement = function (aKey, aItem) {
            this._drawnElements[aKey] = aItem;
        };
        /**
         * Get key from drawn element
         * @param aItem
         * @returns {string|any}
         */
        CDrawnElements.prototype.getKey = function (aItem) {
            var keys = Object.keys(this._drawnElements);
            var i, len = keys.length, k, el;
            for (i = 0; i < len; i++) {
                k = keys[i];
                el = this._drawnElements[k];
                if (aItem === el) {
                    return k;
                }
            }
        };
        CDrawnElements.prototype.pickElement = function (aKey) {
            var ret = null;
            if (this._drawnElements.hasOwnProperty(aKey)) {
                ret = this._drawnElements[aKey];
                delete this._drawnElements[aKey];
            }
            return ret;
        };
        CDrawnElements.prototype.remove = function (aKey) {
            var el = this._drawnElements[aKey];
            if (el) {
                Util.remove(el);
            }
            delete this._drawnElements[aKey];
        };
        CDrawnElements.prototype.forEach = function (fn) {
            var key;
            for (key in this._drawnElements) {
                if (this._drawnElements.hasOwnProperty(key)) {
                    if (fn(key, this._drawnElements[key])) {
                        break;
                    }
                }
            }
        };
        CDrawnElements.prototype.setAnimation = function (aEnable) {
            if (aEnable) {
                this.forEach(function (aKey, aItem) {
                    aItem.style[KCssPropTransition] = KCssTransitionParamPos;
                    return false;
                });
            }
            else {
                this.forEach(function (aKey, aItem) {
                    delete aItem.style[KCssPropTransition];
                    return false;
                });
            }
        };
        return CDrawnElements;
    })();
    Controls.CDrawnElements = CDrawnElements;
    var CDataProvider = (function (_super) {
        __extends(CDataProvider, _super);
        function CDataProvider() {
            _super.call(this);
            this.registerSignal(['ItemInserted', 'ItemUpdated', 'ItemMoved', 'ItemRemoved', 'ItemRefreshed']);
        }
        CDataProvider.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        CDataProvider.prototype.getItem = function (aKey) {
            throw "not implemented";
            return null;
        };
        CDataProvider.prototype.getLength = function () {
            throw "not implemented";
            return 0;
        };
        CDataProvider.prototype.insertItem = function (aKey, aItem) {
            this._doInsertItems(aKey, aItem);
            this.emit("ItemInserted", aKey, aItem);
        };
        CDataProvider.prototype._doInsertItems = function (aKey, aItem) {
        };
        CDataProvider.prototype.removeItems = function (aKeys) {
            this._doRemoveItems(aKeys);
            this.emit("ItemRemoved", aKeys);
        };
        CDataProvider.prototype._doRemoveItems = function (aKeys) {
        };
        CDataProvider.prototype.updateItems = function (aKeys, aItems) {
            this._doUpdateItems(aKeys, aItems);
            this.emit("ItemUpdated", aKeys, aItems);
        };
        //_doUpdateItems: (aKey: any[], aItem: any[]) => boolean;
        CDataProvider.prototype._doUpdateItems = function (aKey, aItem) {
            return false;
        };
        CDataProvider.prototype.connectItemInserted = function (aHolder, aSlotName, aHandler) {
            this.connect("ItemInserted", aHolder, aSlotName);
        };
        CDataProvider.prototype.connectItemRemoved = function (aHolder, aSlotName, aHandler) {
            this.connect("ItemRemoved", aHolder, aSlotName);
        };
        CDataProvider.prototype.connectItemUpdated = function (aHolder, aSlotName, aHandler) {
            this.connect("ItemUpdated", aHolder, aSlotName);
        };
        return CDataProvider;
    })(CSignalSource);
    Controls.CDataProvider = CDataProvider;
    var CListDataProvider = (function (_super) {
        __extends(CListDataProvider, _super);
        function CListDataProvider(aArray, aRolling) {
            _super.call(this);
            this._bDataRolling = aRolling;
            this._listData = (this._bDataRolling) ? new CCircularArray(aArray) : aArray.slice(0);
            this.getItem = this._getItem;
            this.getLength = this._getLength;
            this._doInsertItems = this._insertItems;
            this._doRemoveItems = this._removeItems;
            this._doUpdateItems = this._updateItems;
        }
        CListDataProvider.prototype._getItem = function (aKey) {
            return (this._bDataRolling) ? this._listData.at(aKey) : this._listData[aKey];
        };
        CListDataProvider.prototype._getLength = function () {
            return (this._bDataRolling) ? this._listData.length() : this._listData.length;
        };
        CListDataProvider.prototype._insertItems = function (aKey, aItems) {
            var list = this._listData;
            if (aItems.length) {
                var front, end;
                front = list.slice(0, aKey);
                end = list.slice(aKey);
                this._listData = front.concat(aItems, end);
            }
            else {
                this._listData.splice(aKey, 0, aItems);
            }
        };
        CListDataProvider.prototype._removeItems = function (aKey) {
            var i;
            for (i = aKey.length - 1; i >= 0; i--) {
                this._listData.splice(i, 1);
            }
        };
        CListDataProvider.prototype._updateItems = function (aKey, aItem) {
            var i, len;
            if (aItem) {
                for (i = 0, len = aKey.length; i < len; i++) {
                    this._listData[aKey[i]] = aItem[i];
                }
            }
            return true;
        };
        return CListDataProvider;
    })(CDataProvider);
    Controls.CListDataProvider = CListDataProvider;
    var CGridDataProvider = (function (_super) {
        __extends(CGridDataProvider, _super);
        function CGridDataProvider(aArray) {
            _super.call(this);
        }
        return CGridDataProvider;
    })(CDataProvider);
    Controls.CGridDataProvider = CGridDataProvider;
    var CDataControl = (function (_super) {
        __extends(CDataControl, _super);
        function CDataControl(aElement) {
            _super.call(this, aElement);
            this._redrawAfterOperation = false;
            this._drawnElements = new CDrawnElements();
            this.registerSignal(["DataItemSelected", "FocusedDataItemChanged"]);
        }
        CDataControl.prototype.destroy = function () {
            this._drawnElements.destroy();
            this._ownedDataProvider.destroy();
        };
        CDataControl.prototype.draw = function (aRect) {
            if (!this._drawer) {
                throw "data drawer must be provided to draw";
            }
            _super.prototype.draw.call(this, aRect);
        };
        CDataControl.prototype.setDataDrawer = function (aDrawer) {
            this._drawer = aDrawer;
        };
        CDataControl.prototype.getFocusedItemInfo = function () {
            var el = this.getFocusedElement();
            var key, item;
            if (el) {
                key = el.attributes["data"];
                item = this._ownedDataProvider.getItem(key);
                return {
                    el: el,
                    key: key,
                    item: item
                };
            }
            return null;
        };
        CDataControl.prototype.setFocusedItem = function (aKey) {
            var el = this._drawnElements.getElement(aKey);
            if (el) {
                this.setFocusedElement(el);
            }
        };
        CDataControl.prototype.doItemChagned = function (aKeys) {
        };
        CDataControl.prototype.doItemInserted = function (aKey, aItems, aNeedFocus) {
        };
        CDataControl.prototype.doItemRemoved = function (aKey, aUnsetFocus) {
        };
        CDataControl.prototype.setRedrawAfterOperation = function (aRedraw) {
            this._redrawAfterOperation = aRedraw;
        };
        CDataControl.prototype._slItemChanged = function (aKeys) {
            var i, len, key, el;
            for (i = 0, len = aKeys.length; i < len; i++) {
                key = aKeys[i];
                el = this._drawnElements.getElement(key);
                if (el) {
                    this._drawer(key, this._ownedDataProvider.getItem(key), el);
                }
            }
            this.doItemChagned(aKeys);
        };
        CDataControl.prototype._slItemInserted = function (aKey, aItems) {
            var _this = this;
            var drawnElements = this._drawnElements;
            var keys = Object.keys(drawnElements._drawnElements);
            var i, dest = parseInt(aKey);
            var replacedKey = keys.length;
            var element;
            var width = this.getItemWidth() || 0;
            var height = this.getItemHeight() || 0;
            var fnCreateElement = function () {
                var index = aKey.toString();
                var el = document.createElement("div");
                var item = _this._ownedDataProvider.getItem(aKey);
                el.classList.add("-list-item");
                el.attributes["data"] = index;
                el.style.position = "absolute";
                el.style.top = index * height + "px";
                el.style.left = index * width + "px";
                var focusInfo = _this._drawer(aKey, item, el);
                if (focusInfo === 2 /* KFocusAble */) {
                    el.classList.add(KClassFocusable);
                }
                _this._element.appendChild(el);
                return el;
            };
            var needFocus = (keys.length === 0);
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
        };
        CDataControl.prototype._slItemRemoved = function (aKeys) {
            //TODO implement
        };
        CDataControl.prototype.setOwnedDataProvider = function (dataProvider) {
            var self = this;
            this._drawnElements.removeAll();
            if (this._ownedDataProvider) {
                this._ownedDataProvider.destroy();
            }
            this._ownedDataProvider = dataProvider;
            this._ownedDataProvider.connectItemUpdated(this, "_slItemChanged", this._slItemChanged);
            this._ownedDataProvider.connectItemInserted(this, "_slItemInserted", this._slItemInserted);
            this._ownedDataProvider.connectItemRemoved(this, "_slItemRemoved", this._slItemRemoved);
        };
        CDataControl.prototype.clearDrawnElements = function () {
            this._clearDrawnElements();
        };
        CDataControl.prototype._clearDrawnElements = function () {
            this._drawnElements.removeAll();
        };
        CDataControl.prototype._setDrawnElement = function (aKey, el) {
            this._drawnElements.setElement(aKey, el);
        };
        CDataControl.prototype._getDrawnElement = function (aKey) {
            return this._drawnElements.getElement(aKey);
        };
        CDataControl.prototype._getDrawnElements = function () {
            return this._drawnElements.getElements();
        };
        CDataControl.prototype._removeDrawnElement = function (aKey) {
            this._drawnElements.remove(aKey);
            this._prevDrawnElements.remove(aKey);
        };
        CDataControl.prototype._pickDrawnElements = function () {
            var ret = this._drawnElements;
            this._drawnElements = new CDrawnElements();
            return ret;
        };
        CDataControl.prototype._setPrevDrawnElements = function (aDrawnElements) {
            if (this._prevDrawnElements) {
                this._prevDrawnElements.destroy();
            }
            aDrawnElements.forEach(function (aKey, aEl) {
                aEl.classList.remove(KClassActiveFocusedLeaf);
                aEl.classList.remove(KClassFocused);
                return false;
            });
            this._prevDrawnElements = aDrawnElements;
        };
        CDataControl.prototype._handleFocusChanged = function (aElOld, aElNew) {
            _super.prototype._handleFocusChanged.call(this, aElOld, aElNew);
            var keyNew = this._drawnElements.getKey(aElNew);
            var keyOld = this._drawnElements.getKey(aElOld);
            var itemNew = this._ownedDataProvider.getItem(keyNew);
            var itemOld = this._ownedDataProvider.getItem(keyOld);
            this._emitFocusedDataItemChanged(keyNew, itemNew, aElNew, keyOld, itemOld, aElOld);
        };
        /*
         Signals
         */
        CDataControl.prototype._doKeyEnterLatent = function () {
            _super.prototype._doKeyEnterLatent.call(this);
            var focusedInfo = this.getFocusedItemInfo();
            this._emitDataItemSelected(focusedInfo.key, focusedInfo.item, focusedInfo.el);
            return true;
        };
        CDataControl.prototype.connectDataItemSelected = function (aHolder, aSlotName, aSlot) {
            this.connect("DataItemSelected", aHolder, aSlotName);
        };
        CDataControl.prototype._emitDataItemSelected = function (aKey, aItem, aEl) {
            this.emit.call(this, "DataItemSelected", aKey, aItem, aEl);
        };
        CDataControl.prototype.connectFocusedDataItemChanged = function (aHolder, aSlotName, aSlot) {
            this.connect("FocusedDataItemChanged", aHolder, aSlotName);
        };
        CDataControl.prototype._emitFocusedDataItemChanged = function (aKeyNew, aItemNew, aElNew, aKeyOld, aItemOld, aElOld) {
            this.emit.call(this, "FocusedDataItemChanged", aKeyNew, aItemNew, aElNew, aKeyOld, aItemOld, aElOld);
        };
        return CDataControl;
    })(CControl);
    Controls.CDataControl = CDataControl;
    var CListDataControl = (function (_super) {
        __extends(CListDataControl, _super);
        function CListDataControl(aElement, aRolling) {
            _super.call(this, aElement);
            this._bDataRolling = aRolling;
            this._element.classList.add("-list");
            this.registerSignal(["ItemInserted", "ItemRemoved"]);
        }
        CListDataControl.prototype.doItemInserted = function (aKey, aItems, aNeedFocus) {
            this.emit.call(this, "ItemInserted", this._drawnElements, aNeedFocus);
        };
        CListDataControl.prototype.doItemRemoved = function (aKey, aUnsetFocus) {
            this.emit.call(this, "ItemRemoved", this._drawnElements, aUnsetFocus);
        };
        CListDataControl.prototype.doItemChanged = function (aKeys) {
            var i, len, key, drawnEl;
            for (i = 0, len = aKeys.length; i < len; i++) {
                key = aKeys[i];
                drawnEl = this._getDrawnElement(key);
                if (drawnEl) {
                    this._drawer(key, this._ownedDataProvider.getItem(key), drawnEl);
                }
            }
        };
        CListDataControl.prototype.setDataRolling = function (aRolling) {
            this._bDataRolling = aRolling;
        };
        CListDataControl.prototype.getDataRolling = function () {
            return this._bDataRolling;
        };
        CListDataControl.prototype.getSize = function () {
            var itemHeight = this._getDrawParam(KParamStrItemHeight) || 0;
            var itemWidth = this._getDrawParam(KParamStrItemWidth) || 0;
            var horizontal = (this._getDrawParam(KParamStrOrientation) === 2 /* EHorizontal */);
            var count = this._ownedDataProvider ? this._ownedDataProvider.getLength() : 0;
            if (this._bDataRolling) {
                var w = horizontal ? Number.MAX_VALUE : itemWidth;
                var h = horizontal ? itemHeight : Number.MAX_VALUE;
            }
            else {
                var w = horizontal ? itemWidth * count : itemWidth;
                var h = horizontal ? itemHeight : itemHeight * count;
            }
            return {
                width: w,
                height: h
            };
        };
        CListDataControl.prototype._doDraw = function (aRect, aDrawParam) {
            var focusableElements = [];
            var horizontal = (aDrawParam[KParamStrOrientation] === 2 /* EHorizontal */);
            var dp = this._ownedDataProvider;
            var fixedItemSize = horizontal ? aDrawParam[KParamStrItemWidth] : aDrawParam[KParamStrItemHeight];
            var drawPosStart = horizontal ? aRect.left : aRect.top;
            var drawPosEnd = horizontal ? aRect.right : aRect.bottom;
            var drawSize = horizontal ? aRect.getHeight() : aRect.getWidth();
            var posProp = horizontal ? "left" : "top";
            var startIndex = drawSize ? Math.floor(drawPosStart / fixedItemSize) : 0;
            var itemCount = this._bDataRolling ? startIndex + dp.getLength() : dp.getLength();
            var i;
            var prevDrawnItem = this._pickDrawnElements();
            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            this._keyMapBuilder = horizontal ? Controls.KBuilderLeftRight : Controls.KBuilderTopDown;
            for (i = startIndex; i < itemCount; i++) {
                var elPosStart = i * fixedItemSize;
                var elPosEnd = elPosStart + fixedItemSize;
                if (elPosStart <= drawPosEnd) {
                    // draw element if necessary
                    var el = prevDrawnItem.pickElement(i);
                    var item = dp.getItem(i);
                    if (!el) {
                        el = document.createElement("div");
                        el.classList.add("-list-item");
                        el.attributes["data"] = i;
                        el.style.position = "absolute";
                        el.style[posProp] = i * fixedItemSize + "px";
                        var focusInfo = this._drawer(i, item, el);
                        if (focusInfo === 2 /* KFocusAble */) {
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
                        }
                        else {
                            contentAvailable.up = drawPosStart - elPosStart;
                        }
                    }
                    if (drawPosEnd < elPosEnd) {
                        if (horizontal) {
                            contentAvailable.right = elPosEnd - drawPosEnd;
                        }
                        else {
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
            }
            else {
                if (contentAvailable.up === 0 && startIndex) {
                    contentAvailable.up = fixedItemSize;
                }
                if (contentAvailable.down === 0 && i !== itemCount) {
                    contentAvailable.down = fixedItemSize;
                }
            }
            this._contentAvail = contentAvailable;
            return focusableElements;
        };
        CListDataControl.prototype.prependItem = function (aItem) {
            this._ownedDataProvider.insertItem(0, aItem);
        };
        CListDataControl.prototype.insertItem = function (position, aItem) {
            this._ownedDataProvider.insertItem(position, aItem);
        };
        CListDataControl.prototype.appendItem = function (aItem) {
            this._ownedDataProvider.insertItem(this._ownedDataProvider.getLength(), aItem);
        };
        CListDataControl.prototype.removeItem = function (index) {
            this._ownedDataProvider.removeItems([index]);
        };
        CListDataControl.prototype.removeItems = function (index) {
            this._ownedDataProvider.removeItems(index);
        };
        return CListDataControl;
    })(CDataControl);
    Controls.CListDataControl = CListDataControl;
    var CGridDataControl = (function (_super) {
        __extends(CGridDataControl, _super);
        function CGridDataControl(aElement) {
            _super.call(this, aElement);
            this._element.classList.add("-grid");
        }
        CGridDataControl.prototype.getSize = function () {
            var itemHeight = this._getDrawParam(KParamStrItemHeight) || 0;
            var itemWidth = this._getDrawParam(KParamStrItemWidth) || 0;
            var maxColCount = this._getDrawParam(KParamStrMaxColCount) || 1;
            var count = this._ownedDataProvider.getLength();
            var w = itemWidth * maxColCount;
            var h = itemHeight * Math.ceil(count / maxColCount);
            return {
                width: w,
                height: h
            };
        };
        CGridDataControl.prototype._doDraw = function (aRect, aDrawParam) {
            var focusableElements = [];
            var dp = this._ownedDataProvider;
            var itemCount = dp.getLength();
            var itemWidth = aDrawParam[KParamStrItemWidth];
            var itemHeight = aDrawParam[KParamStrItemHeight];
            var maxColCount = aDrawParam[KParamStrMaxColCount];
            var curCol = aRect ? Math.floor(aRect.left / itemWidth) : 0;
            var curRow = aRect ? Math.floor(aRect.top / itemHeight) : 0;
            var startIndex = aRect ? curRow * maxColCount + curCol : 0;
            var prevDrawnItem = this._pickDrawnElements();
            var contentAvailable = {
                up: 0,
                left: 0,
                right: 0,
                down: 0
            };
            var i;
            this._keyMapBuilder = Controls.KBuilderGrid;
            for (i = startIndex; i < itemCount; i++) {
                var colCount = i % maxColCount;
                var rowCount = Math.floor(i / maxColCount);
                var elTop = rowCount * itemHeight;
                var elLeft = colCount * itemWidth;
                var elBottom = elTop + itemHeight;
                var elRight = elLeft + itemWidth;
                if (elTop <= aRect.bottom && elLeft <= aRect.right) {
                    var el = prevDrawnItem.pickElement(i);
                    var item = dp.getItem(i);
                    if (!el) {
                        el = document.createElement('div');
                        el.setAttribute("data", i);
                        el.classList.add('-grid-item');
                        el.attributes['data'] = i;
                        el.style.position = 'absolute';
                        el.style.top = elTop + 'px';
                        el.style.left = elLeft + 'px';
                        var focusInfo = this._drawer(i, item, el);
                        if (focusInfo === 2 /* KFocusAble */) {
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
                    }
                    else if (elRight > aRect.right) {
                        contentAvailable.right = elRight - aRect.right;
                    }
                    else if (elTop < aRect.top) {
                        contentAvailable.up = aRect.top - elTop;
                    }
                    else if (elLeft < aRect.left) {
                        contentAvailable.left = aRect.left - elLeft;
                    }
                }
            }
            prevDrawnItem.destroy();
            if (contentAvailable.up === 0 && curRow) {
                contentAvailable.up = itemHeight;
            }
            else if (contentAvailable.down === 0 && i !== itemCount) {
                contentAvailable.down = itemHeight;
            }
            else if (contentAvailable.left === 0 && curCol) {
                contentAvailable.left = itemWidth;
            }
            else if (contentAvailable.right === 0 && i !== itemCount) {
                contentAvailable.right = itemWidth;
            }
            this._contentAvail = contentAvailable;
            return focusableElements;
        };
        return CGridDataControl;
    })(CDataControl);
    Controls.CGridDataControl = CGridDataControl;
    (function (TDrawingDataGrouping) {
        TDrawingDataGrouping[TDrawingDataGrouping["ENone"] = 0] = "ENone";
        TDrawingDataGrouping[TDrawingDataGrouping["ERow"] = 1] = "ERow";
        TDrawingDataGrouping[TDrawingDataGrouping["ECol"] = 2] = "ECol";
        TDrawingDataGrouping[TDrawingDataGrouping["EFreeStyle"] = 3] = "EFreeStyle";
    })(Controls.TDrawingDataGrouping || (Controls.TDrawingDataGrouping = {}));
    var TDrawingDataGrouping = Controls.TDrawingDataGrouping;
    var CDrawingDataProvider = (function (_super) {
        __extends(CDrawingDataProvider, _super);
        function CDrawingDataProvider(aGrouping) {
            _super.call(this);
            this._drawingDataCache = {};
            this._drawingDataByRow = {};
            this._grouping = aGrouping;
            this.getItem = this._doGetItem;
        }
        CDrawingDataProvider.prototype.destroy = function () {
            this._drawingDataCache = null;
        };
        CDrawingDataProvider.prototype.getItem = function (aKey) {
            return this._drawingDataCache[aKey];
        };
        CDrawingDataProvider.prototype.getLength = function () {
            return Object.keys(this._drawingDataCache).length;
        };
        CDrawingDataProvider.prototype.getPrevDrawingDataByRow = function (aRowIndex) {
            return this._drawingDataByRow[aRowIndex];
        };
        // get drawing data
        CDrawingDataProvider.prototype.getDrawingDataList = function (aRect, aFocusedInfo, aCallback) {
            var _this = this;
            if (this._grouping && this._doGetDrawingDataListByRow) {
            }
            this._doDrawingDataList(aRect, aFocusedInfo, function (aDrawingDataList) {
                var i, len, drawingData;
                for (i = 0, len = aDrawingDataList.length; i < len; i++) {
                    drawingData = aDrawingDataList[i];
                    _this._handleNewItem(drawingData);
                }
                aCallback(aDrawingDataList);
            });
        };
        // get whole drawable area
        CDrawingDataProvider.prototype.getSize = function () {
            throw "implement this";
        };
        CDrawingDataProvider.prototype._doDrawingDataList = function (aRect, aFocusedInfo, aCallback) {
            throw "implement this";
        };
        CDrawingDataProvider.prototype._handleNewItem = function (aDrawingData, aInserted) {
            if (aInserted === void 0) { aInserted = false; }
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
        };
        CDrawingDataProvider.prototype._doGetItem = function (aKey) {
            return this._drawingDataCache[aKey];
        };
        /*protected*/ CDrawingDataProvider.prototype._doUpdateItems = function (aKey, aItem) {
            return true;
        };
        /*protected*/ CDrawingDataProvider.prototype._doInsertItems = function (aKey, aItems) {
            var i, len;
            for (i = 0, len = aItems.length; i < len; i += 1) {
                this._handleNewItem(aItems[i], true);
            }
        };
        /*protected*/ CDrawingDataProvider.prototype._doRemoveItems = function (aKeys) {
            var i, iLen, k, item, j, jLen, rowList;
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
        };
        return CDrawingDataProvider;
    })(CDataProvider);
    Controls.CDrawingDataProvider = CDrawingDataProvider;
    var CDrawingDataControl = (function (_super) {
        __extends(CDrawingDataControl, _super);
        function CDrawingDataControl(aElement) {
            _super.call(this, aElement);
            this._currentRowIndex = 0;
            this.registerSignal(["RowIndexChanged"]);
        }
        CDrawingDataControl.prototype.getSize = function () {
            return this._ownedDataProvider.getSize();
        };
        CDrawingDataControl.prototype.destroy = function () {
            this._ownedDataProvider.destroy();
        };
        CDrawingDataControl.prototype.setOwnedDataProvider = function (aDrawingDataProvider) {
            this._ownedDataProvider = aDrawingDataProvider;
            this._ownedDataProvider.connectItemInserted(this, "_dataInserted", this._dataInserted);
            this._ownedDataProvider.connectItemUpdated(this, "_dataUpdated", this._dataUpdated);
            this._ownedDataProvider.connectItemRemoved(this, "_dataRemoved", this._dataRemoved);
        };
        CDrawingDataControl.prototype.setDataDrawer = function (aDrawingDataDrawer) {
            this._drawer = aDrawingDataDrawer;
        };
        CDrawingDataControl.prototype._changeCurrentRow = function (aRowIndex) {
            if (this._currentRowIndex != aRowIndex) {
                this._currentRowIndex = aRowIndex;
                this._emitRowIndexChanged(aRowIndex);
                return true;
            }
            return false;
        };
        /*
         private _handleFocusGained() {
         var el: HTMLElement = this.getFirstElementByRow(this._curretRowIndex);
         this.setFocusedElement(el);
         }
         */
        CDrawingDataControl.prototype.setCurrentRow = function (aRowIndex) {
            if (this._changeCurrentRow(aRowIndex)) {
                var el = this.getFirstElementByRow(this._currentRowIndex);
                if (el) {
                    this.setFocusedElement(el);
                }
            }
        };
        CDrawingDataControl.prototype.getCurrentRow = function () {
            return this._currentRowIndex;
        };
        CDrawingDataControl.prototype.getFirstElementByRow = function (aRowIndex) {
            var el, rowIndexStr = "" + aRowIndex;
            this._drawnElements.forEach(function (aKey, aItem) {
                if (aItem.attributes["data-row-index"] == rowIndexStr) {
                    el = aItem;
                    return true;
                }
            });
            return el;
        };
        CDrawingDataControl.prototype.connectRowIndexChanged = function (aHolder, aSlotName, aSlot) {
            this.connect("RowIndexChanged", aHolder, aSlotName);
        };
        CDrawingDataControl.prototype._emitRowIndexChanged = function (aRowIndex) {
            this.emit.call(this, "RowIndexChanged", aRowIndex);
        };
        CDrawingDataControl.prototype._handleFocusChanged = function (aElOld, aElNew) {
            _super.prototype._handleFocusChanged.call(this, aElOld, aElNew);
            if (aElNew.attributes["data-row-index"]) {
                var rowIndex = parseInt(aElNew.attributes["data-row-index"], 10);
                this._changeCurrentRow(rowIndex);
            }
        };
        CDrawingDataControl.prototype._doDraw = function (aRect, aDrawParam) {
            var _this = this;
            var focusableElements = [];
            var drawingSize = this._ownedDataProvider.getSize();
            this._element.style.width = drawingSize.width + "px";
            this._element.style.height = drawingSize.height + "px";
            this._keyMapBuilder = Controls.KBuilderWeightDistance;
            var intersectedRect;
            var focusedInfo = this.getFocusedItemInfo();
            var rect = new TRect({
                top: aRect.top,
                left: aRect.left,
                right: aRect.right,
                bottom: aRect.bottom
            });
            if (this._drawnRect) {
                var scrollScheme = this.getVerticalScrollScheme();
                if (scrollScheme == 3 /* EByFocusRemains */ || scrollScheme == 4 /* EByFocusRemainsRolling */) {
                    if (rect.top < this._drawnRect.bottom && this._drawnRect.bottom < rect.bottom) {
                        rect.top = Math.max(this._drawnRect.bottom, rect.top);
                    }
                    if (rect.top < this._drawnRect.top && this._drawnRect.top < rect.bottom) {
                        rect.bottom = Math.min(this._drawnRect.top, rect.bottom);
                    }
                }
            }
            this._ownedDataProvider.getDrawingDataList(rect, focusedInfo, function (aDrawingDataList) {
                var i, len, drawingData, el;
                var drawnElements = _this._pickDrawnElements();
                drawnElements.forEach(function (aKey, aItem) {
                    if (_this._isItemFocusable(aRect, aKey, aItem)) {
                        drawnElements.pickElement(aKey);
                        focusableElements.push(aItem);
                        _this._setDrawnElement(aKey, aItem);
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
                            el = _this._createDrawItem(drawingData);
                        }
                        if (el.classList.contains(KClassFocusable) && intersectedRect.getWidth() && intersectedRect.getWidth() <= drawingData.rect.getWidth() && intersectedRect.getHeight() && intersectedRect.getHeight() <= drawingData.rect.getHeight()) {
                            if (intersectedRect.right < aRect.right || intersectedRect.right == _this._element.offsetWidth || intersectedRect.getWidth() >= aRect.getWidth()) {
                                focusableElements.push(el);
                            }
                        }
                        if (!focused && drawingData.rowIndex == _this._currentRowIndex) {
                            focused = true;
                            el.classList.add(KClassFocused);
                        }
                        _this._setDrawnElement(drawingData.key, el);
                    }
                }
                _this._setPrevDrawnElements(drawnElements);
            });
            this._drawnRect = aRect;
            console.log("data: " + this._ownedDataProvider.getLength() + " drawn: " + this._drawnElements.getCount());
            return focusableElements;
        };
        CDrawingDataControl.prototype._createDrawItem = function (aDrawingData) {
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
            if (this._drawer(aDrawingData.key, aDrawingData, el) === 2 /* KFocusAble */) {
                el.classList.add(KClassFocusable);
            }
            return el;
        };
        CDrawingDataControl.prototype._isItemFocusable = function (aDrawRect, aKey, aDrawnElement) {
            var el = aDrawnElement || this._getDrawnElement(aKey);
            if (el.classList.contains(KClassFocusable)) {
                var drawingData = this._ownedDataProvider.getItem(aKey);
                if (drawingData) {
                    var rect = drawingData.rect;
                    var intersectedRect = aDrawRect.getIntersectedRect(drawingData.rect);
                    if (intersectedRect && intersectedRect.getWidth() == rect.getWidth() && intersectedRect.getHeight() == rect.getHeight()) {
                        return true;
                    }
                }
            }
            return false;
        };
        CDrawingDataControl.prototype._dataInserted = function (aKey, aItems) {
            var i, len;
            var drawnElements = this._getDrawnElements();
            var drawingData, drawnElement;
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
        };
        CDrawingDataControl.prototype._dataUpdated = function (aKeys, aItems) {
            var i, len, key;
            for (i = 0, len = aKeys.length; i < len; i++) {
                key = aKeys[i];
                this._drawer(key, this._ownedDataProvider.getItem(key), this._getDrawnElement(key));
            }
        };
        CDrawingDataControl.prototype._dataRemoved = function (aKeys) {
            var i, len, k;
            for (i = 0, len = aKeys.length; i < len; i += 1) {
                k = aKeys[i];
                this._removeDrawnElement(k);
            }
        };
        return CDrawingDataControl;
    })(CDataControl);
    Controls.CDrawingDataControl = CDrawingDataControl;
    var CGroupControl = (function (_super) {
        __extends(CGroupControl, _super);
        function CGroupControl(aElement) {
            _super.call(this, aElement, "-group");
            this._group = true;
            this._child = [];
            this.registerSignal(["ChildFocusChanged"]);
            this.registerSignal(["ChildViewMoved"]);
        }
        CGroupControl.prototype.destroy = function () {
            this._destroyChild();
        };
        CGroupControl.prototype._destroyChild = function () {
            var i, len, c;
            for (i = 0, len = this._child; i < len; i++) {
                c = this._child[i];
                c.destroy();
            }
        };
        CGroupControl.prototype.setKeyBuilder = function (aLayout) {
            if (aLayout == 1 /* EVertical */) {
                this._keyMapBuilder = Controls.KBuilderTopDown;
            }
            else if (aLayout == 2 /* EHorizontal */) {
                this._keyMapBuilder = Controls.KBuilderLeftRight;
            }
            else {
                this._keyMapBuilder = Controls.KBuilderLeftRight;
            }
        };
        CGroupControl.prototype.setOwnedChildControls = function (aChildControls) {
            this._destroyChild();
            var i, len;
            for (i = 0, len = aChildControls.length; i < len; i += 1) {
                aChildControls[i].setParent(this);
            }
            this._child = aChildControls;
        };
        CGroupControl.prototype.insertOwnedChild = function (aIndex, aControl) {
            this._child.unshift(aControl);
        };
        CGroupControl.prototype.appendOwnedChild = function (aControl) {
            this._child.push(aControl);
        };
        CGroupControl.prototype.removeOwnedControl = function (aControl) {
            var index = this._child.indexOf(aControl);
            if (index != -1) {
                this._child.splice(index, 1);
                aControl.destroy();
            }
        };
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
        CGroupControl.prototype.doKey = function (aKeyStr, aParam) {
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
                var i, len, c, bUpdated, size = this.getSize();
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
        };
        CGroupControl.prototype.draw = function (aRect) {
            _super.prototype.draw.call(this, aRect);
            if (this._root) {
                this.setActiveFocus();
            }
        };
        CGroupControl.prototype._doDraw = function (aRect, aDrawParam) {
            return this._doDrawCommon(this._element, aRect, aDrawParam);
        };
        CGroupControl.prototype._doDrawCommon = function (aParent, aRect, aDrawParam) {
            var ret = [];
            if (this._root) {
                this._element.classList.add(KClassFocused);
            }
            var i, len, c, el;
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
        };
        CGroupControl.prototype.getFocusedChild = function () {
            var i, len, c;
            for (i = 0, len = this._child.length; i < len; i++) {
                c = this._child[i];
                if (c.isFocused()) {
                    return c;
                }
            }
            return null;
        };
        CGroupControl.prototype._setActiveFocus = function (aFocus) {
            var focusedChild;
            if (this.isFocusable()) {
                focusedChild = this.getFocusedChild();
                focusedChild._setActiveFocus(aFocus);
            }
        };
        CGroupControl.prototype.setActiveFocus = function () {
            this._setActiveFocus(true);
        };
        CGroupControl.prototype._handleFocusChanged = function (elOld, elNew) {
            var oldIndex = parseInt(elOld.attributes["data"]);
            var newIndex = parseInt(elNew.attributes["data"]);
            var oldChild = this._child[oldIndex];
            var newChild = this._child[newIndex];
            oldChild._setActiveFocus(false);
            newChild._setActiveFocus(true);
            this._emitChildFocusChanged(oldChild, newChild);
        };
        // CGroupControl events
        CGroupControl.prototype.connectChildFocusChanged = function (aHolder, aSlotName, aSlot) {
            this.connect("ChildFocusChanged", aHolder, aSlotName);
        };
        CGroupControl.prototype._emitChildFocusChanged = function (aOld, aNew) {
            this.emit.call(this, "ChildFocusChanged", aOld, aNew);
        };
        CGroupControl.prototype._handleViewMoved = function (aControl, aIncrement) {
            this._emitChildViewMoved(aControl, aIncrement);
        };
        CGroupControl.prototype.connectChildViewMoved = function (aHolder, aSlotName, aSlot) {
            this.connect("ChildViewMoved", aHolder, aSlotName);
        };
        CGroupControl.prototype._emitChildViewMoved = function (aControl, aIncrement) {
            this.emit.call(aControl, "ChildViewMoved", this, aIncrement);
        };
        return CGroupControl;
    })(CControl);
    Controls.CGroupControl = CGroupControl;
    var FLayoutElement = function (aEl, aChild, aOrientation, aVAlign, aHAlign, aMargins, aPadding) {
        if (aEl.offsetHeight == 0 && aVAlign != 0 /* EUnkown */) {
            throw "vertical align meaningless without height";
        }
        if (aEl.offsetWidth == 0 && aHAlign != 0 /* EUnkown */) {
            throw "horizontal align meaningless without width";
        }
        var maxWidth = 0;
        var maxHeight = 0;
        var totalWidth = 0;
        var totalHeight = 0;
        var i, len, el, w, h;
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
        if (aOrientation == 2 /* EHorizontal */) {
            FLayoutElementHorizontal(aEl, aChild, aVAlign, aHAlign, aMargins, aPadding, maxWidth, maxHeight, totalWidth, totalHeight);
        }
        else {
            FLayoutElementVertical(aEl, aChild, aVAlign, aHAlign, aMargins, aPadding, maxWidth, maxHeight, totalWidth, totalHeight);
        }
    };
    var FLayoutElementVertical = function (aEl, aChild, aVAlign, aHAlign, aMargins, aPadding, aMaxWidth, aMaxHeight, aTotalWidth, aTotalHeight) {
        var height = aMargins.t + aTotalHeight + aMargins.b;
        var posTop = aMargins.t;
        if (aVAlign == 2 /* ECenter */) {
            posTop = (aEl.offsetHeight - aTotalHeight) / 2;
        }
        else if (aVAlign == 3 /* EBottom */) {
            posTop = aEl.offsetHeight - (aMargins.b + aTotalHeight);
        }
        var posLeft = aMargins.l;
        var i, len, el, posLeft;
        for (i = 0, len = aChild.length; i < len; i++) {
            el = aChild[i];
            if (el) {
                el.style.top = posTop + "px";
                if (aHAlign == 2 /* ECenter */) {
                    posLeft = (aEl.offsetWidth - el.offsetWidth) / 2;
                }
                else if (aHAlign == 3 /* ERight */) {
                    posLeft = aEl.offsetWidth - (aMargins.r + el.offsetWidth);
                }
                el.style.left = posLeft + "px";
                posTop += el.offsetHeight + aPadding;
            }
            else {
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
    var FLayoutElementHorizontal = function (aEl, aChild, aVAlign, aHAlign, aMargins, aPadding, aMaxWidth, aMaxHeight, aTotalWidth, aTotalHeight) {
        var width = aMargins.l + aTotalWidth + aMargins.r;
        var posLeft = aMargins.l;
        if (aHAlign == 2 /* ECenter */) {
            posLeft = (aEl.offsetWidth - aTotalWidth) / 2;
        }
        else if (aHAlign == 3 /* ERight */) {
            posLeft = aEl.offsetWidth - (aMargins.l + aTotalWidth);
        }
        var posTop = aMargins.t;
        var i, len, el, posLeft;
        for (i = 0, len = aChild.length; i < len; i++) {
            el = aChild[i];
            el.style.left = posLeft + "px";
            if (aVAlign == 2 /* ECenter */) {
                posTop = (aEl.offsetHeight - el.offsetHeight) / 2;
            }
            else if (aVAlign == 3 /* EBottom */) {
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
    var CLayoutGroupControl = (function (_super) {
        __extends(CLayoutGroupControl, _super);
        function CLayoutGroupControl(aElement) {
            _super.call(this, aElement);
        }
        CLayoutGroupControl.prototype._doDraw = function (aRect, aDrawParam) {
            var ret = _super.prototype._doDraw.call(this, aRect, aDrawParam);
            var i, len, e, childEl = [];
            for (i = 0, len = this._child.length; i < len; i++) {
                childEl.push(this._child[i]._element);
            }
            FLayoutElement(this._element, childEl, this.getOrientation(), this.getChildVAlign(), this.getChildHAlign(), this.getMargins(), this.getPadding());
            if (this.getOrientation() == 2 /* EHorizontal */) {
                this._keyMapBuilder = Controls.KBuilderLeftRight;
            }
            else {
                this._keyMapBuilder = Controls.KBuilderTopDown;
            }
            return ret;
        };
        return CLayoutGroupControl;
    })(CGroupControl);
    Controls.CLayoutGroupControl = CLayoutGroupControl;
    var CViewGroupControl = (function (_super) {
        __extends(CViewGroupControl, _super);
        function CViewGroupControl(aElement) {
            _super.call(this, aElement);
            this._element.classList.add("-view");
            this._element.style.overflow = "hidden";
            this._container = document.createElement("div");
            this._container.style.position = "absolute";
            this._container.style.top = "0px";
            this._container.style.left = "0px";
            this._element.appendChild(this._container);
            this._keyMapBuilder = Controls.KBuilderTopDown;
        }
        CViewGroupControl.prototype.setOwnedChildControls = function (aChildControls) {
            var _this = this;
            if (aChildControls.length != 1) {
                throw "just single child supported";
            }
            this._targetChild = aChildControls[0];
            aChildControls.forEach(function (c) {
                c.connectRedrawRequired(_this, "_slRedrawRequired", _this._slRedrawRequired);
            });
            _super.prototype.setOwnedChildControls.call(this, aChildControls);
        };
        CViewGroupControl.prototype._slRedrawRequired = function () {
            var _this = this;
            clearTimeout(this._redrawTimer);
            this._redrawTimer = setTimeout(function () {
                _this.draw();
            }, 0);
        };
        CViewGroupControl.prototype.setScrollScheme = function (aScheme, aFixedScrollUnit) {
            aFixedScrollUnit = aFixedScrollUnit || this.getItemHeight() || this.getItemWidth();
            _super.prototype.setScrollScheme.call(this, aScheme, aFixedScrollUnit);
            this._targetChild.setScrollScheme(aScheme, aFixedScrollUnit);
        };
        CViewGroupControl.prototype.setVerticalScrollScheme = function (aScheme, aFixedScrollUnit) {
            _super.prototype.setVerticalScrollScheme.call(this, aScheme, aFixedScrollUnit);
            this._targetChild.setVerticalScrollScheme(aScheme, aFixedScrollUnit);
        };
        CViewGroupControl.prototype.setHorizontalScrollScheme = function (aScheme, aFixedScrollUnit) {
            _super.prototype.setHorizontalScrollScheme.call(this, aScheme, aFixedScrollUnit);
            this._targetChild.setHorizontalScrollScheme(aScheme, aFixedScrollUnit);
        };
        CViewGroupControl.prototype.setKeepFocus = function (aKeepFocus) {
            _super.prototype.setKeepFocus.call(this, aKeepFocus);
            this._targetChild.setKeepFocus(aKeepFocus);
        };
        CViewGroupControl.prototype.setViewSize = function (aRect) {
            this._element.style.left = aRect.left + "px";
            this._element.style.top = aRect.top + "px";
            this._element.style.height = aRect.getHeight() + "px";
            this._element.style.width = aRect.getWidth() + "px";
        };
        CViewGroupControl.prototype._doDraw = function (aRect, aDrawParam) {
            if (this._element.offsetWidth == 0 || this._element.offsetHeight == 0) {
                throw "drawing view group without size meaning-less";
            }
            var focusableElements = [];
            var drawPosTop;
            var drawPosLeft;
            if (this.getAnimation() && this._getContainerPosForAni()) {
                drawPosTop = -this._getContainerPosForAni().top;
                drawPosLeft = -this._getContainerPosForAni().left;
                this._setContainerPosForAni(undefined);
            }
            else {
                drawPosTop = -this._container.offsetTop;
                drawPosLeft = -this._container.offsetLeft;
            }
            var drawRect = new TRect({
                top: drawPosTop,
                left: drawPosLeft,
                right: drawPosLeft + this._element.offsetWidth,
                bottom: drawPosTop + this._element.offsetHeight
            });
            var i, len, c, el; // looping param
            var childRect = new TRect; // rectangle for child control
            var childSize; // size of child control
            var drawRectForChild; // rectangle param for child control
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
                if (scrollSchemeVertical === 4 /* EByFocusRemainsRolling */ || scrollSchemeHorizontal === 4 /* EByFocusRemainsRolling */) {
                    drawRectForChild = drawRect;
                }
                else {
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
        };
        CViewGroupControl.prototype._getNextMove = function (aKeyStr, aControl) {
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
        };
        CViewGroupControl.prototype._setContainerPosForAni = function (aPosition) {
            this._containerPosForAni = aPosition;
        };
        CViewGroupControl.prototype._getContainerPosForAni = function () {
            return this._containerPosForAni;
        };
        CViewGroupControl.prototype._getContainerPos = function () {
            var containerTop = this._container.offsetTop;
            var containerLeft = this._container.offsetLeft;
            return {
                top: containerTop,
                left: containerLeft
            };
        };
        CViewGroupControl.prototype.doKey = function (aKeyStr, aParam) {
            if (this.isTransitioning()) {
                return true;
            }
            var handled = _super.prototype.doKey.call(this, aKeyStr);
            if (!handled) {
                var focusedChild = this.getFocusedChild();
                focusedChild.updateContentAvail(aKeyStr, this._drawnRect);
                var increment = this._getNextMove(aKeyStr, focusedChild);
                if (increment.top || increment.left) {
                    this._handleViewMoved(this, increment);
                    var scrollScheme = this.getVerticalScrollScheme();
                    if ((aKeyStr == KKeyStrUp || aKeyStr == KKeyStrDown) && (scrollScheme == 3 /* EByFocusRemains */ || scrollScheme == 4 /* EByFocusRemainsRolling */)) {
                        this.setKeepFocus(true);
                    }
                    this.moveDrawPosition(increment);
                    handled = true;
                }
            }
            return handled;
        };
        CViewGroupControl.prototype.moveDrawPosition = function (aPosition) {
            var contPos = this._getContainerPos();
            this.setDrawPosition({
                top: contPos.top + aPosition.top,
                left: contPos.left + aPosition.left
            });
        };
        CViewGroupControl.prototype.initDrawPosition = function (aPosition) {
            var pos = (aPosition) ? aPosition : { top: 0, left: 0 };
            this._setContainerPosForAni(pos);
            this._container.style.top = pos.top + "px";
            this._container.style.left = pos.left + "px";
            this.draw();
        };
        CViewGroupControl.prototype.setDrawPosition = function (aPosition) {
            var _this = this;
            if (this.getAnimation()) {
                Util.afterTransition(this._container, function () {
                    _this.setTransition(false);
                    _this.draw();
                });
                this._setContainerPosForAni(aPosition);
                this.setTransition(true);
                this._container.style.top = aPosition.top + "px";
                this._container.style.left = aPosition.left + "px";
            }
            else {
                this._container.style.top = aPosition.top + "px";
                this._container.style.left = aPosition.left + "px";
                this.draw();
            }
        };
        CViewGroupControl.prototype.setAnimation = function (aAnimation) {
            _super.prototype.setAnimation.call(this, aAnimation);
            if (aAnimation) {
                this._container.style[KCssPropTransition] = KCssTransitionParamPos;
            }
        };
        return CViewGroupControl;
    })(CGroupControl);
    Controls.CViewGroupControl = CViewGroupControl;
    var CListControl = (function (_super) {
        __extends(CListControl, _super);
        function CListControl(aElement) {
            _super.call(this, aElement);
            this._listDataControl = new CListDataControl(null);
            this.setOwnedChildControls([this._listDataControl]);
            this.setListData([]);
            this.connectItemInserted(this, "_slItemInserted", this._slItemInserted);
            this.connectItemRemoved(this, "_slItemRemoved", this._slItemRemoved);
        }
        CListControl.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
        };
        CListControl.prototype.setDataRolling = function (aRolling) {
            this._listDataControl.setDataRolling(aRolling);
        };
        CListControl.prototype.getDataRolling = function () {
            return this._listDataControl.getDataRolling();
        };
        CListControl.prototype.setItemHeight = function (aItemHeight) {
            _super.prototype.setItemHeight.call(this, aItemHeight);
            this._listDataControl.setItemHeight(aItemHeight);
        };
        CListControl.prototype.setItemWidth = function (aItemWidth) {
            _super.prototype.setItemWidth.call(this, aItemWidth);
            this._listDataControl.setItemWidth(aItemWidth);
        };
        CListControl.prototype.setOrientation = function (aLayout) {
            this._listDataControl._setDrawParam(KParamStrOrientation, aLayout, false);
        };
        CListControl.prototype.setListData = function (aData, aDataRolling) {
            var bRolling = (aDataRolling) ? aDataRolling : false;
            this.setDataRolling(bRolling);
            this._listDataControl.setOwnedDataProvider(new CListDataProvider(aData, bRolling));
        };
        CListControl.prototype.setOwnedDataProvider = function (aDataProvider) {
            this._listDataControl.setOwnedDataProvider(aDataProvider);
        };
        CListControl.prototype.setDataDrawer = function (aDrawer) {
            this._listDataControl.setDataDrawer(aDrawer);
        };
        CListControl.prototype.getFocusedElement = function () {
            return this._listDataControl.getFocusedElement();
        };
        CListControl.prototype.setFocusedItem = function (aKey) {
            this._listDataControl.setFocusedItem(aKey);
        };
        CListControl.prototype.getListDataControl = function () {
            return this._listDataControl;
        };
        CListControl.prototype.connectFocusChanged = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectFocusChanged(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectFocusGained = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectFocusGained(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectFocusLost = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectFocusLost(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectFocusedDataItemChanged = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectFocusedDataItemChanged(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectDataItemSelected = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectDataItemSelected(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectItemSelected = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectItemSelected(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectItemInserted = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectItemInserted(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.connectItemRemoved = function (aHolder, aSlotName, aSlot) {
            this._listDataControl.connectItemRemoved(aHolder, aSlotName, aSlot);
        };
        CListControl.prototype.setRedrawAfterOperation = function (aRedraw) {
            this._listDataControl.setRedrawAfterOperation(aRedraw);
        };
        CListControl.prototype.prependItem = function (aItem) {
            this._listDataControl.insertItem(0, aItem);
        };
        CListControl.prototype.insertItem = function (position, aItem) {
            this._listDataControl.insertItem(position, [aItem]);
        };
        CListControl.prototype.appendItem = function (aItem) {
            this._listDataControl.appendItem(aItem);
        };
        CListControl.prototype.removeItem = function (index) {
            this._listDataControl.removeItems([index]);
        };
        CListControl.prototype.removeItems = function (index) {
            this._listDataControl.removeItems(index);
        };
        /**
         * slot for item insert signal
         *
         * @param drawnElements inserted drawn items
         * @param aNeedFocus
         * @private
         */
        CListControl.prototype._slItemInserted = function (drawnElements, aNeedFocus) {
            var rect = this.getSize();
            var height = this._listDataControl.getItemHeight();
            var width = this._listDataControl.getItemWidth();
            var keys = Object.keys(drawnElements._drawnElements);
            var count = keys.length;
            var cut = 0;
            var removeEl;
            if (width) {
                cut = count - (rect.width / width);
            }
            else if (height) {
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
        };
        CListControl.prototype._slItemRemoved = function (drawnElements, aUnsetFocus) {
            //TODO: implement
            this._listDataControl._makeKeyMap(drawnElements.getElements(), false, false);
            if (aUnsetFocus) {
                this._listDataControl._setActiveFocus(false);
            }
        };
        return CListControl;
    })(CViewGroupControl);
    Controls.CListControl = CListControl;
    var CGridControl = (function (_super) {
        __extends(CGridControl, _super);
        function CGridControl(aElement) {
            _super.call(this, aElement);
            this._gridDataControl = new CGridDataControl(null);
            this.setOwnedChildControls([this._gridDataControl]);
            this.setListData([]);
        }
        CGridControl.prototype.destroy = function () {
            this._gridDataControl.destroy();
            _super.prototype.destroy.call(this);
        };
        // set draw param
        CGridControl.prototype.setMaxColCount = function (aMaxColCount) {
            this._gridDataControl.setMaxColCount(aMaxColCount);
        };
        CGridControl.prototype.setItemWidth = function (aItemWidth) {
            this._gridDataControl.setItemWidth(aItemWidth);
        };
        CGridControl.prototype.setItemHeight = function (aItemHeight) {
            this._gridDataControl.setItemHeight(aItemHeight);
        };
        // set data
        CGridControl.prototype.setListData = function (aData) {
            this._gridDataControl.setOwnedDataProvider(new CListDataProvider(aData, false));
        };
        CGridControl.prototype.setOwnedDataProvider = function (aDataProvider) {
            this._gridDataControl.setOwnedDataProvider(aDataProvider);
        };
        // set drawer
        CGridControl.prototype.setDataDrawer = function (aDrawer) {
            this._gridDataControl.setDataDrawer(aDrawer);
        };
        // connect event
        CGridControl.prototype.connectFocusChanged = function (aHolder, aSlotName, aSlot) {
            this._gridDataControl.connectFocusChanged(aHolder, aSlotName, aSlot);
        };
        CGridControl.prototype.connectItemSelected = function (aHolder, aSlotName, aSlot) {
            this._gridDataControl.connectItemSelected(aHolder, aSlotName, aSlot);
        };
        return CGridControl;
    })(CViewGroupControl);
    Controls.CGridControl = CGridControl;
    var CDrawingControl = (function (_super) {
        __extends(CDrawingControl, _super);
        function CDrawingControl(aElement) {
            _super.call(this, aElement);
            this._drawingDataControl = new CDrawingDataControl(null);
            this.setOwnedChildControls([this._drawingDataControl]);
        }
        CDrawingControl.prototype.destroy = function () {
            this._drawingDataControl.destroy();
            _super.prototype.destroy.call(this);
        };
        CDrawingControl.prototype.setItemHeight = function (aItemHeight) {
            this._drawingDataControl.setItemHeight(aItemHeight);
        };
        CDrawingControl.prototype.setOwnedDataProvider = function (aDataProvider) {
            this._drawingDataControl.setOwnedDataProvider(aDataProvider);
        };
        CDrawingControl.prototype.setCurrentRowIndex = function (aRowIndex) {
            this._drawingDataControl.setCurrentRow(aRowIndex);
        };
        CDrawingControl.prototype.getCurrentRowIndex = function () {
            return this._drawingDataControl.getCurrentRow();
        };
        // set drawer
        CDrawingControl.prototype.setDataDrawer = function (aDrawer) {
            this._drawingDataControl.setDataDrawer(aDrawer);
        };
        CDrawingControl.prototype.getFirstElementByRow = function (aIndex) {
            return this._drawingDataControl.getFirstElementByRow(aIndex);
        };
        CDrawingControl.prototype.clearDrawnElements = function () {
            this._drawingDataControl.clearDrawnElements();
        };
        // connect event
        CDrawingControl.prototype.connectFocusChanged = function (aHolder, aSlotName, aSlot) {
            this._drawingDataControl.connectFocusChanged(aHolder, aSlotName, aSlot);
        };
        CDrawingControl.prototype.connectItemSelected = function (aHolder, aSlotName, aSlot) {
            this._drawingDataControl.connectItemSelected(aHolder, aSlotName, aSlot);
        };
        CDrawingControl.prototype.connectRowIndexChanged = function (aHolder, aSlotName, aSlot) {
            this._drawingDataControl.connectRowIndexChanged(aHolder, aSlotName, aSlot);
        };
        return CDrawingControl;
    })(CViewGroupControl);
    Controls.CDrawingControl = CDrawingControl;
    var CLayeredGroupControl = (function (_super) {
        __extends(CLayeredGroupControl, _super);
        function CLayeredGroupControl(aElement) {
            _super.call(this, aElement);
            this._layerInfoStack = [];
            this.addClass("-layered");
        }
        CLayeredGroupControl.prototype.destroy = function () {
            var i, iLen, layerInfo, j, jLen, controls;
            for (i = 0, iLen = this._layerInfoStack.length; i < iLen; i++) {
                layerInfo = this._layerInfoStack[i];
                controls = layerInfo.childControls;
                for (j = 0, jLen = controls.length; j < jLen; j++) {
                    controls[j].destroy();
                }
                Util.remove(layerInfo.elLayer);
            }
            this._layerInfoStack = null;
            _super.prototype.destroy.call(this);
        };
        CLayeredGroupControl.prototype.getLayoutElement = function (aClassName) {
            var ret;
            var elements = this._elLayer.getElementsByClassName(aClassName);
            if (elements.length == 1) {
                ret = elements.item(0);
            }
            else if (elements.length == 0) {
                ret = document.createElement("div");
                ret.classList.add(aClassName);
                this._elLayer.appendChild(ret);
            }
            else {
                throw "Layout element duplicated";
            }
            return ret;
        };
        CLayeredGroupControl.prototype.getCurrentLayerElement = function () {
            return this._elLayer;
        };
        CLayeredGroupControl.prototype.createLayer = function (aParam) {
            var _this = this;
            if (aParam === void 0) { aParam = {}; }
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
            var executeNext = [];
            if (aParam.transition) {
                this.setTransition(true);
                if (aParam.transition.custom) {
                    executeNext.push(aParam.transition.custom.fnCreate(elLayerPrev, elLayer));
                }
                else {
                    if (elLayerPrev) {
                        switch (aParam.transition.prevLayer) {
                            case "fadeOut":
                                elLayerPrev.style.transition = KCssTransitionParamOpa;
                                executeNext.push(function () {
                                    elLayerPrev.style.opacity = "0";
                                });
                                break;
                            case "moveLeft":
                                elLayerPrev.style.transition = KCssTransitionParamPos;
                                executeNext.push(function () {
                                    elLayerPrev.style.left = -_this._element.offsetWidth + "px";
                                });
                                break;
                        }
                    }
                    switch (aParam.transition.newLayer) {
                        case "fadeIn":
                            elLayer.style.opacity = "0";
                            elLayer.style.transition = KCssTransitionParamOpa;
                            executeNext.push(function () {
                                elLayer.style.opacity = "1";
                            });
                            break;
                        case "moveLeft":
                            elLayer.style.transition = KCssTransitionParamPos;
                            elLayer.style.left = this._element.offsetWidth + "px";
                            executeNext.push(function () {
                                elLayer.style.left = "0px";
                            });
                            break;
                    }
                }
                Util.afterTransition(elLayer, function () {
                    _this.setTransition(false);
                    if (aParam.transition.fnAfterTransition) {
                        aParam.transition.fnAfterTransition();
                    }
                });
            }
            this._element.appendChild(elLayer);
            this._elLayer = elLayer;
            this._createParam = aParam;
            if (executeNext.length) {
                setTimeout(function () {
                    var i, len;
                    for (i = 0, len = executeNext.length; i < len; i++) {
                        executeNext[i]();
                    }
                }, 1);
            }
            return elLayer;
        };
        CLayeredGroupControl.prototype.removeLayer = function () {
            var _this = this;
            var prevChild = this._child;
            var prevElLayer = this._elLayer;
            var prevCreateParam = this._createParam;
            var destroy = function () {
                var i, len, control;
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
            var layerInfo = this._layerInfoStack.pop();
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
                    }
                    else {
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
                    Util.afterTransition(prevElLayer, function () {
                        destroy();
                        _this.setTransition(false);
                    });
                }
                else {
                    destroy();
                }
            }
            else {
                destroy();
            }
        };
        CLayeredGroupControl.prototype.draw = function (aRect) {
            _super.prototype.draw.call(this, aRect);
            this.setActiveFocus();
        };
        CLayeredGroupControl.prototype._doDraw = function (aRect, aDrawParam) {
            if (!this._elLayer) {
                throw "Layer must be created before draw";
            }
            return this._doDrawCommon(this._elLayer, aRect, aDrawParam);
        };
        CLayeredGroupControl.prototype.createLayoutControl = function (aItemDrawers) {
            if (!this._elLayer) {
                throw "Layer must be created before set controls";
            }
            this._keyMapBuilder = Controls.KBuilderTopDown;
            var layoutControl = new CLayoutControl(null);
            layoutControl.setItemDrawers(aItemDrawers);
            this.setOwnedChildControls([layoutControl]);
            return layoutControl;
        };
        CLayeredGroupControl.prototype.createLayoutGroupControl = function (aControls) {
            if (!this._elLayer) {
                throw "Layer must be created before set controls";
            }
            this._keyMapBuilder = Controls.KBuilderTopDown;
            var layoutGroupControl = new CLayoutGroupControl(null);
            layoutGroupControl.setOwnedChildControls(aControls);
            this.setOwnedChildControls([layoutGroupControl]);
            return layoutGroupControl;
        };
        CLayeredGroupControl.prototype.setControl = function (aControl) {
            if (!this._elLayer) {
                throw "Layer must be created before set controls";
            }
            this._keyMapBuilder = Controls.KBuilderTopDown;
            this.setOwnedChildControls([aControl]);
        };
        return CLayeredGroupControl;
    })(CGroupControl);
    Controls.CLayeredGroupControl = CLayeredGroupControl;
    var CViewItemResult = (function () {
        function CViewItemResult() {
            this.items = [];
        }
        CViewItemResult.prototype.firstAvailIndex = function () {
            var i;
            for (i = 0; i < this.items.length; i += 1) {
                if (this.items[i])
                    return i;
            }
            return -1;
        };
        CViewItemResult.prototype.lastAvailIndex = function () {
            var i;
            for (i = this.items.length - 1; i >= 0; i -= 1) {
                if (this.items[i])
                    return i;
            }
            return -1;
        };
        return CViewItemResult;
    })();
    Controls.CViewItemResult = CViewItemResult;
    var CCircularArray = (function () {
        function CCircularArray(aArray) {
            if (aArray) {
                this.setArray(aArray);
            }
        }
        CCircularArray.prototype.getArray = function () {
            return this._array;
        };
        CCircularArray.prototype.setArray = function (aArray) {
            this._array = aArray;
            this._idxCur = 0;
            this._idxLast = aArray.length - 1;
        };
        CCircularArray.prototype.appendArray = function (aArray) {
            this._array.concat(aArray);
            this._idxLast = aArray.length - 1;
        };
        CCircularArray.prototype.cur = function () {
            return this._idxCur;
        };
        CCircularArray.prototype.curItem = function () {
            return this._array[this._idxCur];
        };
        CCircularArray.prototype.setCur = function (aIndex) {
            this._idxCur = this.indexing(aIndex);
        };
        CCircularArray.prototype.inc = function (aCount) {
            this._idxCur = this.indexing(this._idxCur + aCount);
        };
        CCircularArray.prototype.dec = function (aCount) {
            this._idxCur = this.indexing(this._idxCur - aCount);
        };
        CCircularArray.prototype.indexing = function (aIndex) {
            return aIndex >= 0 ? aIndex % this._array.length : this._array.length + aIndex % this._array.length;
        };
        CCircularArray.prototype.at = function (aIndex) {
            return aIndex >= 0 ? this._array[aIndex % this._array.length] : this._array[this._array.length + aIndex % this._array.length];
        };
        CCircularArray.prototype.getViewItems = function (aCount, aOffset) {
            var ret = new CViewItemResult();
            var len = this._array.length;
            var i;
            if (aCount > len) {
                var halfCount = Math.floor(len / 2);
                var centering = halfCount <= aOffset && halfCount <= aCount - aOffset;
                var start, index;
                for (i = 0; i < aCount; i += 1) {
                    ret.items.push(null);
                }
                if (centering) {
                    start = aOffset - halfCount;
                    for (i = 0; i < len; i += 1) {
                        index = this.indexing(this._idxCur - halfCount + i);
                        ret.items[i + start] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                }
                else if (len - 1 <= aOffset) {
                    start = aOffset - len - 1;
                    for (i = 0; i < len; i += 1) {
                        index = this.indexing(this._idxCur + i + 1);
                        ret.items[i + start] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                }
                else if (len <= aCount - aOffset) {
                    start = aOffset;
                    for (i = 0; i < len; i += 1) {
                        index = this.indexing(this._idxCur + i);
                        ret.items[i + start] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                }
                else {
                    for (i = 0; i < len; i += 1) {
                        index = this.indexing(this._idxCur - aOffset + i);
                        ret.items[i] = {
                            index: index,
                            data: this._array[index]
                        };
                    }
                }
            }
            else {
                for (i = 0; i < aCount; i += 1) {
                    index = this.indexing(this._idxCur - aOffset + i);
                    ret.items.push({
                        index: index,
                        data: this._array[index]
                    });
                }
            }
            return ret;
        };
        CCircularArray.prototype.del = function (aIndex) {
            var compromised = this.indexing(aIndex);
            if (isNaN(compromised)) {
                return;
            }
            this._array.splice(compromised, 1);
        };
        CCircularArray.prototype.each = function (aFn, aOffset) {
            var index = aOffset ? this.indexing(this._idxCur + aOffset) : this._idxCur;
            var need = false;
            do {
                need = aFn(index, this.at(index));
                index = this.indexing(index + 1);
            } while (need && index != this._idxCur);
        };
        CCircularArray.prototype.eachReverse = function (aFn) {
            var index = this._idxCur;
            var need = false;
            do {
                need = aFn(index, this.at(index));
                index = this.indexing(index - 1);
            } while (need && index != this._idxCur);
        };
        CCircularArray.prototype.eachArray = function (aFn) {
            var index = this._idxCur;
            var need = false;
            do {
                if (index < this._array.length) {
                    need = aFn(index, this.at(index));
                }
                else {
                    need = aFn(-1, undefined);
                }
                index += 1;
            } while (need);
        };
        CCircularArray.prototype.length = function () {
            var ret = 0;
            if (this._array) {
                ret = this._array.length;
            }
            return ret;
        };
        CCircularArray.prototype.clone = function () {
            var ret = new CCircularArray(this._array);
            ret.setCur(this._idxCur);
            return ret;
        };
        return CCircularArray;
    })();
    Controls.CCircularArray = CCircularArray;
    var CCarouselControl = (function (_super) {
        __extends(CCarouselControl, _super);
        function CCarouselControl(aElement) {
            _super.call(this, aElement);
            this._keyQueue = [];
            this._element.classList.add(CCarouselControl.KClassCarousel);
            this._element.style.overflow = "hidden";
            this.setOrientation(1 /* EVertical */);
            this.registerSignal(["CurrentItemChanged", "StartToChange"]);
        }
        CCarouselControl.prototype.connectCurrentItemChanged = function (aHolder, aSlotName, aHandler) {
            this.connect("CurrentItemChanged", aHolder, aSlotName);
        };
        CCarouselControl.prototype._emitCurrentItemChanged = function (aElement, aItem, aIndex) {
            this.emit.call(this, "CurrentItemChanged", aElement, aItem, aIndex);
        };
        CCarouselControl.prototype.connectStartToChange = function (aHolder, aSlotName, aHandler) {
            this.connect("StartToChange", aHolder, aSlotName);
        };
        CCarouselControl.prototype._emitStartToChange = function (aElement, aItem, aIndex) {
            this.emit.call(this, "StartToChange", aElement, aItem, aIndex);
        };
        CCarouselControl.prototype.setDataDrawer = function (aDrawer) {
            this._dataDrawer = aDrawer;
        };
        CCarouselControl.prototype.setAnchorDrawer = function (aAnchorDrawer, aBackground) {
            this._anchorDrawer = aAnchorDrawer;
            if (aBackground) {
                this._anchorBackground = aBackground;
            }
        };
        CCarouselControl.prototype.getAnchorElement = function () {
            return this._anchorEl;
        };
        CCarouselControl.prototype.setData = function (aMenuItems) {
            if (this._cirMenuItems) {
                this._cirMenuItems = null;
            }
            this._cirMenuItems = new CCircularArray(aMenuItems);
            this._dataChanged = true;
        };
        CCarouselControl.prototype.getCurrentIndex = function () {
            return this._cirMenuItems.cur();
        };
        CCarouselControl.prototype.getCurrentItem = function () {
            return this._cirMenuItems.curItem();
        };
        CCarouselControl.prototype.setCurrentIndex = function (aIndex) {
            if (aIndex < 0 || this._cirMenuItems.length() <= aIndex) {
                throw "CCarouselControl OUT OF BOUNDS";
            }
            this._cirMenuItems.setCur(aIndex);
            this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
        };
        CCarouselControl.prototype.getCurrentViewingItemInfos = function () {
            var viewCount = this.getViewCount();
            var anchorIndex = this.getAnchorIndex();
            var result = this._cirMenuItems.getViewItems(viewCount, anchorIndex);
            var ret = [], i, item, element = this._element, itemEl;
            for (i = 0; i < result.items.length; i += 1) {
                item = result.items[i];
                if (item) {
                    itemEl = this._element.querySelector('.' + CCarouselControl.KClassItem + '[data="' + item.index + '"]');
                    ret.push({
                        item: item.data,
                        index: item.index,
                        el: itemEl ? itemEl : null
                    });
                }
                else {
                    ret.push(null);
                }
            }
            return ret;
        };
        CCarouselControl.prototype.safeUpdate = function (fnUpdate) {
            if (this.isTransitioning()) {
                this.fnSafeUpdate = fnUpdate;
            }
            else {
                fnUpdate();
            }
        };
        CCarouselControl.prototype._drawItem = function (aItemEl, aItem, aIndex) {
            if (this._dataDrawer) {
                this._dataDrawer(aItemEl, aItem, aIndex);
            }
            else {
                aItemEl.innerHTML = aItem;
            }
        };
        CCarouselControl.prototype._createItem = function (aItem, aTop, aClassName) {
            var orientation = this.getOrientation();
            var animation = this.getAnimation();
            var useUserAnimationCSS = this.getUseUserAnimationCSS();
            var animationInterval = this.getAnimationInterval();
            if (!animationInterval) {
                animationInterval = 0.3;
            }
            //var classNames = aClassName ? ['-carousel-item', aClassName] : ['-carousel-item'];
            var classNames = [CCarouselControl.KClassItem];
            if (aClassName) {
                classNames.push(aClassName);
            }
            var itemEl = document.createElement('div');
            itemEl.style.position = "absolute";
            var i, len;
            for (i = 0, len = classNames.length; i < len; i += 1) {
                itemEl.classList.add(classNames[i]);
            }
            if (orientation === 2 /* EHorizontal */) {
                if (animation && !useUserAnimationCSS) {
                    itemEl.style.transition = 'left ' + animationInterval + 's linear';
                }
                itemEl.style.left = aTop + 'px';
            }
            else {
                if (animation && !useUserAnimationCSS) {
                    itemEl.style.transition = 'top ' + animationInterval + 's linear';
                }
                itemEl.style.top = aTop + 'px';
            }
            if (aItem) {
                this._drawItem(itemEl, aItem.data, aItem.index);
            }
            return itemEl;
        };
        /*protected*/ CCarouselControl.prototype._doDraw = function (aRect, aDrawParam) {
            var ret;
            this.setTransition(false);
            if (this._dataChanged) {
                if (this.getOrientation() == 2 /* EHorizontal */) {
                    this._keyMapBuilder = Controls.KBuilderLeftRight;
                }
                else {
                    this._keyMapBuilder = Controls.KBuilderTopDown;
                }
                this._doDrawItems();
            }
            ret = [this._anchorEl];
            return ret;
        };
        CCarouselControl.prototype._doDrawItems = function () {
            var align = this.getOrientation();
            var menuLen = this._cirMenuItems.length();
            var viewCount = this.getViewCount();
            var itemWidth = this.getItemWidth();
            var itemHeight = this.getItemHeight();
            var anchorIndex = this.getAnchorIndex();
            var startIndex = this.getStartIndex();
            var transparentAnchor = this.getTransparentAnchor();
            var drawEffect = this.getDrawEfect();
            var drawnItems = [];
            var i;
            if (!viewCount) {
                throw "setViewCount required";
            }
            if (align == 1 /* EVertical */) {
                var anchorHeight = this.getAnchorHeight();
                var anchorTop = anchorIndex * itemHeight;
                if (!itemHeight) {
                    throw "setItemHeight required";
                }
                if (!anchorHeight) {
                    anchorHeight = itemHeight;
                }
            }
            else {
                var anchorWidth = this.getAnchorWidth();
                var anchorLeft = anchorIndex * itemWidth;
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
                if (align == 1 /* EVertical */) {
                    this._upperBoundHeight = anchorIndex * itemHeight;
                    this._upperBoundEl.style.width = itemWidth + 'px';
                    this._upperBoundEl.style.height = this._upperBoundHeight + 'px';
                    this._lowerBoundTop = anchorIndex * itemHeight + anchorHeight;
                    this._lowerBoundHeight = (viewCount - anchorIndex - 1) * itemHeight;
                    this._lowerBoundEl.style.top = this._lowerBoundTop + 'px';
                    this._lowerBoundEl.style.width = itemWidth + 'px';
                    this._lowerBoundEl.style.height = this._lowerBoundHeight + 'px';
                }
                else {
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
            var parentEl = null;
            var drawInfos = [];
            var nextPosition = 0;
            var itemPosition = 0;
            if (align == 1 /* EVertical */) {
                var itemPositionStart = anchorTop;
            }
            else {
                var itemPositionStart = anchorLeft;
            }
            for (i = 0; i < result.items.length; i += 1) {
                if (transparentAnchor) {
                    if (i <= anchorIndex) {
                        parentEl = this._upperBoundEl;
                        itemPosition = nextPosition;
                        if (align == 1 /* EVertical */) {
                            itemPositionStart = this._upperBoundHeight;
                        }
                        else {
                            itemPositionStart = this._lowerBoundWidth;
                        }
                    }
                    else if (anchorIndex < i) {
                        parentEl = this._lowerBoundEl;
                        if (align == 1 /* EVertical */) {
                            itemPosition = nextPosition - this._lowerBoundTop;
                            itemPositionStart = -itemHeight;
                        }
                        else {
                            itemPosition = nextPosition - this._lowerBoundLeft;
                            itemPositionStart = -itemWidth;
                        }
                    }
                }
                else {
                    parentEl = this._element;
                    itemPosition = nextPosition;
                }
                drawInfos.push({
                    position: itemPosition,
                    parentEl: parentEl,
                    positionStart: itemPositionStart
                });
                if (align == 1 /* EVertical */) {
                    nextPosition += i === anchorIndex ? anchorHeight : itemHeight;
                }
                else {
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
                    }
                    else {
                        itemEl = this._createItem(item, drawInfo.position, distClassName);
                    }
                    if (diff !== 0) {
                        if (diff < 0) {
                            itemEl.classList.add(CCarouselControl.KClassUpper);
                        }
                        else {
                            itemEl.classList.add(CCarouselControl.KClassLower);
                        }
                    }
                    drawInfo.parentEl.appendChild(itemEl);
                }
                drawnItems.push(itemEl);
            }
            if (drawEffect == 'spreadOut') {
                setTimeout(function () {
                    for (i = 0; i < drawInfos.length; i++) {
                        if (drawnItems[i]) {
                            if (align == 1 /* EVertical */) {
                                drawnItems[i].style.top = drawInfos[i].position + 'px';
                            }
                            else {
                                drawnItems[i].style.left = drawInfos[i].position + 'px';
                            }
                        }
                    }
                }, 1);
            }
            var anchorEl = document.createElement('div');
            anchorEl.classList.add(CCarouselControl.KClassAnchor);
            anchorEl.style.position = 'absolute';
            if (align == 1 /* EVertical */) {
                anchorEl.style.top = anchorTop + 'px';
            }
            else {
                anchorEl.style.left = anchorLeft + 'px';
            }
            if (this._anchorDrawer) {
                this._anchorDrawer(anchorEl, result.items[anchorIndex].data, result.items[anchorIndex].index);
            }
            if (this._anchorBackground) {
                Util.prepend(this._element, anchorEl);
            }
            else {
                this._element.appendChild(anchorEl);
            }
            this._anchorEl = anchorEl;
            if (align == 1 /* EVertical */) {
                this._height = anchorHeight + (itemHeight * (viewCount - 1));
                this._element.style.height = this._height + 'px';
            }
            else {
                this._width = anchorWidth + (itemWidth * (viewCount - 1));
                this._element.style.width = this._width + 'px';
            }
            if (this._dataChanged) {
                this._dataChanged = false;
                this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
            }
            return this._element;
        };
        CCarouselControl.prototype._moveItemsLeftward = function (aItemsEl, aItemWidth, aAnchorIndex, aIndexOffset, aAnchorWidth) {
            var nextLeft = 0, i;
            for (i = 0; i < aItemsEl.length; i += 1) {
                var itemEl = aItemsEl[i];
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
                }
                else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextLeft += (aAnchorWidth && itemIndex == aAnchorIndex) ? aAnchorWidth : aItemWidth;
            }
        };
        CCarouselControl.prototype._moveItemsRightward = function (aItemsEl, aItemWidth, aAnchorIndex, aIndexOffset, aAnchorWidth) {
            var nextLeft = -aItemWidth, i;
            for (i = 0; i < aItemsEl.length; i += 1) {
                var itemEl = aItemsEl[i];
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
                }
                else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextLeft += (aAnchorWidth && itemIndex == aAnchorIndex) ? aAnchorWidth : aItemWidth;
            }
        };
        CCarouselControl.prototype._moveItemsDownward = function (aItemsEl, aItemHeight, aAnchorIndex, aIndexOffset, aAnchorHeight) {
            var nextTop = 0;
            var i, len;
            for (i = 0, len = aItemsEl.length; i < len; i += 1) {
                var itemEl = aItemsEl[i];
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
                }
                else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextTop += (aAnchorHeight && itemIndex === aAnchorIndex) ? aAnchorHeight : aItemHeight;
            }
        };
        CCarouselControl.prototype._moveItemsUpward = function (aItemsEl, aItemHeight, aAnchorIndex, aIndexOffset, aAnchorHeight) {
            var nextTop = -aItemHeight;
            var i, len;
            for (i = 0, len = aItemsEl.length; i < len; i += 1) {
                var itemEl = aItemsEl[i];
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
                }
                else {
                    itemEl.classList.remove(prevDirection);
                    itemEl.classList.add(direction);
                }
                nextTop += (aAnchorHeight && itemIndex === aAnchorIndex) ? aAnchorHeight : aItemHeight;
            }
        };
        CCarouselControl.prototype._handleTransitionEnd = function () {
            this.setTransition(false);
            if (this.fnSafeUpdate) {
                this.fnSafeUpdate();
                this.fnSafeUpdate = null;
                this._keyQueue = [];
            }
            else {
                if (this._keyQueue.length) {
                    this[this._keyQueue.shift()]();
                }
                else {
                    this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
                }
            }
        };
        CCarouselControl.prototype._doTransitionAndAfter = function (aTargetEl, aFnAfter) {
            var _this = this;
            Util.afterTransition(aTargetEl, function () {
                _this.setTransition(false);
                aFnAfter();
                _this._handleTransitionEnd();
            });
        };
        CCarouselControl.prototype._update2 = function (aDown) {
            var menuLen = this._cirMenuItems.length();
            var itemHeight = this.getItemHeight();
            var itemWidth = this.getItemWidth();
            var anchorHeight = this.getAnchorHeight();
            var anchorWidth = this.getAnchorWidth();
            var anchorIndex = this.getAnchorIndex();
            var transparentAnchor = this.getTransparentAnchor();
            var align = this.getOrientation();
            var itemOffset;
            var anchorOffset;
            var fnMoveItemUpper, fnMoveItemlower;
            if (align == 1 /* EVertical */) {
                itemOffset = itemHeight;
                anchorOffset = anchorHeight;
                fnMoveItemUpper = this._moveItemsUpward;
                fnMoveItemlower = this._moveItemsDownward;
            }
            else {
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
                    }
                    else {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[0]);
                    }
                }
                else {
                    fnMoveItemlower(upperItemsEl, itemOffset, anchorIndex, 0);
                    fnMoveItemlower(lowerItemsEl, itemOffset, anchorIndex, anchorIndex + 1);
                    if (lowerItemsEl.length) {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[upperItemsEl.length - 1]);
                        lowerItemsEl[0].parentNode.removeChild(lowerItemsEl[lowerItemsEl.length - 1]);
                    }
                    else {
                        upperItemsEl[0].parentNode.removeChild(upperItemsEl[upperItemsEl.length - 1]);
                    }
                }
            }
            else {
                var itemsEl = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                if (aDown) {
                    fnMoveItemUpper(itemsEl, itemOffset, anchorIndex, -1, anchorOffset);
                    itemsEl[0].parentNode.removeChild(itemsEl[0]);
                }
                else {
                    fnMoveItemlower(itemsEl, itemOffset, anchorIndex, 0, anchorOffset);
                    itemsEl[0].parentNode.removeChild(itemsEl[itemsEl.length - 1]);
                }
            }
            this._emitCurrentItemChanged(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
        };
        CCarouselControl.prototype._animate = function (aDown) {
            var _this = this;
            this.setTransition(true);
            this._emitStartToChange(this._anchorEl, this._cirMenuItems.curItem(), this._cirMenuItems.cur());
            setTimeout(function () {
                var menuLen = _this._cirMenuItems.length(), align, anchorIndex = _this.getAnchorIndex(), anchorHeight = _this.getAnchorHeight(), anchorWidth = _this.getAnchorWidth(), itemHeight = _this.getItemHeight(), itemWidth = _this.getItemWidth(), transparentAnchor = _this.getTransparentAnchor(), nextTop = 0, itemOffset, anchorOffset, fnMoveItemUpper, fnMoveItemlower; //
                //get align
                if (_this.getOrientation() == 0 /* EUnknown */ || undefined) {
                    align = 1 /* EVertical */;
                }
                else {
                    align = _this.getOrientation();
                }
                if (align == 1 /* EVertical */) {
                    itemOffset = itemHeight;
                    anchorOffset = anchorHeight;
                    fnMoveItemUpper = _this._moveItemsUpward;
                    fnMoveItemlower = _this._moveItemsDownward;
                }
                else {
                    itemOffset = itemWidth;
                    anchorOffset = anchorWidth;
                    fnMoveItemUpper = _this._moveItemsRightward;
                    fnMoveItemlower = _this._moveItemsLeftward;
                }
                if (transparentAnchor) {
                    var upperItemNodeList = _this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    var lowerItemNodeList = _this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    if (aDown) {
                        fnMoveItemUpper(upperItemNodeList, itemOffset, anchorIndex, -1);
                        fnMoveItemUpper(lowerItemNodeList, itemOffset, anchorIndex, anchorIndex);
                        if (lowerItemNodeList.length) {
                            _this._doTransitionAndAfter(lowerItemNodeList[lowerItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[0]);
                                lowerItemNodeList[0].parentNode.removeChild(lowerItemNodeList[0]);
                            });
                        }
                        else {
                            _this._doTransitionAndAfter(upperItemNodeList[upperItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[0]);
                            });
                        }
                    }
                    else {
                        fnMoveItemlower(upperItemNodeList, itemOffset, anchorIndex, 0);
                        fnMoveItemlower(lowerItemNodeList, itemOffset, anchorIndex, anchorIndex + 1);
                        if (lowerItemNodeList.length) {
                            _this._doTransitionAndAfter(lowerItemNodeList[lowerItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[upperItemNodeList.length - 1]);
                                lowerItemNodeList[0].parentNode.removeChild(lowerItemNodeList[lowerItemNodeList.length - 1]);
                            });
                        }
                        else {
                            _this._doTransitionAndAfter(upperItemNodeList[upperItemNodeList.length - 1], function () {
                                upperItemNodeList[0].parentNode.removeChild(upperItemNodeList[upperItemNodeList.length - 1]);
                            });
                        }
                    }
                }
                else {
                    var itemNodeList = _this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                    if (aDown) {
                        fnMoveItemUpper(itemNodeList, itemOffset, anchorIndex, -1, anchorOffset);
                        _this._doTransitionAndAfter(itemNodeList[itemNodeList.length - 1], function () {
                            itemNodeList[0].parentNode.removeChild(itemNodeList[0]);
                        });
                    }
                    else {
                        fnMoveItemlower(itemNodeList, itemOffset, anchorIndex, 0, anchorOffset);
                        _this._doTransitionAndAfter(itemNodeList[itemNodeList.length - 1], function () {
                            itemNodeList[0].parentNode.removeChild(itemNodeList[itemNodeList.length - 1]);
                        });
                    }
                }
            }, 1);
        };
        CCarouselControl.prototype._doTransitionBack = function () {
            var dataLen = this._cirMenuItems.length();
            var viewCount = this.getViewCount();
            var anchorIndex = this.getAnchorIndex();
            var align = this.getOrientation();
            var animation = this.getAnimation();
            var i;
            var len;
            var item;
            var itemEl;
            var itemSize;
            var anchorSize;
            if (align == 1 /* EVertical */) {
                itemSize = this.getItemHeight();
                anchorSize = this.getAnchorHeight();
            }
            else {
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
                        itemEl = uppperItemNodeList[i];
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
                        itemEl = lowerItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i + anchorIndex + 1];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                }
                else {
                    newUpperEl = this._createItem(items[0], -itemSize, null);
                    newLowerEl = this._createItem(items[anchorIndex + 1], -itemSize, null);
                    uppperItemNodeList[0].parentNode.insertBefore(newUpperEl, uppperItemNodeList[0]);
                    lowerItemNodeList[0].parentNode.insertBefore(newLowerEl, lowerItemNodeList[0]);
                }
            }
            else {
                var itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                var newItemEl = this._createItem(items[0], -itemSize, CCarouselControl.KClassUpper);
                this._element.insertBefore(newItemEl, itemNodeList[0]);
                itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                if (dataLen < viewCount) {
                    for (i = 0, len = itemNodeList.length; i < len; i += 1) {
                        itemEl = itemNodeList[i];
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
            }
            else {
                this._update2(false);
            }
        };
        CCarouselControl.prototype._doTransitionNext = function () {
            var dataLen = this._cirMenuItems.length();
            var viewCount = this.getViewCount();
            var anchorIndex = this.getAnchorIndex();
            var align = this.getOrientation();
            var animation = this.getAnimation();
            var i;
            var len;
            var item;
            var itemEl;
            var itemSize;
            var anchorSize;
            if (align == 1 /* EVertical */) {
                itemSize = this.getItemHeight();
                anchorSize = this.getAnchorHeight();
            }
            else {
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
                    if (align == 1 /* EVertical */) {
                        newUpperEl = this._createItem(null, this._upperBoundHeight);
                    }
                    else {
                        newUpperEl = this._createItem(null, this._upperBoundWidth);
                    }
                    this._upperBoundEl.appendChild(newUpperEl);
                    uppperItemNodeList = this._upperBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    for (i = 0, len = uppperItemNodeList.length; i < len; i += 1) {
                        itemEl = uppperItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i - 1];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                    if (align == 1 /* EVertical */) {
                        newLowerEl = this._createItem(null, this._lowerBoundHeight);
                    }
                    else {
                        newLowerEl = this._createItem(null, this._lowerBoundWidth);
                    }
                    this._lowerBoundEl.appendChild(newLowerEl);
                    lowerItemNodeList = this._lowerBoundEl.querySelectorAll(CCarouselControl.KSelectorItem);
                    for (i = 0, len = lowerItemNodeList.length; i < len; i += 1) {
                        itemEl = lowerItemNodeList[i];
                        itemEl.innerText = '';
                        item = items[i + anchorIndex];
                        if (item) {
                            this._drawItem(itemEl, item.data, item.index);
                        }
                    }
                }
                else {
                    if (align == 1 /* EVertical */) {
                        newUpperEl = this._createItem(items[anchorIndex - 1], this._upperBoundHeight, null);
                        newLowerEl = this._createItem(items[items.length - 1], this._lowerBoundHeight, null);
                    }
                    else {
                        newUpperEl = this._createItem(items[anchorIndex - 1], this._upperBoundWidth, null);
                        newLowerEl = this._createItem(items[items.length - 1], this._lowerBoundWidth, null);
                    }
                    uppperItemNodeList[0].parentNode.appendChild(newUpperEl);
                    lowerItemNodeList[0].parentNode.appendChild(newLowerEl);
                }
            }
            else {
                var itemNodeList = this._element.querySelectorAll(CCarouselControl.KSelectorItem);
                if (align == 1 /* EVertical */) {
                    var newItemEl = this._createItem(items[items.length - 1], this._height, CCarouselControl.KClassLower);
                }
                else {
                    var newItemEl = this._createItem(items[items.length - 1], this._width, CCarouselControl.KClassLower);
                }
                this._element.appendChild(newItemEl);
                if (dataLen < viewCount) {
                    for (i = 0, len = itemNodeList.length; i < len; i += 1) {
                        itemEl = itemNodeList[i];
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
            }
            else {
                this._update2(true);
            }
        };
        CCarouselControl.prototype._doKeyLeft = function () {
            var dataLen = this._cirMenuItems.length();
            var align = this.getOrientation();
            var maxKeyQueueCount = this.getMaxKeyQueueCount();
            if (align == 1 /* EVertical */) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionBack();
            }
            else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyLeft');
                }
                else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyLeft');
                }
            }
            return true;
        };
        CCarouselControl.prototype._doKeyRight = function () {
            var dataLen = this._cirMenuItems.length();
            var align = this.getOrientation();
            var maxKeyQueueCount = this.getMaxKeyQueueCount();
            if (align == 1 /* EVertical */) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionNext();
            }
            else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyRight');
                }
                else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyRight');
                }
            }
            return true;
        };
        CCarouselControl.prototype._doKeyUp = function () {
            var dataLen = this._cirMenuItems.length();
            var align = this.getOrientation();
            var maxKeyQueueCount = this.getMaxKeyQueueCount();
            if (align == 2 /* EHorizontal */) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionBack();
            }
            else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyUp');
                }
                else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyUp');
                }
            }
            return true;
        };
        CCarouselControl.prototype._doKeyDown = function () {
            var dataLen = this._cirMenuItems.length();
            var align = this.getOrientation();
            var maxKeyQueueCount = this.getMaxKeyQueueCount();
            if (align == 2 /* EHorizontal */) {
                return false;
            }
            if (dataLen <= 1) {
                return true;
            }
            if (!this.isTransitioning()) {
                this._doTransitionNext();
            }
            else {
                if (maxKeyQueueCount === undefined) {
                    this._keyQueue.push('doKeyDown');
                }
                else if (this._keyQueue.length < maxKeyQueueCount) {
                    this._keyQueue.push('doKeyDown');
                }
            }
            return true;
        };
        CCarouselControl.prototype._doKeyEnter = function () {
            if (!this.isTransitioning()) {
                this.emit.call(this, "ItemSelected", this._anchorEl, this._cirMenuItems.curItem());
            }
            return true;
        };
        CCarouselControl.KClassCarousel = "-carousel";
        CCarouselControl.KClassAnchor = "-carousel-anchor";
        CCarouselControl.KClassItem = "-carousel-item";
        CCarouselControl.KClassDistPrefix = "-carousel-dist";
        CCarouselControl.KClassUpper = "-upper";
        CCarouselControl.KClassLower = "-lower";
        CCarouselControl.KSelectorItem = ".-carousel-item";
        return CCarouselControl;
    })(CControl);
    Controls.CCarouselControl = CCarouselControl;
    function makeNoneFocusable(aId, aHtml) {
        var focusInfo = new CLayoutControl(null);
        focusInfo.setId(aId);
        focusInfo.setItemDrawers([]);
        if (aHtml) {
            focusInfo.setItemDrawers([
                function (aElement, aIndex) {
                    aElement.innerHTML = aHtml;
                    return 1 /* KFocusNone */;
                }
            ]);
        }
        return focusInfo;
    }
    Controls.makeNoneFocusable = makeNoneFocusable;
    function fillControlParam(aControl, aParam) {
        if (aParam.id) {
            aControl.setId(aParam.id);
        }
        if (aParam.width) {
            aControl.getElement().style.width = aParam.width + 'px';
        }
        if (aParam.height) {
            aControl.getElement().style.height = aParam.height + 'px';
        }
        if (aParam.orientation) {
            aControl.setOrientation(aParam.orientation);
        }
        if (aParam.padding) {
            aControl.setPadding(aParam.padding);
        }
        if (aParam.margins) {
            aControl.setMargins(aParam.margins);
        }
        if (aParam.childHAlign) {
            aControl.setChildHAlign(aParam.childHAlign);
        }
        if (aParam.childVAlign) {
            aControl.setChildVAlign(aParam.childVAlign);
        }
        if (aParam.itemWidth) {
            aControl.setItemWidth(aParam.itemWidth);
        }
        if (aParam.itemHeight) {
            aControl.setItemHeight(aParam.itemHeight);
        }
        if (aParam.onItemSelected) {
            aControl.connectItemSelected(aParam, 'onItemSelected', aParam.onItemSelected);
        }
        if (aParam.onFocusChanged) {
            aControl.connectFocusChanged(aParam, 'onFocusChanged', aParam.onFocusChanged);
        }
    }
    function LayoutControl(aParam) {
        var layoutControl = new CLayoutControl(aParam.el || null);
        fillControlParam(layoutControl, aParam);
        layoutControl.setItemDrawers(aParam.itemDrawers || []);
        return layoutControl;
    }
    Controls.LayoutControl = LayoutControl;
    function ListControl(aParam) {
        var list;
        list = new Controls.CListControl(null);
        fillControlParam(list, aParam);
        if (aParam.data) {
            list.setListData(aParam.data);
        }
        if (aParam.dataDrawer) {
            list.setDataDrawer(aParam.dataDrawer);
        }
        if (aParam.onFocusedDataItemChanged) {
            list.connectFocusedDataItemChanged(aParam, 'onFocusedDataItemChanged', aParam.onFocusedDataItemChanged);
        }
        list.setAnimation(true);
        list.setScrollScheme(5 /* EByFixed */);
        list.setRedrawAfterOperation(true);
        return list;
    }
    Controls.ListControl = ListControl;
    function GridControl(aParam) {
        var gridControl = new CGridControl(aParam.el || null);
        fillControlParam(gridControl, aParam);
        if (aParam.maxColCount) {
            gridControl.setMaxColCount(aParam.maxColCount);
        }
        if (aParam.animation) {
            gridControl.setAnimation(aParam.animation);
        }
        if (aParam.data) {
            gridControl.setListData(aParam.data);
        }
        if (aParam.dataDrawer) {
            gridControl.setDataDrawer(aParam.dataDrawer);
        }
        return gridControl;
    }
    Controls.GridControl = GridControl;
    function CarouselControl(aParam) {
        var carousel = new Controls.CCarouselControl(aParam.el || null);
        fillControlParam(carousel, aParam);
        carousel.setData(aParam.data);
        carousel.setViewCount(aParam.viewCount);
        carousel.setAnchorIndex(aParam.anchorIndex);
        carousel.setDataDrawer(aParam.dataDrawer);
        if (aParam.onStartToChange) {
            carousel.connectStartToChange(aParam, "onStartToChange", aParam.onStartToChange);
        }
        if (aParam.maxKeyQueueCount) {
            carousel.setMaxKeyQueueCount(aParam.maxKeyQueueCount);
        }
        if (aParam.animation) {
            carousel.setAnimation(aParam.animation);
        }
        if (aParam.transparentAnchor) {
            carousel.setTransparentAnchor(aParam.transparentAnchor);
        }
        if (aParam.drawEffect) {
            carousel.setDrawEfect(aParam.drawEffect);
        }
        if (aParam.anchorDrawer) {
            carousel.setAnchorDrawer(aParam.anchorDrawer);
        }
        return carousel;
    }
    Controls.CarouselControl = CarouselControl;
    function LayoutGroupControl(aParam) {
        var layoutGroupControl = new Controls.CLayoutGroupControl(aParam.el || null);
        fillControlParam(layoutGroupControl, aParam);
        if (aParam.controls) {
            layoutGroupControl.setOwnedChildControls(aParam.controls);
        }
        if (aParam.onChildFocusChanged) {
            layoutGroupControl.connectChildFocusChanged(aParam, 'onChildFocusChanged', aParam.onChildFocusChanged);
        }
        return layoutGroupControl;
    }
    Controls.LayoutGroupControl = LayoutGroupControl;
    function runRoot(aControl) {
        aControl.draw();
        aControl.setActiveFocus();
        document.body.addEventListener('keydown', function (e) {
            var keyStr = e['keyIdentifier'];
            var handled = aControl.doKey(keyStr);
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
    Controls.runRoot = runRoot;
    function Item(aParam) {
        var el = aParam.el || document.createElement(aParam.tagName || 'div');
        if (aParam.className) {
            el.classList.add(aParam.className);
        }
        if (aParam.innerText) {
            el.innerText = aParam.innerText;
        }
        if (aParam.backgroundColor) {
            el.style.backgroundColor = aParam.backgroundColor;
        }
        if (aParam.children) {
            aParam.children.forEach(function (child) {
                el.appendChild(Item(child));
            });
        }
        return el;
    }
    Controls.Item = Item;
})(Controls || (Controls = {}));
//# sourceMappingURL=controls.js.map