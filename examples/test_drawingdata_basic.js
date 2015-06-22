/// <reference path="../controls.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var gApp;
(function (gApp) {
    var CTestDrawingDataProvider = (function (_super) {
        __extends(CTestDrawingDataProvider, _super);
        function CTestDrawingDataProvider() {
            _super.call(this, 1 /* ERow */);
            this.itemHeight = 20;
            this.itemWidthInc = 20;
            this.getSize = function () {
                return {
                    width: 10000,
                    height: 10000
                };
            };
            this._doDrawingDataList = function (aRect, aFocusedInfo, aCallback) {
                var drawingDataList = [];
                var startIndex = Math.ceil(aRect.top / this.itemHeight);
                var endIndex = Math.ceil(aRect.bottom / this.itemHeight);
                var i;
                for (i = startIndex; i <= endIndex; i++) {
                    drawingDataList = drawingDataList.concat(this.makeRow(i, i * this.itemHeight, aRect.left, aRect.right));
                }
                aCallback(drawingDataList);
            };
        }
        CTestDrawingDataProvider.prototype.makeRow = function (rowIndex, top, left, right) {
            var drawingDataList = [];
            var itemWidth = (top / this.itemHeight + 1) * this.itemWidthInc;
            var startIndex = Math.floor(left / itemWidth);
            var endIndex = Math.ceil(right / itemWidth);
            endIndex = right % itemWidth ? endIndex + 1 : endIndex;
            var i;
            for (i = startIndex; i <= endIndex; i++) {
                drawingDataList.push({
                    rect: new Controls.TRect({
                        top: top,
                        left: i * itemWidth,
                        right: i * itemWidth + itemWidth,
                        bottom: top + this.itemHeight
                    }),
                    data: "(" + rowIndex + ", " + i + ")"
                });
            }
            return drawingDataList;
        };
        return CTestDrawingDataProvider;
    })(Controls.CDrawingDataProvider);
    var drawingDataControl = new Controls.CDrawingDataControl(null);
    drawingDataControl.setOwnedDataProvider(new CTestDrawingDataProvider());
    drawingDataControl.setDataDrawer(function (aKey, aDrawingData, aElement) {
        aElement.style.fontSize = "8px";
        aElement.innerHTML = aDrawingData.data;
        return 2 /* KFocusAble */;
    });
    var elView = document.createElement("div");
    document.body.appendChild(elView);
    var viewGroup = new Controls.CViewGroupControl(elView);
    viewGroup.setOwnedChildControls([drawingDataControl]);
    viewGroup.draw();
    viewGroup.setActiveFocus();
    document.body.addEventListener('keydown', function (e) {
        var keyStr = e['keyIdentifier'];
        var handled = viewGroup.doKey(keyStr);
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
//# sourceMappingURL=test_drawingdata_basic.js.map