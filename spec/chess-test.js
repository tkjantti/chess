/* global CHESS_APP */

var CHESS_TEST = {};

CHESS_TEST.pointEquality = function (p1, p2) {
    "use strict";
    if ((p1.row !== undefined) && (p1.column !== undefined)) {
        return p1.equals(p2);
    }

    return undefined;
};

CHESS_TEST.boardState = function (rows) {
    "use strict";
    var rowCount = rows.length;
    var columnCount = rows[0].length;
    var row, column, rowString, position, letter, piece;

    var pieceMap = {
        P: CHESS_APP.createPiece("white", "pawn"),
        R: CHESS_APP.createPiece("white", "rook"),
        N: CHESS_APP.createPiece("white", "knight"),
        B: CHESS_APP.createPiece("white", "bishop"),
        Q: CHESS_APP.createPiece("white", "queen"),
        K: CHESS_APP.createPiece("white", "king"),
        p: CHESS_APP.createPiece("black", "pawn"),
        r: CHESS_APP.createPiece("black", "rook"),
        n: CHESS_APP.createPiece("black", "knight"),
        b: CHESS_APP.createPiece("black", "bishop"),
        q: CHESS_APP.createPiece("black", "queen"),
        k: CHESS_APP.createPiece("black", "king")
    };

    var board = CHESS_APP.createInMemoryBoard(rowCount, columnCount);

    for (row = 0; row < rows.length; row += 1) {
        rowString = rows[row];
        if (rowString.length !== columnCount) {
            throw "All rows are expected to be equal";
        }
        for (column = 0; column < columnCount; column += 1) {
            position = CHESS_APP.createPoint(row, column);
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
