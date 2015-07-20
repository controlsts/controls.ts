/// <reference path="../controls.ts"/>
var gApp;
(function (gApp) {
    var elStateGroup = document.createElement("div");
    elStateGroup.classList.add("-stateGroup");
    var elStateLeft = document.createElement("div");
    elStateLeft.classList.add("-stateLeft");
    var elStateRight = document.createElement("div");
    elStateRight.classList.add("-stateRight");
    var elContent = document.createElement("div");
    elContent.classList.add("-content");
    document.body.appendChild(elStateGroup);
    document.body.appendChild(elStateLeft);
    document.body.appendChild(elStateRight);
    document.body.appendChild(elContent);
    var padding = 4;
    var margins = [10];
    var root = Controls.LayoutGroupControl({
        el: elContent,
        id: 'idRoot',
        orientation: 2 /* EHorizontal */,
        controls: [
            Controls.LayoutControl({
                id: 'left',
                itemDrawers: [
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-0");
                        aEl.innerText = "0";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-1");
                        aEl.innerText = "1";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-2");
                        aEl.innerText = "2";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-3");
                        aEl.innerText = "3";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-4");
                        aEl.innerText = "4";
                        return 2 /* KFocusAble */;
                    },
                ],
                padding: padding,
                margins: margins,
                childHAlign: 2 /* ECenter */,
                childVAlign: 2 /* ECenter */,
                onFocusChanged: function (aOld, aNew) {
                    elStateLeft.innerText = "Left: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
                },
                onFocusGained: function (aControl) {
                    elStateLeft.innerText = "Left focus gained";
                    elStateLeft.classList.add("-gained");
                },
                onFocusLost: function (aControl) {
                    elStateLeft.innerText = "Left focus lost";
                    elStateLeft.classList.remove("-gained");
                }
            }),
            Controls.LayoutControl({
                id: 'right',
                itemDrawers: [
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-0");
                        aEl.innerText = "5";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-1");
                        aEl.innerText = "6";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-2");
                        aEl.innerText = "7";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-3");
                        aEl.innerText = "8";
                        return 2 /* KFocusAble */;
                    },
                    function (aEl, aIndex) {
                        aEl.classList.add("-item-4");
                        aEl.innerText = "9";
                        return 2 /* KFocusAble */;
                    },
                ],
                padding: padding,
                margins: margins,
                childHAlign: 2 /* ECenter */,
                childVAlign: 2 /* ECenter */,
                onFocusChanged: function (aOld, aNew) {
                    elStateRight.innerText = "Right: [" + aOld.innerText + "] -> [" + aNew.innerText + "]";
                },
                onFocusGained: function (aControl) {
                    elStateRight.innerText = "Right focus gained";
                    elStateRight.classList.add("-gained");
                },
                onFocusLost: function (aControl) {
                    elStateRight.innerText = "Right focus lost";
                    elStateRight.classList.remove("-gained");
                }
            }),
        ],
        onChildFocusChanged: function (aOld, aNew) {
            elStateGroup.innerText = "Group: [" + aOld.getId() + "] -> [" + aNew.getId() + "]";
        },
        onFocusGained: function (aControl) {
            elStateGroup.innerText = "Group focus gained";
        },
        onFocusLost: function (aControl) {
            elStateGroup.innerText = "Group focus lost";
        }
    });
    Controls.runRoot(root);
})(gApp || (gApp = {}));
//# sourceMappingURL=test_focus_two_leaf.js.map