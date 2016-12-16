
chessGame = function() {
    var initialized = false;
    var currentPlayer = "white";
    var selectedSquare = null;
    var rules = createRules();

    function createBoardFromPage() {
        var board = createBoard();

        for (var row = 0; row < board.getRowCount(); row++) {
            for (var column = 0; column < board.getColumnCount(); column++) {
                var position = createPoint(row, column);
                var piece = getPiece(board, position);
                if (piece) {
                    board.setPiece(position, createPiece(getPlayerOf(piece), getType(piece)));
                }
            }
        }

        return board;
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

    function setCurrentPlayer(player) {
        currentPlayer = player;
        $("#player_in_turn").text(player);
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
        var position = getSquarePosition(square);
        var board = createBoardFromPage();
        var piece = board.getPiece(position);

        if (! selectedSquare) {
            if (piece && (piece.player === currentPlayer)) {
                selectSquare(square);
            }
            return;
        }

        if (square.attr("id") === selectedSquare.attr("id")) {
            removeSelection();
            return;
        }

        var selectedPosition = getSquarePosition(selectedSquare);
        var selectedPiece = board.getPiece(selectedPosition);

        if (piece && (piece.player === selectedPiece.player)) {
            removeSelection();
            selectSquare(square);
        }

        if (! rules.isLegalMove(board, selectedPiece, selectedPosition, position)) {
            return;
        }
        
        board.move(selectedPosition, position);
        
        if (rules.isInCheck(board, currentPlayer)) {
            var positionOfKing = board.getPositionOf(createPiece(currentPlayer, "king"));
            highlightPieceUnderThreat(positionOfKing);
            return;
        }

        if (piece) {
            removeFromBoard(getPieceOnSquare(square));
        }

        move(square, getPieceOnSquare(selectedSquare));
        removeSelection();
        changePlayer();
    }

    function highlightPieceUnderThreat(position) {
        var square = getSquare(position);
        square.addClass("threat");
        window.setTimeout(function () {
            square.removeClass("threat");
        }, 1000);
    }

    function getSquarePosition(square) {
        var stringCoordinates = square.attr("id").split("_");
        return createPoint(parseInt(stringCoordinates[1], 10), parseInt(stringCoordinates[2], 10));
    }

    function getType(piece) {
        var parts = piece.id.split("_");
        return parts[1];
    }

    function getPiece(board, position) {
        if (! board.isInside(position)) {
            return null;
        }

        var square = getSquare(position);
        return getPieceOnSquare(square);
    }

    function getSquare(position) {
        return $("#square_" + position.row + "_" + position.column);
    }

    function changePlayer() {
        setCurrentPlayer(rules.opponentPlayer(currentPlayer));
    }

    function move(square, piece) {
        square.append(piece);
    }

    function removeFromBoard(piece) {
        var freeSquare = getSideSquares(piece)
            .filter(function(index, element) {
                return $(element).children().length === 0;
            }).first();
        
        freeSquare.append(piece);
    }

    function getSideSquares(piece) {
        return $("#" + getPlayerOf(piece) + "_pieces td");
    }


    function getPlayerOf(piece) {
        if (piece.id.includes("black")) {
            return "black";
        }
        if (piece.id.includes("white")) {
            return "white";
        }
        return null;
    }

    function selectSquare(square) {
        square.addClass("selected");
        selectedSquare = square;
    }

    function removeSelection() {
        selectedSquare.removeClass("selected");
        selectedSquare = null;
    }

    function getPieceOnSquare(square) {
        var children = square.children("img");
        if (children.length === 0) {
            return null;
        }
        return children[0];
    }
    
    return {
        initialize: function initialize() {
            if (initialized) {
                return;
            }
            addBoardClickHandlers();
            setStartingPositions();
            setCurrentPlayer("white");
            initialized = true;
        }
    };
}();
