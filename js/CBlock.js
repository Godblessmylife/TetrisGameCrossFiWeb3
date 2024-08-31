function CBlock(iType, oSprite, oParentContainer) {
    var _iType = iType;
    var _iOrientation = 0;
    var _iRow;
    var _iCol;
    var _bReplace = false;
    var _aSpriteBlock;
    var _aBlockType = BLOCKS_TYPE[_iType];
    var _oParentContainer = oParentContainer;

    this._init = function (oSprite) {
        _iCol = Math.floor(GRID_X_HALF - this.getWidth() / 2);
        _iRow = 0;
        _aSpriteBlock = this.createSpriteBlock(oSprite);
        this.refreshCellPosition();
        this.orderCellsChildIndex();
    };

    this.getHeight = function () {
        return _aBlockType.length;
    };

    this.getWidth = function () {
        return _aBlockType[0].length;
    };

    this.createSpriteBlock = function (oSprite) {
        var aSpriteBlock = new Array();

        var iCol = _iCol;
        var iRow = _iRow;

        var iX = s_oGameField.getXByCol(iCol);
        var iY = s_oGameField.getYByRow(iRow);
        var iChildID = (_aBlockType.length * _aBlockType[0].length);
        var iID = 0;
        for (var i = 0; i < _aBlockType.length; i++) {
            for (var j = 0; j < _aBlockType[i].length; j++) {
                if (_aBlockType[i][j] === 1) {
                    aSpriteBlock[iID] = this.createCell(iX, iY, oSprite, iRow, iCol, 0);
                    iID++;
                }
                iCol++;
                iX = s_oGameField.getXByCol(iCol);
                iChildID--;
            }
            iRow++;
            iCol = _iCol;
            iY = s_oGameField.getYByRow(iRow);
            iX = s_oGameField.getXByCol(iCol);
        }
        return aSpriteBlock;
    };

    this.createCell = function (iX, iY, oSprite, iRow, iCol, iOffsetRegY) {
        var oCell = new CCell(iX, iY, iOffsetRegY, oSprite, _oParentContainer);
        oCell.setRow(iRow);
        oCell.setCol(iCol);
        return oCell;
    };

    this.orderCellsChildIndex = function () {
        var iID = _oParentContainer.numChildren - 1;
        for (var i = 0; i < _aSpriteBlock.length; i++) {
            _aSpriteBlock[i].setChildIndex(iID);
            iID--;
        }
    };

    this.updateRenderOffsets = function (oRenderOffsets) {
        var oOffset = oRenderOffsets;
        oOffset.x++;

        if (oOffset.x >= this.getWidth()) {
            oOffset.y++;
            oOffset.x = 0;
        }

        return oOffset;
    };
    
    this.pieceFilled = function (iStep) {
        var oCoord = this.stepToCooordinates(iStep);
        var iFilled = _aBlockType[oCoord.y][oCoord.x];
        return !!iFilled;
    };

    this.stepToCooordinates = function (step) {
        var oCoords = {x: 0, y: 0};

        oCoords.x = step % this.getWidth();
        oCoords.y = Math.floor(step / this.getWidth());

        return oCoords;
    };

    this.down = function () {
        s_oGameField.checkHitBottom(this, DOWN);

        if (_bReplace !== true) {
            _iRow += 1;
            this.refreshCellPosition();
        }
    };

    this.refreshCellPosition = function () {
        var iCol = _iCol;
        var iRow = _iRow;

        var iID = 0;
        var iX = s_oGameField.getXByCol(iCol);
        var iY = s_oGameField.getYByRow(iRow);

        for (var i = 0; i < _aBlockType.length; i++) {
            for (var j = 0; j < _aBlockType[i].length; j++) {
                if (_aBlockType[i][j] === 1) {
                    _aSpriteBlock[iID].setPosition(iX, iY);
                    _aSpriteBlock[iID].setRow(iRow);
                    _aSpriteBlock[iID].setCol(iCol);
                    _aSpriteBlock[iID].setChildIndex(s_oGameField.getChildID(iRow, iCol));
                    iID++;
                }
                iCol++;
                if (iCol < GRID_X) {
                    iX = s_oGameField.getXByCol(iCol);
                }
            }
            if (iRow + 1 > GRID_Y - 1) {
                break;
            }
            iRow++;
            iCol = _iCol;
            iY = s_oGameField.getYByRow(iRow);
            iX = s_oGameField.getXByCol(iCol);
        }
    };
    
    this.setReplace = function (bVal) {
        _bReplace = bVal;
    };

    this.getReplace = function () {
        return _bReplace;
    };

    this.getCol = function () {
        return _iCol;
    };

    this.getRow = function () {
        return _iRow;
    };

    this.getBlock = function () {
        return _aSpriteBlock;
    };

    this.setRow = function (iVal) {
        _iRow = iVal;
    };

    this.setCol = function (iVal) {
        _iCol = iVal;
    };

    this.__rotateBlock = function (aOriginalBlock) {
        var aRotateBlock = new Array;

        for (var j = aOriginalBlock[0].length - 1; j > -1; j--) {
            var aRow = new Array();
            for (var i = 0; i < aOriginalBlock.length; i++) {
                aRow.push(aOriginalBlock[i][j]);
            }
            aRotateBlock.push(aRow);
        }

        return aRotateBlock;
    };

    this.getOrientation = function () {
        return _iOrientation;
    };

    this.setOrientation = function (iVal) {
        if (iVal === 360) {
            iVal = 0;
        }
        var aRotateBlock = this.__rotateBlock(_aBlockType);

        var iResult = s_oGameField.badRotation(aRotateBlock, this);

        if (iResult === 1) {

        } else if (iResult === 0) {
            _iOrientation = iVal;
            _aBlockType = aRotateBlock;
        } else if (iResult === 2) {
            this.setOrientation(iVal);
        }
    };

    this.unload = function () {
        for (var i = 0; i < _aSpriteBlock.length; i++) {
            _aSpriteBlock[i].unload();
        }
        _aSpriteBlock = null;
    };

    this._init(oSprite);

    return this;
}