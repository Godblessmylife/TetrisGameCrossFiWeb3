function CCell(iX, iY, iRegY, oSprite, oParentContainer) {
    var _oCell;
    var _iRow;
    var _iCol;
    var _oParentContainer = oParentContainer;

    this._init = function (iX, iY, iRegY, oSprite) {
        _oCell = createBitmap(oSprite);
        _oCell.x = iX;
        _oCell.y = iY;


        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: oSprite.width / 2, height: oSprite.height, regX: (oSprite.width / 2) / 2, regY: (oSprite.height / 2) + iRegY},
            animations: {normal: [0], complete: [1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oCell = createSprite(oSpriteSheet, "normal", (oSprite.width / 2) / 2, (oSprite.height / 2) + iRegY, oSprite.width / 2, oSprite.height);
        _oCell.stop();

        _oParentContainer.addChild(_oCell);
    };

    this.setPosition = function (iX, iY) {
        _oCell.x = iX;
        _oCell.y = iY;
    };

    this.getY = function () {
        return _oCell.y;
    };

    this.getX = function () {
        return _oCell.x;
    };

    this.setRow = function (iVal) {
        _iRow = iVal;
    };

    this.setCol = function (iVal) {
        _iCol = iVal;
    };

    this.getRow = function () {
        return _iRow;
    };

    this.getCol = function () {
        return _iCol;
    };

    this.setRegY = function (iVal) {
        _oCell.regY = iVal;
    };

    this.changeState = function (iVal) {
        _oCell.gotoAndStop(iVal);
    };

    this.getSprite = function () {
        return _oCell;
    };

    this.getRegY = function () {
        return _oCell.regY;
    };

    this.setVisible = function (bVal) {
        _oCell.visible = bVal;
    };

    this.getChildIndex = function () {
        return _oParentContainer.getChildIndex(_oCell);
    };

    this.setChildIndex = function (iVal) {
        _oParentContainer.setChildIndex(_oCell, iVal);
    };

    this.unload = function () {
        _oParentContainer.removeChild(_oCell);
    };

    this._init(iX, iY, iRegY, oSprite);

    return this;
}