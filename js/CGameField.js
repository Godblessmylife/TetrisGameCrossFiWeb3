function CGameField() {
    var _aGrid = new Array();
    var _bAnimFullLines = false;

    this._init = function () {
        if (s_bMobile) {
            START_GRID_Y = CANVAS_HEIGHT_HALF - (GRID_Y * GRID_Y);
        }

        var iX = START_GRID_X;
        var iY = START_GRID_Y;
        for (var i = 0; i < GRID_Y; i++) {
            _aGrid[i] = new Array();
            for (var j = 0; j < GRID_X; j++) {
                _aGrid[i][j] = {x: iX, y: iY, occupied: false, cell: null, childID: null};
                this.createCellTest(iX, iY);
                iX += CELL_SIZE + CELL_OFFSET.x;

            }
            iY += CELL_SIZE + CELL_OFFSET.y;
            iX = START_GRID_X;
        }
        this.setID();
    };

    this.createCellTest = function (iX, iY) {
        if (!SHOW_CELL) {
            return;
        }
        var oCellGraphic;
        var oSpriteCell = s_oSpriteLibrary.getSprite("cell");
        oCellGraphic = createBitmap(oSpriteCell);
        oCellGraphic.x = iX;
        oCellGraphic.y = iY;
        oCellGraphic.regX = oSpriteCell.width * 0.5;
        oCellGraphic.regY = oSpriteCell.height * 0.5;
        s_oStage.addChild(oCellGraphic);
        s_oStage.setChildIndex(oCellGraphic, 1);
    };

    this.setID = function () {
        var oSprite = s_oSpriteLibrary.getSprite("cell_" + 0);
        for (var i = GRID_Y - 1; i > -1; i--) {
            for (var j = GRID_X - 1; j > -1; j--) {
                _aGrid[i][j].childID = new CCell(_aGrid[i][j].x, _aGrid[i][j].y, 0, oSprite, s_oGame.getContainerGame());
                _aGrid[i][j].childID.setVisible(false);
            }
        }
    };

    this.getMiddleGridX = function () {
        return _aGrid[0][GRID_X_HALF].x;
    };

    this.getStartGridY = function () {
        return _aGrid[0][0].y;
    };

    this.getXByCol = function (iCol) {
        return _aGrid[0][iCol].x;
    };

    this.getYByRow = function (iRow) {
        return _aGrid[iRow][0].y;
    };

    this.setCellState = function (iRow, iCol, bState) {
        _aGrid[iRow][iCol].occupied = bState;
    };

    this.getCellState = function (iRow, iCol) {
        return _aGrid[iRow][iCol].occupied;
    };

    this.checkDirection = function (oBlock, iDir) {
        var bHitSomething = false, oRenderOffsets = {x: 0, y: 0}, bFilled,
                iRenderCoordX, iRenderCoordY;

        for (var iStep = 0; iStep < oBlock.getWidth() * oBlock.getHeight(); iStep++) {
            iRenderCoordX = oBlock.getCol() + oRenderOffsets.x;
            iRenderCoordY = oBlock.getRow() + oRenderOffsets.y;

            switch (iDir) {
                case UP:
                    iRenderCoordY--;
                    break;
                case RIGHT:
                    iRenderCoordX++;
                    break;
                case DOWN:
                    iRenderCoordY++;
                    break;
                case LEFT:
                    iRenderCoordX--;
                    break;
            }
            if (iRenderCoordY > GRID_Y - 1) {
                return true;
            }
            if (_aGrid[iRenderCoordY][iRenderCoordX].occupied) {
                bFilled = oBlock.pieceFilled(iStep);
                if (bFilled) {
                    bHitSomething = true;
                    break;
                }
            }

            oRenderOffsets = oBlock.updateRenderOffsets(oRenderOffsets);
        }

        return bHitSomething;
    };

    this.getChildID = function (iRow, iCol) {
        return _aGrid[iRow][iCol].childID.getChildIndex();
    };

    this.checkHitBottom = function (oBlock) {
        var _bHitSomething = this.checkDirection(oBlock, DOWN);
        if (oBlock.getRow() + oBlock.getHeight() >= _aGrid.length) {
            _bHitSomething = true;
        }

        if (!_bHitSomething) {
            return;
        }

        oBlock.setReplace(true);
        var aCells = oBlock.getBlock();

        for (var i = 0; i < aCells.length; i++) {
            _aGrid[aCells[i].getRow()][aCells[i].getCol()].occupied = true;
            _aGrid[aCells[i].getRow()][aCells[i].getCol()].cell = aCells[i];
        }

        this.checkForFullLines();
    };

    this.badRotation = function (aRotateBlock, oBlock) {
        var iHitSomething = 0, oRenderOffsets = {x: 0, y: 0},
        iRenderCoordX, iRenderCoordY;

        for (var iStep = 0; iStep < aRotateBlock[0].length * aRotateBlock.length; iStep++) {
            iRenderCoordX = oBlock.getCol() + oRenderOffsets.x;
            iRenderCoordY = oBlock.getRow() + oRenderOffsets.y;

            if (iRenderCoordY > GRID_Y - 1) {
                return 1;
            }

            if (iRenderCoordX > GRID_X - 1) {
                oBlock.setCol(oBlock.getCol() - oBlock.getWidth() + 1);
                return 2;
            }

            if (_aGrid[iRenderCoordY][iRenderCoordX].occupied) {
                iHitSomething = 1;
                break;
            }
            oRenderOffsets.x++;
            if (oRenderOffsets.x >= aRotateBlock[0].length) {
                oRenderOffsets.y++;
                oRenderOffsets.x = 0;
            }
        }
        return iHitSomething;
    };

    this.isAnimFullLines = function () {
        return _bAnimFullLines;
    };

    this.checkForFullLines = function () {
        var iFullLines = 0, iLinePieceCount;
        var aDeleteLine = new Array();
        var iID = 0;

        for (var i = 0; i < _aGrid.length; i++) {
            iLinePieceCount = 0;
            for (var j = 0; j < _aGrid[0].length; j++) {
                if (_aGrid[i][j].occupied) {
                    iLinePieceCount++;
                }
            }

            if (iLinePieceCount === _aGrid[0].length) {
                iFullLines++;
                aDeleteLine[iID] = i;
                iID++;
                var iTime = DELAY_CELL_DESTROY_MS;
                for (var j = 0; j < _aGrid[0].length; j++) {
                    _aGrid[i][j].occupied = false;
                    this.animCellDestroy(_aGrid[i][j], iTime);
                    iTime += DELAY_CELL_DESTROY_MS;
                }
            }
        }

        if (iFullLines > 0) {
            // console.log(iFullLines);
            _bAnimFullLines = true;
            playSound("delete_lines", 1, false);
            iTime += CELL_DESTROY_MS * 2;
            createjs.Tween.get(this).wait(iTime).call(function () {
                s_oGame.calculateScore(iFullLines);
                s_oGame.checkForNewLevel(iFullLines);
                this.checkEmptyRowForFall(aDeleteLine);
                _bAnimFullLines = false;
            });
        }
    };

    this.animCellDestroy = function (oCell, iTime) {
        oCell.cell.changeState(1);
        createjs.Tween.get(oCell.cell.getSprite()).wait(iTime).to({scaleX: 0, scaleY: 0}, CELL_DESTROY_MS, createjs.Ease.cubicOut).call(function () {
            if (oCell.occupied === true) {
                oCell.cell.unload();
            }
        });
    };

    this.checkEmptyRowForFall = function (aDeleteLine) {
        var iTimeWait = 0;
        for (var i = 0; i < aDeleteLine.length; i++) {
            for (var k = 0; k < _aGrid[i].length; k++) {
                for (var j = aDeleteLine[i] - 1; j > -1; j--) {
                    if (_aGrid[j][k].occupied === true) {
                        _aGrid[j][k].occupied = false;
                        _aGrid[j + 1][k].cell = _aGrid[j][k].cell;
                        _aGrid[j][k].cell = null;
                        _aGrid[j + 1][k].occupied = true;

                    }
                }
            }
        }
        for (var j = _aGrid[i].length - 1; j > -1; j--) {
            for (var i = _aGrid.length - 1; i > -1; i--) {
                if (_aGrid[i][j].occupied === true) {
                    _aGrid[i][j].cell.setChildIndex(this.getChildID(i, j));
                    this.animateLineDown(_aGrid[i][j].cell.getSprite(), _aGrid[i][j].y, iTimeWait);
                    iTimeWait += DELAY_LINE_DOWN;
                }
            }
        }
    };

    this.animateLineDown = function (oCell, iY, iTimeWait) {
        createjs.Tween.get(oCell).wait(iTimeWait).to({y: iY}, LINE_DOWN_TIME, createjs.Ease.cubicOut);
    };

    this.unload = function () {
        for (var i = 0; i < _aGrid.length; i++) {
            for (var j = 0; j < _aGrid[0].length; j++) {
                if (_aGrid[i][j].occupied) {
                    _aGrid[i][j].cell.unload();
                }
            }
        }
        _aGrid = null;
        s_oGameField = null;
    };

    this._init();

    s_oGameField = this;

    return this;
}
var s_oGameField;