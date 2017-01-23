/*jslint browser:true, fudge:true, this:true */
/*global window, $, CHESS_APP */

CHESS_APP.createTurn = function (rules) {
    "use strict";

    var currentPlayer = "white";
    var onPlayerChangedHandler = null;

    var changePlayer = function () {
        currentPlayer = rules.opponentPlayer(currentPlayer);
        if (onPlayerChangedHandler) {
            onPlayerChangedHandler(currentPlayer);
        }
    };

    return {
        getCurrentPlayer: function () {
            return currentPlayer;
        },

        listenCurrentPlayer: function (onPlayerChanged) {
            onPlayerChangedHandler = onPlayerChanged;
            onPlayerChangedHandler(currentPlayer);
        },

        move: function (board, source, destination) {
            var piece = board.getPiece(source);

            if (!piece) {
                return {
                    success: false
                };
            }

            if (!rules.isLegalMove(board, source, destination)) {
                return {
                    success: false
                };
            }

            var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
            tempBoard.move(source, destination);

            var positionInCheck = rules.isInCheck(tempBoard, currentPlayer);
            if (positionInCheck) {
                return {
                    success: false,
                    positionInCheck: positionInCheck
                };
            }

            var capturedPiece = board.getPiece(destination);

            if (capturedPiece) {
                board.removePiece(destination);
            }

            board.move(source, destination);

            changePlayer();

            return {
                success: true
            };
        }
    };
};

