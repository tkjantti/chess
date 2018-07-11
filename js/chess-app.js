/* jshint devel:true */

(function (exports) {
    "use strict";

    function showMessage(message, style) {
        $('#gameStatus').removeClass();
        $('#gameStatusText').text(message);
        if (style) {
            $('#gameStatus').addClass(style);
        }
    }

    var errorHandler = {
        showError: function (message, exception) {
            showMessage(message, "error");
            console.log("Error: " + message);
            console.log(exception);
        }
    };

    var initialized = false;
    var board = new CHESS_APP.DomBoard();
    var game = new CHESS_APP.Game(new CHESS_APP.Rules(), errorHandler);

    function initializeMenu() {
        $("#newGame").click(function (event) {
            event.preventDefault();
            game.reset(board);
        });
    }

    function displayCurrentPlayer(player) {
        showMessage("Player in turn: " + player);
    }

    function displayState(state) {
        switch (state) {
        case CHESS_APP.Game.STATE_CHECKMATE:
            showMessage('Checkmate! Winner: ' + game.getCurrentPlayer(), "victory");
            break;
        case CHESS_APP.Game.STATE_DRAW:
            showMessage("Draw!", "draw");
            break;
        default:
            displayCurrentPlayer(game.getCurrentPlayer());
            break;
        }
    }

    function addMoveResultToList(moveResult) {
        var textNotation = moveResult.toMoveNotationString();

        if (moveResult.getPlayer() === "white") {
            $('#moves').find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .text(textNotation)
                    )
                );
        } else {
            $('#moves tr:last').append($('<td>')
                .text(textNotation)
            );
        }
    }

    function clearMoveList() {
        $('#moves tr').remove();
    }

    function onSquareClicked(position, previousPosition) {
        if (game.isFinished()) {
            return;
        }

        if (position.equals(previousPosition)) {
            board.removeSelection();
            return;
        }

        var piece = board.getPiece(position);

        if (piece && (piece.player === game.getCurrentPlayer())) {
            board.selectSquare(position);
            return;
        }

        if (!previousPosition) {
            return;
        }

        var result = game.move(board, previousPosition, position);

        if (!result.isLegal) {
            if (result.positionInCheck) {
                board.highlightPieceUnderThreat(result.positionInCheck);
            }

            return;
        }

        game.save();

        board.removeSelection();
    }

    exports.app = {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            initializeMenu();

            board.initialize();
            board.listenSquareClick(onSquareClicked);

            game.listenCurrentPlayer(displayCurrentPlayer);
            game.listenState(displayState);
            game.moveLog.listenAdd(addMoveResultToList);
            game.moveLog.listenClear(clearMoveList);

            game.load(board);

            initialized = true;
        }
    };
}(this.CHESS_APP = this.CHESS_APP || {}));
