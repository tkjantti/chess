
var CHESS_APP = CHESS_APP || {};

CHESS_APP.CASTLING_NONE = 0;
CHESS_APP.CASTLING_KING_SIDE = 1;
CHESS_APP.CASTLING_QUEEN_SIDE = 2;

CHESS_APP.InspectionResult = function (isLegal) {
    "use strict";
    this.actualMoves = [];
    this.isLegal = isLegal;
    this.capturePosition = null;
    this.promotion = null;
    this.castling = CHESS_APP.CASTLING_NONE;
};
