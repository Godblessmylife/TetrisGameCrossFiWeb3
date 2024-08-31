function CPause() {

    var _oContainer;
    var _oFade;
    var _oLogo;
    var _oListener;

    this._init = function () {
        _oContainer = new createjs.Container();
        _oContainer.alpha = 0;


        _oFade = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        _oFade.alpha = 1;

        _oListener = _oFade.on("click", function () {});

        _oContainer.addChild(_oFade);

        var oSpriteLogo = s_oSpriteLibrary.getSprite("pause_text");
        _oLogo = createBitmap(oSpriteLogo);
        _oLogo.x = CANVAS_WIDTH_HALF;
        _oLogo.y = CANVAS_HEIGHT_HALF - 200;
        _oLogo.regX = oSpriteLogo.width * 0.5;
        _oLogo.regY = oSpriteLogo.height * 0.5;

        _oContainer.addChild(_oLogo);


        var oSpriteContinue = s_oSpriteLibrary.getSprite("but_continue");
        var oButContinue;
        oButContinue = new CGfxButton(CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 100, oSpriteContinue, _oContainer);
        oButContinue.addEventListener(ON_MOUSE_UP, this._onLeavePause, this);

        s_oStage.addChild(_oContainer);

        this.onPause(true);

        createjs.Tween.get(_oContainer).to({alpha: 1}, 300, createjs.quartOut).call(function () {
            createjs.Ticker.paused = true;
        });

    };

    this.onPause = function (bVal) {
        s_oGame.setPause(bVal);
        s_oGame.canInput(!bVal);
    };

    this.unload = function () {
        _oFade.off("click", _oListener);
        s_oStage.removeChild(_oContainer);
    };

    this._onLeavePause = function () {
        createjs.Ticker.paused = false;
        createjs.Tween.removeTweens(_oContainer);
        var oParent = this;
        createjs.Tween.get(_oContainer).to({alpha: 0}, 300, createjs.quartIn).call(function () {
            oParent.onPause(false);
            s_oInterface.unloadPause();
        });
    };

    this._init();

    return this;
}