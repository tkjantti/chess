
(function (exports) {
    "use strict";

    exports.CASTLING_NONE = 0;
    exports.CASTLING_KING_SIDE = 1;
    exports.CASTLING_QUEEN_SIDE = 2;

    exports.InspectionResult = function (isLegal, actualMoves) {
        this.actualMoves = actualMoves ? actualMoves : [];
        this.isLegal = isLegal;
        this.capturePosition = null;
        this.promotion = null;
        this.castling = exports.CASTLING_NONE;
    };
})(this.CHESS_APP = this.CHESS_APP || {});
