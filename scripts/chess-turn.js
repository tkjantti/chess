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

    var createMove = function (result, positionInCheck) {
        return {
            result: result,
            positionInCheck: positionInCheck,
            isGood: function () {
                return this.result !== "bad_move";
            }
        };
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
                return createMove("bad_move");
            }

            var inspectionResult = rules.inspectMove(board, source, destination);

            if (!inspectionResult.isLegal) {
                return createMove("bad_move");
            }

            var tempBoard = CHESS_APP.cloneInMemoryBoard(board);
            tempBoard.move(source, destination);

            var positionInCheck = rules.isInCheck(tempBoard, currentPlayer);
            if (positionInCheck) {
                return createMove("bad_move", positionInCheck);
            }

            var capturedPiece = board.getPiece(destination);

            if (capturedPiece) {
                board.removePiece(destination);
            }

            board.move(source, destination);

            if (rules.isInCheckMate(board, rules.opponentPlayer(currentPlayer))) {
                return createMove("checkmate");
            }

            changePlayer();

            return createMove("good_move");
        }
    };
};
