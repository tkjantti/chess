
chessGame = function() {
    var initialized = false;
    var currentPlayer = "white";
    var selectedSquare = null;

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

        if (! isLegalMove(board, selectedPiece, selectedPosition, position)) {
            return;
        }
        
        board.move(selectedPosition, position);
        
        if (isInCheck(board, currentPlayer)) {
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

    function isInCheck(board, currentPlayer) {
        var opponent = opponentPlayer(currentPlayer);
        var positionOfKing = board.getPositionOf(createPiece(currentPlayer, "king"));
        var attackingPiece = board.findPiece(function (piece, position) {
            return (piece.player === opponent) && isLegalMove(board, piece, position, positionOfKing);
        });
        return attackingPiece;
    }

    function isLegalMove(board, piece, source, destination) {
        if (! board.isInside(destination)) {
            return false;
        }

        var pieceAtDestination = board.getPiece(destination);
        if (pieceAtDestination && pieceAtDestination.player === piece.player) {
            return false;
        }
        
        var horizontal = getHorizontalMovement(source, destination);
        var vertical = getVerticalMovement(source, destination, piece.player);

        switch (piece.type) {
        case "pawn":
            var isFirstMove = getVerticalPosition(piece.player, source) === 1;
            var isCorrectLengthForwardMove = (vertical === 1) || (isFirstMove && vertical === 2);
            
            if (isCorrectLengthForwardMove && isVerticalMove(board, source, destination) && !pieceAtDestination) {
                return true;
            }

            if ((horizontal === -1 || horizontal === 1) && vertical === 1 && pieceAtDestination) {
                return true;
            }
            
            return false;

        case "knight":
            return (Math.abs(horizontal) === 1 && Math.abs(vertical) === 2)
                || (Math.abs(horizontal) === 2 && Math.abs(vertical) === 1);

        case "bishop":
            return isDiagonalMove(board, source, destination);
            
        case "rook":
            return isHorizontalMove(board, source, destination) || isVerticalMove(board, source, destination);

        case "queen":
            return isDiagonalMove(board, source, destination)
                || isHorizontalMove(board, source, destination)
                || isVerticalMove(board, source, destination);
            
        case "king":
            return (Math.abs(horizontal) <= 1 && Math.abs(vertical) <= 1);
            
        default:
            console.log("unknown piece type: " + piece.type);
            return false;
        };
    }

    function isDiagonalMove(board, source, destination) {
        if (source.row === destination.row) {
            return false;
        }

        if (Math.abs(destination.column - source.column) != Math.abs(destination.row - source.row)) {
            return false;
        }

        var leftmostPoint = (source.column < destination.column) ? source : destination;
        var rightmostPoint = (source.column > destination.column) ? source : destination;
        var rowStep = (rightmostPoint.row > leftmostPoint.row) ? 1 : -1;

        for (var r = leftmostPoint.row + rowStep, c = leftmostPoint.column + 1;
             c < rightmostPoint.column;
             r += rowStep, c++)
        {
            if (board.getPiece(createPoint(r, c))) {
                return false;
            }
        }

        return true;
    }

    function isHorizontalMove(board, source, destination) {
        if (source.row != destination.row) {
            return false;
        }

        var min = Math.min(source.column, destination.column);
        var max = Math.max(source.column, destination.column);

        for (var i = min + 1; i < max; i++) {
            if (board.getPiece(createPoint(source.row, i))) {
                return false;
            }
        }

        return true;
    }

    function isVerticalMove(board, source, destination) {
        if (source.column != destination.column) {
            return false;
        }

        var min = Math.min(source.row, destination.row);
        var max = Math.max(source.row, destination.row);

        for (var i = min + 1; i < max; i++) {
            if (board.getPiece(createPoint(i, source.column))) {
                return false;
            }
        }

        return true;
    }


    function getVerticalPosition(player, position) {
        if (player === "white") {
            return 7 - position.row;
        } else {
            return position.row;
        }
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

    function getHorizontalMovement(source, destination) {
        return destination.column - source.column;
    }

    function getVerticalMovement(source, destination, player) {
        if (player === "white") {
            return source.row - destination.row;
        } else {
            return destination.row - source.row;
        }
    }


    function changePlayer() {
        setCurrentPlayer(opponentPlayer(currentPlayer));
    }

    function opponentPlayer(player) {
        return (player === "white") ? "black" : "white";
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
