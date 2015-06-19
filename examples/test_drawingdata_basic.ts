
/// <reference path="../controls.ts"/>

module gApp {
    class CTestDrawingDataProvider extends Controls.CDrawingDataProvider {
        itemHeight = 20;
        itemWidthInc = 20;

        makeRow(rowIndex: number, top: number, left: number, right: number) {
            var drawingDataList: Controls.TDrawingData[] = [];
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
        }

        constructor() {
            super(Controls.TDrawingDataGrouping.ERow);
            this.getSize = function () {
                return {
                    width: 10000,
                    height: 10000
                }
            };

            this._doDrawingDataList = function (aRect: Controls.TRect, aFocusedInfo: Controls.TFocusedInfo, aCallback: Controls.FGetDrawingDataListCompleted) {
                var drawingDataList: Controls.TDrawingData[] = [];
                var startIndex = Math.ceil(aRect.top / this.itemHeight);
                var endIndex = Math.ceil(aRect.bottom / this.itemHeight);
                var i;
                for (i = startIndex; i <= endIndex; i++) {
                    drawingDataList = drawingDataList.concat(this.makeRow(i, i * this.itemHeight, aRect.left, aRect.right));
                }
                aCallback(drawingDataList);
            }
        }
    }

    var drawingDataControl = new Controls.CDrawingDataControl(null);
    drawingDataControl.setOwnedDataProvider(new CTestDrawingDataProvider());
    drawingDataControl.setDataDrawer((aKey, aDrawingData: Controls.TDrawingData, aElement: HTMLElement) => {
        aElement.style.fontSize = "8px";
        aElement.innerHTML = aDrawingData.data;
        return Controls.TFocusInfo.KFocusAble;
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

}
