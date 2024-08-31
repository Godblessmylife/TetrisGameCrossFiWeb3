function CInfoBoard(iX, iY, oSprite, oParentContainer) {
    var _oBg;
    var _oTextLevel;
    var _oTextLevelStoke;
    var _oTextLine;
    var _oTextLineStroke;
    var _oContainer;
    var _pStartPos;

    var _oParentContainer = oParentContainer;

    this._init = function (iX, iY, oSprite) {

        _pStartPos = {x: iX, y: iY};
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;

        _oParentContainer.addChild(_oContainer);

        _oBg = createBitmap(oSprite);
        _oBg.regX = oSprite.width * 0.5;
        _oBg.regY = oSprite.height * 0.5;
        _oContainer.addChild(_oBg);

        _oTextLevelStoke = new createjs.Text(TEXT_LEVEL + "\n0", "33px " + PRIMARY_FONT, "#025cce");
        // console.log(_oTextLevelStoke)
        _oTextLevelStoke.x = 5;
        _oTextLevelStoke.y = -_oBg.regY * 0.5 - 8;
        _oTextLevelStoke.textAlign = "center";
        _oTextLevelStoke.textBaseline = "middle";
        _oTextLevelStoke.outline = 4;
        _oTextLevelStoke.lineHeight = 50;
        _oContainer.addChild(_oTextLevelStoke);

        _oTextLevel = new createjs.Text(TEXT_LEVEL + "\n0", "33px " + PRIMARY_FONT, "#ffd800");
        _oTextLevel.x = 5;
        _oTextLevel.y = -_oBg.regY * 0.5 - 8;
        _oTextLevel.textAlign = "center";
        _oTextLevel.textBaseline = "middle";
        _oTextLevel.lineHeight = 50;
        _oContainer.addChild(_oTextLevel);

        _oTextLineStroke = new createjs.Text(TEXT_LINES + "\n0", "33px " + PRIMARY_FONT, "#025cce");
        _oTextLineStroke.x = 5;
        _oTextLineStroke.y = _oBg.regY * 0.5 - 39;
        _oTextLineStroke.textAlign = "center";
        _oTextLineStroke.textBaseline = "middle";
        _oTextLineStroke.outline = 4;
        _oTextLineStroke.lineHeight = 50;
        _oContainer.addChild(_oTextLineStroke);

        _oTextLine = new createjs.Text(TEXT_LINES + "\n0", "33px " + PRIMARY_FONT, "#ffd800");
        _oTextLine.x = 5;
        _oTextLine.y = _oBg.regY * 0.5 - 39;
        _oTextLine.textAlign = "center";
        _oTextLine.textBaseline = "middle";
        _oTextLine.lineHeight = 50;
        _oContainer.addChild(_oTextLine);

    };

    this.refreshLevel = function (iLevel) {
        _oTextLevel.text = TEXT_LEVEL + "\n" + iLevel;
        _oTextLevelStoke.text = TEXT_LEVEL + "\n" + iLevel;
    };

    this.refreshLines = function (iLines) {
        _oTextLineStroke.text = TEXT_LINES + "\n" + iLines;
        _oTextLine.text = TEXT_LINES + "\n" + iLines;
    };

    this.getStartPos = function () {
        return _pStartPos;
    };

    this.setPosition = function (iX, iY) {
        _oContainer.x = iX;
        _oContainer.y = iY;
    };

    this._init(iX, iY, oSprite);

    return this;
}


