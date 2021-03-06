
describe('Game', function () {
    "use strict";

    var game;
    var rules = new CHESS_APP.Rules();
    var errorHandler = {
        showError: function () {}
    };
    var board;
    var source;
    var destination;

    beforeEach(function () {
        rules = new CHESS_APP.Rules();
        game = new CHESS_APP.Game(rules, errorHandler);
        board = new CHESS_APP.InMemoryBoard(8, 8);
        source = new CHESS_APP.Point(4, 4);
        destination = new CHESS_APP.Point(5, 4);

        spyOn(rules, "isDraw").and.returnValue(false);
    });

    describe('move', function () {
        it('returns legal result if the move is legal', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            var result = game.move(board, source, destination);

            expect(result.isLegal).toBe(true);
        });

        it('calls methods from rules to determine that a move is good', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue(new CHESS_APP.InspectionResult(
                true,
                [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            ));
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(rules, "wouldResultInCheck").and.returnValue(null);

            game.move(board, source, destination);

            expect(rules.inspectMove).toHaveBeenCalledWith(
                board,
                "white",
                jasmine.objectContaining({
                    source: source,
                    destination: destination
                }),
                jasmine.any(CHESS_APP.MoveLog));
            expect(rules.wouldResultInCheck).toHaveBeenCalledWith(
                jasmine.any(CHESS_APP.Board),
                "white",
                jasmine.any(CHESS_APP.InspectionResult),
                jasmine.any(CHESS_APP.MoveLog));
        });

        it('makes the move if it is legal', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(rules, "updateBoard");

            var result = game.move(board, source, destination);

            expect(result.isLegal).toBe(true);
            expect(rules.updateBoard).toHaveBeenCalled();
        });

        it('changes the current player if the move succeeds', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            var result = game.move(board, source, destination);

            expect(result.isLegal).toBe(true);
            expect(game.getCurrentPlayer()).toBe("black");
        });

        it('does not move if the move is not legal', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: false
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(rules, "updateBoard");

            var result = game.move(board, source, destination);

            expect(result.isLegal).toBe(false);
            expect(rules.updateBoard).not.toHaveBeenCalled();
        });

        it('does not move if the move would result in a check position', function () {
            var positionInCheck = new CHESS_APP.Point(4, 3);
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(positionInCheck);
            spyOn(board, "move");

            var result = game.move(board, source, destination);

            expect(result.isLegal).toBe(false);
            expect(result.positionInCheck).toEqual(positionInCheck);
            expect(board.move).not.toHaveBeenCalled();
        });

        it('changes state to checkmate if the move results in a checkmate', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            spyOn(rules, "isInCheckMate").and.callFake(function (ignore, player) {
                return player === "black";
            });

            game.move(board, source, destination);

            expect(game.state).toBe(CHESS_APP.Game.STATE_CHECKMATE);
            expect(game.isFinished()).toBe(true);
            expect(rules.isInCheckMate).toHaveBeenCalledWith(
                jasmine.any(CHESS_APP.Board),
                "black",
                jasmine.any(CHESS_APP.MoveLog));
        });

        it('adds performed moves to log', function () {
            var white_source = new CHESS_APP.Point(6, 0);
            var white_destination = new CHESS_APP.Point(5, 0);

            var black_source = new CHESS_APP.Point(1, 1);
            var black_destination = new CHESS_APP.Point(2, 1);

            board.setPiece(white_source, new CHESS_APP.Piece("white", "pawn"));
            board.setPiece(black_source, new CHESS_APP.Piece("black", "pawn"));

            spyOn(rules, "inspectMove").and.returnValues({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), white_source, white_destination)
                ]
            }, {
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("black", "pawn"), black_source, black_destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValues(null, null);
            spyOn(rules, "isInCheckMate").and.returnValues(false, true);

            game.move(board, white_source, white_destination);
            game.move(board, black_source, black_destination);

            expect(game.moveLog.moves).toEqual([
                jasmine.objectContaining({
                    isLegal: true,
                    actualMoves: [
                        new CHESS_APP.ActualMove(
                            new CHESS_APP.Piece("white", "pawn"),
                            white_source,
                            white_destination)
                    ]
                }),
                jasmine.objectContaining({
                    isLegal: true,
                    actualMoves: [
                        new CHESS_APP.ActualMove(
                            new CHESS_APP.Piece("black", "pawn"),
                            black_source, black_destination)
                    ]
                })
            ]);
        });

        it('does not add bad moves to log', function () {
            var white_source = new CHESS_APP.Point(6, 0);
            var white_destination = new CHESS_APP.Point(5, 0);

            var black_source = new CHESS_APP.Point(1, 1);
            var black_destination = new CHESS_APP.Point(2, 1);

            board.setPiece(white_source, new CHESS_APP.Piece("white", "pawn"));
            board.setPiece(black_source, new CHESS_APP.Piece("black", "pawn"));

            spyOn(rules, "inspectMove").and.returnValues({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), white_source, white_destination)
                ]
            }, {
                isLegal: false
            });
            spyOn(rules, "isInCheck").and.returnValues(null, null);

            game.move(board, white_source, white_destination);
            game.move(board, black_source, black_destination);

            expect(game.moveLog.moves).toEqual([
                jasmine.objectContaining({
                    isLegal: true,
                    actualMoves: [
                        new CHESS_APP.ActualMove(
                            new CHESS_APP.Piece("white", "pawn"),
                            white_source,
                            white_destination
                        )
                    ]
                })
            ]);
        });

        it('changes state to draw if the move results in a draw', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(null);

            rules.isDraw.and.callFake(function (ignore, player) {
                if (player === "black") {
                    return true;
                } else {
                    return false;
                }
            });

            game.move(board, source, destination);

            expect(game.state).toBe(CHESS_APP.Game.STATE_DRAW);
            expect(game.isFinished()).toBe(true);
        });

        it('does not change the state if there is no checkmate or draw', function () {
            board.setPiece(source, new CHESS_APP.Piece("white", "pawn"));

            spyOn(rules, "inspectMove").and.returnValue({
                isLegal: true,
                actualMoves: [
                    new CHESS_APP.ActualMove(
                        new CHESS_APP.Piece("white", "pawn"), source, destination)
                ]
            });
            spyOn(rules, "isInCheck").and.returnValue(null);
            rules.isDraw.and.returnValue(false);
            spyOn(board, "move");

            game.move(board, source, destination);

            expect(game.state).toBe(CHESS_APP.Game.STATE_GAME_ON);
            expect(game.isFinished()).toBe(false);
        });
    });
});
