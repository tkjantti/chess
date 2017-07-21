/* global CHESS_APP */

var CHESS_TEST = {};

CHESS_TEST.pointEquality = function (p1, p2) {
    "use strict";
    if ((p1.row !== undefined) && (p1.column !== undefined)) {
        return p1.equals(p2);
    }

    return undefined;
};

CHESS_TEST.LogMove = function (player, source, destination) {
    "use strict";
    var move = new CHESS_APP.Move(player, source, destination);
    var piece = null;
    var moveResult = new CHESS_APP.MoveResult(move, "good_move", piece);

    var moveLog = new CHESS_APP.MoveLog();
    moveLog.add(moveResult);

    return moveLog;
};

CHESS_TEST.boardState = function (rows) {
    "use strict";
    var rowCount = rows.length;
    var columnCount = rows[0].length;
    var row, column, rowString, position, letter, piece;

    var pieceMap = {
        P: new CHESS_APP.Piece("white", "pawn"),
        R: new CHESS_APP.Piece("white", "rook"),
        N: new CHESS_APP.Piece("white", "knight"),
        B: new CHESS_APP.Piece("white", "bishop"),
        Q: new CHESS_APP.Piece("white", "queen"),
        K: new CHESS_APP.Piece("white", "king"),
        p: new CHESS_APP.Piece("black", "pawn"),
        r: new CHESS_APP.Piece("black", "rook"),
        n: new CHESS_APP.Piece("black", "knight"),
        b: new CHESS_APP.Piece("black", "bishop"),
        q: new CHESS_APP.Piece("black", "queen"),
        k: new CHESS_APP.Piece("black", "king")
    };

    var board = new CHESS_APP.InMemoryBoard(rowCount, columnCount);

    for (row = 0; row < rows.length; row += 1) {
        rowString = rows[row];
        if (rowString.length !== columnCount) {
            throw "All rows are expected to be equal";
        }
        for (column = 0; column < columnCount; column += 1) {
            position = new CHESS_APP.Point(row, column);
            letter = rowString[column];
            if (letter !== ' ') {
                piece = pieceMap[letter];
                if (!piece) {
                    throw "Unknown letter";
                }
                board.setPiece(position, piece);
            }
        }
    }

    return board;
};
