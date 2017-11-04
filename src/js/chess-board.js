
var CHESS_APP = CHESS_APP || {};

CHESS_APP.defaultRowCount = 8;
CHESS_APP.defaultColumnCount = 8;

CHESS_APP.Board = function (rowCount, columnCount) {
    "use strict";
    this.rowCount = (rowCount !== undefined) ? rowCount : CHESS_APP.defaultRowCount;
    this.columnCount = (columnCount !== undefined) ? columnCount : CHESS_APP.defaultColumnCount;
};

CHESS_APP.Board.prototype.getRowCount = function () {
    "use strict";
    return this.rowCount;
};

CHESS_APP.Board.prototype.getColumnCount = function () {
    "use strict";
    return this.columnCount;
};

CHESS_APP.Board.prototype.isInside = function (position) {
    "use strict";
    return (0 <= position.row) &&
            (position.row < this.getRowCount()) &&
            (0 <= position.column) &&
            (position.column < this.getColumnCount());
};

CHESS_APP.Board.prototype.getRelativeVerticalMovement = function (player, verticalMovement) {
    "use strict";
    return (player === "white") ? -verticalMovement : verticalMovement;
};

/*
 * Returns relative position based on the viewpoint of the
 * player.
 */
CHESS_APP.Board.prototype.getRelativePosition = function (player, absolutePosition) {
    "use strict";
    var row = (player === "white") ?
            this.getRowCount() - 1 - absolutePosition.row
            : absolutePosition.row;
    return new CHESS_APP.Point(row, absolutePosition.column);
};

/*
 * Returns an absolute position from a relative position based
 * on the viewpoint of the player.
 */
CHESS_APP.Board.prototype.getAbsolutePosition = function (player, relativePosition) {
    "use strict";
    var row = (player === "white") ?
        this.getRowCount() - 1 - relativePosition.row
            : relativePosition.row;
    return new CHESS_APP.Point(row, relativePosition.column);
};

/*
 * Applies function f for each position.
 */
CHESS_APP.Board.prototype.forEachPosition = function (f) {
    "use strict";
    var row, column, point;
    var rowCount = this.getRowCount(),
        columnCount = this.getColumnCount();

    for (row = 0; row < rowCount; row += 1) {
        for (column = 0; column < columnCount; column += 1) {
            point = new CHESS_APP.Point(row, column);
            f(point);
        }
    }
};

CHESS_APP.Board.prototype.toString = function () {
    "use strict";
    var result = "board\n";
    var row, column, p, piece, square;
    var rowCount = this.getRowCount(),
        columnCount = this.getColumnCount();

    for (row = 0; row < rowCount; row += 1) {
        for (column = 0; column < columnCount; column += 1) {
            p = new CHESS_APP.Point(row, column);
            piece = this.getPiece(p);
            if (piece) {
                square = piece.toString();
            } else {
                square = ' ';
            }
            result += square;
        }
        result += '\n';
    }
    return result;
};
