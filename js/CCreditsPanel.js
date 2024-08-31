function CCreditsPanel() {

    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText;
    var _oMsgTextOutline;

    var _oHitArea;

    var _oLink;
    var _oLinkOutline;

    var _pStartPosExit;

    var _oContainer;
    var _oListener;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oContainer.y = -130;
        s_oStage.addChild(_oContainer);

        var oFade = new createjs.Shape();
        oFade.graphics.beginFill("black").drawRect(0, 130, CANVAS_WIDTH, CANVAS_HEIGHT);
        oFade.alpha = 0.7;

        _oContainer.addChild(oFade);

        var oSpriteBg = s_oSpriteLibrary.getSprite('msg_box');

        _oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(_oBg);
        _oBg.x = CANVAS_WIDTH * 0.5;
        _oBg.y = CANVAS_HEIGHT * 0.5 + 130;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#0f0f0f").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHitArea.alpha = 0.01;
        _oListener = _oHitArea.on("click", this._onLogoButRelease);
        if (!s_bMobile) {
            _oHitArea.cursor = "pointer";
        }
        _oContainer.addChild(_oHitArea);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: 800, y: 640};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, _oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

        _oMsgTextOutline = new createjs.Text(TEXT_CREDITS_DEVELOPED, "40px " + PRIMARY_FONT, "#025cce");
        _oMsgTextOutline.textAlign = "center";
        _oMsgTextOutline.textBaseline = "alphabetic";
        _oMsgTextOutline.x = CANVAS_WIDTH / 2;
        _oMsgTextOutline.y = 770;
        _oMsgTextOutline.outline = OUTLINE_TEXT;
        _oContainer.addChild(_oMsgTextOutline);

        _oMsgText = new createjs.Text(TEXT_CREDITS_DEVELOPED, "40px " + PRIMARY_FONT, "#ffd800");
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.x = CANVAS_WIDTH / 2;
        _oMsgText.y = _oMsgTextOutline.y;
        _oContainer.addChild(_oMsgText);

        oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = createBitmap(oSprite);
        _oButLogo.regX = oSprite.width / 2;
        _oButLogo.regY = oSprite.height / 2;
        _oButLogo.x = CANVAS_WIDTH / 2;
        _oButLogo.y = 850;
        _oContainer.addChild(_oButLogo);

        _oLinkOutline = new createjs.Text(TEXT_LINK1, "40px " + PRIMARY_FONT, "#025cce");
        _oLinkOutline.textAlign = "center";
        _oLinkOutline.textBaseline = "alphabetic";
        _oLinkOutline.x = CANVAS_WIDTH / 2;
        _oLinkOutline.y = 980;
        _oLinkOutline.outline = OUTLINE_TEXT;
        _oContainer.addChild(_oLinkOutline);

        _oLink = new createjs.Text(TEXT_LINK1, "40px " + PRIMARY_FONT, "#ffd800");
        _oLink.textAlign = "center";
        _oLink.textBaseline = "alphabetic";
        _oLink.x = CANVAS_WIDTH / 2;
        _oLink.y = _oLinkOutline.y;
        _oContainer.addChild(_oLink);


        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.refreshButtonPos = function (iNewX, iNewY) {

    };

    this.unload = function () {
        _oHitArea.off("click", _oListener);

        _oButExit.unload();
        _oButExit = null;

        s_oStage.removeChild(_oContainer);

        s_oMenu.exitFromCredits();
    };

    this._onLogoButRelease = function () {
        window.open("https://crossfi.org/", "_blank");
    };

    this._init();


}
;


