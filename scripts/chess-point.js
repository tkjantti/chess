/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createPoint = function (row, column) {
    "use strict";
    return {
        row: row,
        column: column,

        toString: function () {
            return '(' + this.row + ', ' + this.column + ')';
        },

        equals: function (other) {
            if (!other) {
                return false;
            }
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
