function CHelpPanel(iXPos, iYPos, oSprite) {
    var _oTitle;
    var _oTitleStroke;

    var _oHelpBg;
    var _oFade;
    var _oGroup;

    var _oContainerAnim;
    var _bClick = false;
    var _oListener;

    this._init = function (iXPos, iYPos, oSprite) {
        _oGroup = new createjs.Container();
        _oGroup.x = iXPos;
        _oGroup.y = iYPos;
        s_oStage.addChild(_oGroup);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;

        _oGroup.addChild(_oFade);

        _oHelpBg = createBitmap(oSprite);
        _oHelpBg.x = CANVAS_WIDTH_HALF;
        _oHelpBg.y = CANVAS_HEIGHT_HALF;
        _oHelpBg.regX = oSprite.width * 0.5;
        _oHelpBg.regY = oSprite.height * 0.5;

        _oGroup.addChild(_oHelpBg);

        _oTitleStroke = new createjs.Text(TEXT_HOW_TO_PLAY, "50px " + PRIMARY_FONT, "#0025c2");
        _oTitleStroke.textAlign = "center";
        _oTitleStroke.lineWidth = 500;
        _oTitleStroke.x = CANVAS_WIDTH * 0.5;
        _oTitleStroke.y = CANVAS_HEIGHT * 0.5 - 210;
        _oTitleStroke.outline = 4;
        _oGroup.addChild(_oTitleStroke);

        _oTitle = new createjs.Text(TEXT_HOW_TO_PLAY, "50px " + PRIMARY_FONT, "#ffd800");
        _oTitle.textAlign = "center";
        _oTitle.lineWidth = 500;
        _oTitle.x = CANVAS_WIDTH * 0.5;
        _oTitle.y = CANVAS_HEIGHT * 0.5 - 210;
        _oGroup.addChild(_oTitle);

        _oContainerAnim = new createjs.Container();

        var oSpriteKeyLeft;
        var oSpriteKeyUp;
        var oSpriteKeyRight;
        var oSpriteKeyDown;

        if (!s_bMobile) {
            oSpriteKeyLeft = s_oSpriteLibrary.getSprite("key_left");
            oSpriteKeyUp = s_oSpriteLibrary.getSprite("key_up");
            oSpriteKeyRight = s_oSpriteLibrary.getSprite("key_right");
            oSpriteKeyDown = s_oSpriteLibrary.getSprite("key_down");
        } else {
            oSpriteKeyLeft = s_oSpriteLibrary.getSprite("arrow");
            oSpriteKeyUp = s_oSpriteLibrary.getSprite("arrow");
            oSpriteKeyRight = s_oSpriteLibrary.getSprite("arrow");
            oSpriteKeyDown = s_oSpriteLibrary.getSprite("but_rotation");
        }

        var oBlockBlur = this.createKey(CANVAS_WIDTH_HALF, CANVAS_HEIGHT_HALF - 100, s_oSpriteLibrary.getSprite("block_blur"));
        var oBlockDown = this.createKey(CANVAS_WIDTH_HALF - 125, CANVAS_HEIGHT_HALF + 30, s_oSpriteLibrary.getSprite("block_down"));
        var oBlockRotation = this.createKey(CANVAS_WIDTH_HALF + 125, CANVAS_HEIGHT_HALF + 30, s_oSpriteLibrary.getSprite("block_rotation"));

        var oKeyLeft = this.createKey(CANVAS_WIDTH_HALF - 135, CANVAS_HEIGHT_HALF - 90, oSpriteKeyLeft);

        var oKeyUp = this.createKey(CANVAS_WIDTH_HALF + 125, CANVAS_HEIGHT_HALF + 170, oSpriteKeyUp);

        var oKeyRight = this.createKey(CANVAS_WIDTH_HALF + 135, CANVAS_HEIGHT_HALF - 90, oSpriteKeyRight);

        var oKeyDown = this.createKey(CANVAS_WIDTH_HALF - 125, CANVAS_HEIGHT_HALF + 170, oSpriteKeyDown);


        if (s_bMobile) {
            oKeyLeft.scaleX = -1;
            oKeyUp.rotation = 270;
        }

        _oContainerAnim.addChild(oKeyLeft, oKeyUp, oKeyRight, oKeyDown, oBlockBlur, oBlockDown, oBlockRotation);

        _oGroup.addChild(_oContainerAnim);

        if(!s_bMobile){
            _oGroup.cursor="pointer";
        }
        
        var oParent = this;
        _oListener = _oGroup.on("pressup", function () {
            oParent._onExitHelp();
        });
    };

    this.createKey = function (iX, iY, oSprite) {
        var oKey;
        oKey = createBitmap(oSprite);
        oKey.x = iX;
        oKey.y = iY;
        oKey.regX = oSprite.width * 0.5;
        oKey.regY = oSprite.height * 0.5;

        return oKey;
    };

    this.unload = function () {
        createjs.Tween.removeAllTweens();
        createjs.Tween.get(_oGroup).to({alpha: 0}, 500, createjs.Ease.cubicIn).call(function () {
            s_oStage.removeChild(_oGroup);
        });
        var oParent = this;
        _oGroup.off("pressup", _oListener);
    };

    this._onExitHelp = function () {
        if (_bClick) {
            return;
        }
        _bClick = true;
        this.unload();
        s_oGame._onExitHelpPanel();
    };

    this._init(iXPos, iYPos, oSprite);

    return this;
}