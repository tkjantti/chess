
(function (exports) {
    "use strict";
    
    exports.defaultRowCount = 8;
    exports.defaultColumnCount = 8;

    var Board = function (rowCount, columnCount) {
        this.rowCount = (rowCount !== undefined) ? rowCount : exports.defaultRowCount;
        this.columnCount = (columnCount !== undefined) ? columnCount : exports.defaultColumnCount;
    };

    Board.prototype.getRowCount = function () {
        return this.rowCount;
    };

    Board.prototype.getColumnCount = function () {
        return this.columnCount;
    };

    Board.prototype.isInside = function (position) {
        return (0 <= position.row) &&
            (position.row < this.getRowCount()) &&
            (0 <= position.column) &&
            (position.column < this.getColumnCount());
    };

    Board.prototype.getRelativeVerticalMovement = function (player, verticalMovement) {
        return (player === "white") ? -verticalMovement : verticalMovement;
    };

    /*
     * Returns relative position based on the viewpoint of the
     * player.
     */
    Board.prototype.getRelativePosition = function (player, absolutePosition) {
        var row = (player === "white") ?
            this.getRowCount() - 1 - absolutePosition.row
            : absolutePosition.row;
        return new CHESS_APP.Point(row, absolutePosition.column);
    };

    /*
     * Returns an absolute position from a relative position based
     * on the viewpoint of the player.
     */
    Board.prototype.getAbsolutePosition = function (player, relativePosition) {
        var row = (player === "white") ?
            this.getRowCount() - 1 - relativePosition.row
            : relativePosition.row;
        return new CHESS_APP.Point(row, relativePosition.column);
    };

    /*
     * Applies function f for each position.
     */
    Board.prototype.forEachPosition = function (f) {
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

    Board.prototype.toString = function () {
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

    exports.Board = Board;
}(this.CHESS_APP = this.CHESS_APP || {}));
