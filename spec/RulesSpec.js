/*jslint fudge:true */
/*global window, describe, beforeEach, it, expect, CHESS_APP, CHESS_TEST */

describe("Rules", function () {
    "use strict";
    describe("opponentPlayer", function () {
        var rules;

        beforeEach(function () {
            rules = CHESS_APP.createRules();
        });

        it("should return black when given white", function () {
            var opponent = rules.opponentPlayer("white");
            expect(opponent).toBe("black");
        });

        it("should return white when given black", function () {
            var opponent = rules.opponentPlayer("black");
            expect(opponent).toBe("white");
        });
    });

    describe("isLegalMove", function () {
        var rules;
        var abs = function (board, point) {
            return board.getAbsolutePosition("white", point);
        };

        beforeEach(function () {
            rules = CHESS_APP.createRules();
        });

        describe("Pawn", function () {
            it("can move forward one step", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBe(true);
            });

            it("can not move forward more than one step from the third row", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var result2 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(2, 0)));
                var result3 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(3, 0)));
                var result4 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(4, 0)));

                expect(result2).toBe(false);
                expect(result3).toBe(false);
                expect(result4).toBe(false);
            });

            it("can move forward two steps from second row", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(1, 1);
                var p2 = p1.add(2, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBe(true);
            });

            it("can not move forward more than two steps from second row", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(1, 1);

                var result3 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(3, 0)));
                var result4 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(4, 0)));
                var result5 = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(5, 0)));

                expect(result3).toBe(false);
                expect(result4).toBe(false);
                expect(result5).toBe(false);
            });

            it("can not move in other direction than forward", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var diagLeftResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, -1)));
                var diagRightResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(1, 1)));
                var leftResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(0, -1)));
                var rightResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(0, 1)));
                var diagBackLeftResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, -1)));
                var diagBackRightResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 1)));
                var backResult = rules.isLegalMove(board, abs(board, p1), abs(board, p1.add(-1, 0)));

                expect(diagLeftResult).toBe(false);
                expect(diagRightResult).toBe(false);
                expect(leftResult).toBe(false);
                expect(rightResult).toBe(false);
                expect(diagBackLeftResult).toBe(false);
                expect(diagBackRightResult).toBe(false);
                expect(backResult).toBe(false);
            });

            it("can not move when blocked by an own piece", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " Q      ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBe(false);
            });

            it("can not move when blocked by an opponent piece", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "        ",
                    " q      ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, 0);
                var result = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(result).toBe(false);
            });

            it("can destroy an opponent piece diagonally forward", function () {
                var board = CHESS_TEST.boardState([
                    "        ",
                    "        ",
                    "        ",
                    "      r ",
                    "q    P  ",
                    " P      ",
                    "        ",
                    "        "
                ]);

                var p1 = CHESS_APP.createPoint(2, 1);
                var p2 = p1.add(1, -1);
                var resultLeft = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                p1 = CHESS_APP.createPoint(3, 5);
                p2 = p1.add(1, 1);
                var resultRight = rules.isLegalMove(board, abs(board, p1), abs(board, p2));

                expect(resultLeft).toBe(true);
            });
        });
    });
});
