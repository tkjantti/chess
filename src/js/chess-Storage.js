
(function (exports) {
    "use strict";

    var MOVE_LIST_IDENTIFIER = "chess-moves";

    var Storage = function () {
    };

    Storage.prototype.loadMoves = function () {
        var listAsString = localStorage.getItem(MOVE_LIST_IDENTIFIER);
        if (!listAsString) {
            return [];
        }
        var listAsJson = JSON.parse(listAsString);
        return CHESS_APP.MoveLog.deserializeMoves(listAsJson);
    };

    Storage.prototype.saveMoves = function (moveLog) {
        var moves = moveLog.serializeMoves();
        localStorage.setItem(MOVE_LIST_IDENTIFIER, JSON.stringify(moves));
    };

    exports.Storage = Storage;
})(this.CHESS_APP = this.CHESS_APP || {});
