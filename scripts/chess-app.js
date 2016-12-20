
function createPoint(row, column) {
    return {
        row: row,
        column: column,

        equals: function (other) {
            return this.row === other.row && this.column === other.column;
        }
    };
}

function createPiece(player, type) {
    return {
        player: player,
        type: type,

        equals: function (another) {
            return another.player === this.player && another.type === this.type; 
        }
    };
}

var createBoard = function () {
    return {
        getRowCount: function () { return 8; },
        getColumnCount: function () { return 8; },

        isInside: function (position) {
            return (0 <= position.row)
                && (position.row < this.getRowCount())
                && (0 <= position.column)
                && (position.column < this.getColumnCount());
        }
    };
};

