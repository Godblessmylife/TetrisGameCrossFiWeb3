function CScoreBoard(iX, iY, oSprite, oParentContainer) {
    var _oBg;
    var _oTextScore;
    var _oTextScoreStoke;
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

        _oTextScoreStoke = new createjs.Text(TEXT_SCORE + "\n0", "36px " + PRIMARY_FONT, "#025cce");
        _oTextScoreStoke.x = 0;
        _oTextScoreStoke.y = -26;
        _oTextScoreStoke.textAlign = "center";
        _oTextScoreStoke.textBaseline = "middle";
        _oTextScoreStoke.outline = 4;
        _oTextScoreStoke.lineHeight = 50;
        _oContainer.addChild(_oTextScoreStoke);

        _oTextScore = new createjs.Text(TEXT_SCORE + "\n0", "36px " + PRIMARY_FONT, "#ffd800");
        _oTextScore.x = 0;
        _oTextScore.y = -26;
        _oTextScore.textAlign = "center";
        _oTextScore.textBaseline = "middle";
        _oTextScore.lineHeight = 50;
        _oContainer.addChild(_oTextScore);

    };

    this.refreshScore = function (iScore) {
        _oTextScore.text = TEXT_SCORE + "\n" + iScore;
        _oTextScoreStoke.text = TEXT_SCORE + "\n" + iScore;
        // console.log(iScore);
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




