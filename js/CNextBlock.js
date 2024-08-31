function CNextBlock(aBlock, oSprite, oParentContainer) {
    var _oParentContainer = oParentContainer;
    var _aSpriteBlock;
    var _iOffsetX;
    var _iOffsetY;

    this._init = function (aBlock, oSprite) {
        _iOffsetX = 0;
        _aSpriteBlock = this.createSpriteBlock(aBlock, oSprite);
        this.orderCellsChildIndex();
    };

    this.createSpriteBlock = function (aBlock, oSprite) {
        var aSpriteBlock = new Array();

        var iX = 0;
        var iY = 0;
        for (var i = 0; i < aBlock.length; i++) {
            for (var j = 0; j < aBlock[i].length; j++) {
                if (aBlock[i][j] === 1) {
                    aSpriteBlock.push(this.createCell(iX, iY, oSprite, 0));
                }
                iX += CELL_SIZE + CELL_OFFSET.x;
            }
            iY += CELL_SIZE + CELL_OFFSET.y;
            iX = 0;
        }
        _iOffsetX = ((CELL_SIZE + CELL_OFFSET.y) * 0.5) * aBlock[0].length;
        _iOffsetY = ((CELL_SIZE + CELL_OFFSET.x) * 0.5) * aBlock.length;

        return aSpriteBlock;
    };


    this.createCell = function (iX, iY, oSprite, iRegY) {
        var oCell = new CCell(iX, iY, iRegY, oSprite, _oParentContainer);
        oCell.setPosition(iX, iY);
        return oCell;
    };

    this.orderCellsChildIndex = function () {
        var iID = _oParentContainer.numChildren - 1;
        for (var i = 0; i < _aSpriteBlock.length; i++) {
            _aSpriteBlock[i].setChildIndex(iID);
            iID--;
        }
    };

    this.getOffsetX = function () {
        return _iOffsetX;
    };

    this.getOffsetY = function () {
        return _iOffsetY;
    };

    this.unload = function () {
        for (var i = 0; i < _aSpriteBlock.length; i++) {
            _aSpriteBlock[i].unload();
        }
        _aSpriteBlock = null;
    };

    this._init(aBlock, oSprite);

    return this;
}