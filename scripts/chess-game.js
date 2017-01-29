/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.game = (function () {
    "use strict";
    var initialized = false;
    var state = "match";
    var board = CHESS_APP.createDomBoard();
    var turn = CHESS_APP.createTurn(CHESS_APP.createRules());

    function showVictory() {
        $('#gameState').text('Checkmate! Winner: ' + turn.getCurrentPlayer());
        $('#gameState').addClass("victory");
    }

    function onSquareClicked(position, previousPosition) {
        if (state === "finished") {
            return;
        }

        if (position.equals(previousPosition)) {
            board.removeSelection();
            return;
        }

        var piece = board.getPiece(position);

        if (piece && (piece.player === turn.getCurrentPlayer())) {
            board.selectSquare(position);
            return;
        }

        if (!previousPosition) {
            return;
        }

        var result = turn.move(board, previousPosition, position);

        if (!result.isGood()) {
            if (result.positionInCheck) {
                board.highlightPieceUnderThreat(result.positionInCheck);
            }

            return;
        }

        if (result.isCheckMate()) {
            showVictory();
            state = "finished";
        }

        board.removeSelection();
    }

    return {
        initialize: function initialize() {
            if (initialized) {
                return;
            }

            board.initialize();
            board.listenSquareClick(onSquareClicked);

            turn.listenCurrentPlayer(function (player) {
                $("#player_in_turn").text(player);
            });

            initialized = true;
        }
    };
}());
