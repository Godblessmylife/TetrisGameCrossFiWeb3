
function CGameOver(oSpriteBg, iScore, iLevel, iLines) {

    var _oGroup;
    var _oGroupMsgBox;
    var _oBg;
    var _oFade;
    var _oButMenu;
    var _oButRestart;
    var _oListener;

    this._init = function (oSpriteBg, iScore, iLevel, iLines) {

        let tg = window.Telegram.WebApp; 
        
        const url='https://crossfigod.io/datafromgame';
        const data_to_tg = {
            "score": iScore,
            "from_tg": tg.initDataUnsafe
        };
        
        const otherParam = {
            headers: {
                "content-type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify(data_to_tg),
                method: "POST",
        };

        fetch(url, otherParam)
            .then(data => data.json())
            .then(response => response)
            .catch(error => error);
    


        s_oGame.setPause(true);

        _oGroup = new createjs.Container();

        _oGroupMsgBox = new createjs.Container();
        _oGroupMsgBox.y = -CANVAS_WIDTH_HALF - oSpriteBg.width * 0.5;

        _oBg = createBitmap(oSpriteBg);

        _oBg.x = CANVAS_WIDTH * 0.5;
        _oBg.y = CANVAS_HEIGHT * 0.5;
        _oBg.regX = oSpriteBg.width * 0.5;
        _oBg.regY = oSpriteBg.height * 0.5;

        _oGroupMsgBox.addChild(_oBg);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oFade.alpha = 0;

        _oListener = _oFade.on("click", function () {});

        _oGroup.addChild(_oFade);

        var pGameOverPos = {x: CANVAS_WIDTH * 0.5, y: CANVAS_HEIGHT * 0.5 - 75};
        var iSizeFont = 40;
        var iSizeFontGameOver = 60;

        var oTextLevel;
        var oTextLevelStruct;
        var oTextLines;
        var oTextLinesStruct;
        var oTextGameOverScore;
        var oTextGameOverScoreStruct;
        var oTextTitle;
        var oTextTitleStruct;

        oTextTitleStruct = new createjs.Text(TEXT_GAMEOVER, iSizeFontGameOver + "px " + PRIMARY_FONT, "#025cce");
        oTextTitleStruct.textAlign = "center";
        oTextTitleStruct.textBaseline = "alphabetic";
        oTextTitleStruct.x = pGameOverPos.x;
        oTextTitleStruct.y = pGameOverPos.y - 50;
        oTextTitleStruct.outline = OUTLINE_TEXT;

        _oGroupMsgBox.addChild(oTextTitleStruct);

        oTextTitle = new createjs.Text(TEXT_GAMEOVER, iSizeFontGameOver + "px " + PRIMARY_FONT, "#ffd800");
        oTextTitle.textAlign = "center";
        oTextTitle.textBaseline = "alphabetic";
        oTextTitle.x = pGameOverPos.x;
        oTextTitle.y = oTextTitleStruct.y;

        _oGroupMsgBox.addChild(oTextTitle);

        oTextLevelStruct = new createjs.Text(TEXT_LEVEL + "\n" + iLevel, iSizeFont + "px " + PRIMARY_FONT, "#025cce");
        oTextLevelStruct.textAlign = "center";
        oTextLevelStruct.textBaseline = "alphabetic";
        oTextLevelStruct.x = pGameOverPos.x - 150;
        oTextLevelStruct.y = pGameOverPos.y + 25;
        oTextLevelStruct.lineHeight = 50;
        oTextLevelStruct.outline = OUTLINE_TEXT;

        _oGroupMsgBox.addChild(oTextLevelStruct);

        oTextLevel = new createjs.Text(oTextLevelStruct.text, iSizeFont + "px " + PRIMARY_FONT, "#ffd800");
        oTextLevel.textAlign = "center";
        oTextLevel.textBaseline = "alphabetic";
        oTextLevel.x = pGameOverPos.x - 150;
        oTextLevel.y = oTextLevelStruct.y;
        oTextLevel.lineHeight = 50;
        _oGroupMsgBox.addChild(oTextLevel);

        oTextLinesStruct = new createjs.Text(TEXT_LINES + "\n" + iLines, iSizeFont + "px " + PRIMARY_FONT, "#025cce");
        oTextLinesStruct.textAlign = "center";
        oTextLinesStruct.textBaseline = "alphabetic";
        oTextLinesStruct.x = pGameOverPos.x + 150;
        oTextLinesStruct.y = pGameOverPos.y + 25;
        oTextLinesStruct.lineHeight = 50;
        oTextLinesStruct.outline = OUTLINE_TEXT;

        _oGroupMsgBox.addChild(oTextLinesStruct);

        oTextLines = new createjs.Text(oTextLinesStruct.text, iSizeFont + "px " + PRIMARY_FONT, "#ffd800");
        oTextLines.textAlign = "center";
        oTextLines.textBaseline = "alphabetic";
        oTextLines.x = pGameOverPos.x + 150;
        oTextLines.y = oTextLevelStruct.y;
        oTextLines.lineHeight = 50;
        _oGroupMsgBox.addChild(oTextLines);

        oTextGameOverScoreStruct = new createjs.Text(TEXT_SCORE_GAMEOVER + "\n\n" + iScore, iSizeFont + "px " + PRIMARY_FONT, "#025cce");
        oTextGameOverScoreStruct.textAlign = "center";
        oTextGameOverScoreStruct.textBaseline = "alphabetic";
        oTextGameOverScoreStruct.x = pGameOverPos.x;
        oTextGameOverScoreStruct.y = pGameOverPos.y + 150;
        oTextGameOverScoreStruct.outline = 4;

        _oGroupMsgBox.addChild(oTextGameOverScoreStruct);

        oTextGameOverScore = new createjs.Text(oTextGameOverScoreStruct.text, iSizeFont + "px " + PRIMARY_FONT, "#ffd800");
        oTextGameOverScore.textAlign = "center";
        oTextGameOverScore.textBaseline = "alphabetic";
        oTextGameOverScore.x = pGameOverPos.x;
        oTextGameOverScore.y = oTextGameOverScoreStruct.y;

        _oGroupMsgBox.addChild(oTextGameOverScore);

        _oGroup.addChild(_oGroupMsgBox);

        _oGroup.x = 0;
        _oGroup.y = 0;

        s_oStage.addChild(_oGroup);

        var oSpriteRestart = s_oSpriteLibrary.getSprite("but_restart");
        var oSpriteHome = s_oSpriteLibrary.getSprite("but_home");
        _oButMenu = new CGfxButton((CANVAS_WIDTH / 2 - 250), CANVAS_HEIGHT / 2 + 150, oSpriteHome, _oGroupMsgBox);
        _oButMenu.addEventListener(ON_MOUSE_UP, this._onMenu, this);
        _oButRestart = new CGfxButton((CANVAS_WIDTH / 2 + 250), CANVAS_HEIGHT / 2 + 150, oSpriteRestart, _oGroupMsgBox);
        _oButRestart.addEventListener(ON_MOUSE_UP, this._onRestart, this);
        _oButRestart.pulseAnimation();

        createjs.Tween.get(_oFade).to({alpha: 0.5}, 750, createjs.Ease.cubicOut);

        createjs.Tween.get(_oGroupMsgBox).to({y: 0}, 1500, createjs.Ease.bounceOut).call(function () {
            if (s_iAdsLevel === NUM_LEVEL_FOR_ADS) {
                $(s_oMain).trigger("show_interlevel_ad");
                s_iAdsLevel = 1;
            } else {
                s_iAdsLevel++;
            }
        });

        $(s_oMain).trigger("save_score", iScore);
        $(s_oMain).trigger("share_event", iScore);
    };

    this.unload = function () {
        _oFade.off("click", _oListener);

        if (_oButMenu) {
            _oButMenu.unload();
            _oButMenu = null;
        }

        s_oStage.removeChild(_oGroup);
    };

    this._onMenu = function () {
        this.unload();
        s_oInterface._onButMenuRelease();
    };

    this._onRestart = function () {
        this.unload();
        s_oInterface._onButRestartLevelRelease();
    };

    this._init(oSpriteBg, iScore, iLevel, iLines);

    return this;
}
