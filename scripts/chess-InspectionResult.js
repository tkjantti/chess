
var CHESS_APP = CHESS_APP || {};

CHESS_APP.InspectionResult = function (isLegal) {
    "use strict";
    this.actualMoves = [];
    this.isLegal = isLegal;
    this.capturePosition = null;
    this.promotion = null;
};
