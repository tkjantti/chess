
var gridWidth = 8;
var gridHeight = 8;

var selectedSquare = null;


jQuery(document).ready(function() {
    addBoardClickHandlers();
    setStartingPositions();
});

function Point(row, column) {
    this.row = row;
    this.column = column;
}

function setStartingPositions() {
    $("#square_0_0").append($("#black_rook_1"));
    $("#square_0_1").append($("#black_knight_1"));
    $("#square_0_2").append($("#black_bishop_1"));
    $("#square_0_3").append($("#black_queen"));
    $("#square_0_4").append($("#black_king"));
    $("#square_0_5").append($("#black_bishop_2"));
    $("#square_0_6").append($("#black_knight_2"));
    $("#square_0_7").append($("#black_rook_2"));

    $("#square_1_0").append($("#black_pawn_1"));
    $("#square_1_1").append($("#black_pawn_2"));
    $("#square_1_2").append($("#black_pawn_3"));
    $("#square_1_3").append($("#black_pawn_4"));
    $("#square_1_4").append($("#black_pawn_5"));
    $("#square_1_5").append($("#black_pawn_6"));
    $("#square_1_6").append($("#black_pawn_7"));
    $("#square_1_7").append($("#black_pawn_8"));

    $("#square_6_0").append($("#white_pawn_1"));
    $("#square_6_1").append($("#white_pawn_2"));
    $("#square_6_2").append($("#white_pawn_3"));
    $("#square_6_3").append($("#white_pawn_4"));
    $("#square_6_4").append($("#white_pawn_5"));
    $("#square_6_5").append($("#white_pawn_6"));
    $("#square_6_6").append($("#white_pawn_7"));
    $("#square_6_7").append($("#white_pawn_8"));

    $("#square_7_0").append($("#white_rook_1"));
    $("#square_7_1").append($("#white_knight_1"));
    $("#square_7_2").append($("#white_bishop_1"));
    $("#square_7_3").append($("#white_queen"));
    $("#square_7_4").append($("#white_king"));
    $("#square_7_5").append($("#white_bishop_2"));
    $("#square_7_6").append($("#white_knight_2"));
    $("#square_7_7").append($("#white_rook_2"));
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

