function CAreYouSurePanel(oParentContainer) {
    var _oMsgStroke;
    var _oMsg;
    var _oButYes;
    var _oButNo;
    var _oBg;
    var _oContainer;
    var _oFade;
    var _oParentContainer;
    var _oListener;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oParentContainer.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0.7;

        _oListener = _oFade.on("click", function () {});

        _oContainer.addChild(_oFade);

        var oMsgBox = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oMsgBox);
        _oBg.x = CANVAS_WIDTH_HALF;
        _oBg.y = CANVAS_HEIGHT_HALF
        _oBg.regX = oMsgBox.width * 0.5;
        _oBg.regY = oMsgBox.height * 0.5;
        _oContainer.addChild(_oBg);

        _oBg.on("click", function () {});

        _oMsgStroke = new createjs.Text(TEXT_ARE_SURE, "60px " + PRIMARY_FONT, "#0025c2");
        _oMsgStroke.x = CANVAS_WIDTH / 2;
        _oMsgStroke.y = CANVAS_HEIGHT * 0.5-100;
        _oMsgStroke.textAlign = "center";
        _oMsgStroke.textBaseline = "middle";
        _oMsgStroke.outline = 5;
        _oContainer.addChild(_oMsgStroke);

        _oMsg = new createjs.Text(_oMsgStroke.text, "60px " + PRIMARY_FONT, "#ffd800");
        _oMsg.x = _oMsgStroke.x;
        _oMsg.y = _oMsgStroke.y;
        _oMsg.textAlign = "center";
        _oMsg.textBaseline = "middle";
        _oContainer.addChild(_oMsg);

        _oButYes = new CGfxButton(CANVAS_WIDTH / 2 + 170, _oMsgStroke.y + 200, s_oSpriteLibrary.getSprite('but_yes'), _oContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(CANVAS_WIDTH / 2 - 170, _oMsgStroke.y + 200, s_oSpriteLibrary.getSprite('but_not'), _oContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
    };

    this.onPause = function (bVal) {
        s_oGame.setPause(bVal);
        createjs.Ticker.paused = bVal;
        if (bVal === true) {
            s_oGame.canInput(false);
        } else {
            s_oGame.canInput(true);
        }
    };

    this.show = function () {
        this.onPause(true);
        _oContainer.visible = true;
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();
        _oFade.off("click", _oListener);
    };

    this._onButYes = function () {
        this.unload();
        this.onPause(false);

        s_oGame.onExit();
    };

    this._onButNo = function () {
        this.unload();
        this.onPause(false);
        
        _oContainer.visible = false;
    };

    _oParentContainer = oParentContainer;

    this._init();
}