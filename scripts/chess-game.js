
var CHESS_APP = CHESS_APP || {};

CHESS_APP.game = function () {
    var initialized = false;
    var currentPlayer = "white";
    var selectedPosition = null;
    var rules = CHESS_APP.createRules();
    var domBoard = null;

    function setCurrentPlayer(player) {
        currentPlayer = player;
        $("#player_in_turn").text(player);
    }

    var selectSquare = function (position) {
        domBoard.selectSquare(position);
        selectedPosition = position;
    };

    var removeSelection = function (position) {
        domBoard.removeSelection();
        selectedPosition = null;
    };

    function onSquareClicked(position, piece) {
        var board = CHESS_APP.cloneInMemoryBoard(domBoard);

        if (! selectedPosition) {
            if (piece && (piece.player === currentPlayer)) {
                selectSquare(position);
            }
            return;
        }

        if (position.equals(selectedPosition)) {
            removeSelection();
            return;
        }

        var selectedPiece = board.getPiece(selectedPosition);

        if (piece && (piece.player === selectedPiece.player)) {
            removeSelection();
            selectSquare(position);
        }

        if (! rules.isLegalMove(board, selectedPiece, selectedPosition, position)) {
            return;
        }
        
        board.move(selectedPosition, position);
        
        if (rules.isInCheck(board, currentPlayer)) {
            var positionOfKing = board.getPositionOf(CHESS_APP.createPiece(currentPlayer, "king"));
            domBoard.highlightPieceUnderThreat(positionOfKing);
            return;
        }

        if (piece) {
            domBoard.removeFromBoard(position);
        }

        domBoard.move(selectedPosition, position);
        removeSelection();
        changePlayer();
    }

    function changePlayer() {
        setCurrentPlayer(rules.opponentPlayer(currentPlayer));
    }

    return {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            domBoard = CHESS_APP.createDomBoard(onSquareClicked);
            setCurrentPlayer("white");
            initialized = true;
        }
    };
}();
