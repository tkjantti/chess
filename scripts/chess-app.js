/*jslint browser:true, fudge:true, this:true, for:true */
/*global window, $, CHESS_APP */

var CHESS_APP = {};

CHESS_APP.createPoint = function (row, column) {
    "use strict";
    return {
        row: row,
        column: column,

        equals: function (other) {
            return this.row === other.row && this.column === other.column;
        },

        /*
         * Creates a new point with the given number of rows and
         * columns added to this point.
         */
        add: function (rows, columns) {
            return CHESS_APP.createPoint(this.row + rows, this.column + columns);
        }
    };
};

CHESS_APP.createPiece = function (player, type) {
    "use strict";
    return {
        player: player,
        type: type,

        equals: function (another) {
            return another.player === this.player && another.type === this.type;
        }
    };
};

CHESS_APP.createBoard = function (rows, columns) {
    "use strict";

    var rowCount = 8;
    var columnCount = 8;

    if (rows !== undefined) {
        rowCount = rows;
    }
    if (columns !== undefined) {
        columnCount = columns;
    }

    return {
        getRowCount: function () {
            return rowCount;
        },

        getColumnCount: function () {
            return columnCount;
        },

        isInside: function (position) {
            return (0 <= position.row)
                    && (position.row < this.getRowCount())
                    && (0 <= position.column)
                    && (position.column < this.getColumnCount());
        },

        /*
         * Returns relative position based on the viewpoint of the
         * player.
         */
        getRelativePosition: function (player, absolutePosition) {
            var row = (player === "white")
                ? this.getRowCount() - 1 - absolutePosition.row
                : absolutePosition.row;
            return CHESS_APP.createPoint(row, absolutePosition.column);
        },

        /*
         * Returns an absolute position from a relative position based
         * on the viewpoint of the player.
         */
        getAbsolutePosition: function (player, relativePosition) {
            var row = (player === "white")
                ? this.getRowCount() - 1 - relativePosition.row
                : relativePosition.row;
            return CHESS_APP.createPoint(row, relativePosition.column);
        }
    };
};

