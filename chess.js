
var gridWidth = 8;
var gridHeight = 8;

var selectedSquare = null;


jQuery(document).ready(function() {
    addBoardClickHandlers();
});

function Point(row, column) {
    this.row = row;
    this.column = column;
}

function addBoardClickHandlers() {
    $("#board td").click(function() {
        onSquareClicked($(this));
    });
    $("#black_pieces td").click(function() {
        onSquareClicked($(this));
    })
    $("#white_pieces td").click(function() {
        onSquareClicked($(this));
    })
}

function onSquareClicked(square) {
    var piece = getPiece(square);

    if (! selectedSquare) {
        if (piece) {
            selectSquare(square);
        }
        return;
    } else if (square.attr("id") === selectedSquare.attr("id")) {
        removeSelection();
    } else if (piece) {
        removeSelection();
        selectSquare(square);
    } else {
        var selectedPiece = getPiece(selectedSquare);
        square.append(selectedPiece);
        removeSelection();
        return;
    }
}

function selectSquare(square) {
    // TODO meneekö lisätty luokka varmasti vanhan luokan edelle
    square.addClass("selected");
    selectedSquare = square;
}

function removeSelection() {
    selectedSquare.removeClass("selected");
    selectedSquare = null;
}

function getPiece(square) {
    var children = square.children("img");
    console.log("child count " + children.length);

    if (children.length === 0) {
        return null;
    }

    return children[0];
}

