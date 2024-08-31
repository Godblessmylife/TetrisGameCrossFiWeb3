function CMenu() {

    var _oBg;
    var _oButPlay;
    var _oButContinue;
    var _oButCredits;
    var _oFade;
    var _oAudioToggle;
    var _oCreditsPanel;
    var _oLogo;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;

    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;

    this._init = function () {
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);

        var oSpriteLogo = s_oSpriteLibrary.getSprite("logo_menu");
        _oLogo = createBitmap(oSpriteLogo);
        _oLogo.x = CANVAS_WIDTH_HALF;
        _oLogo.y = -oSpriteLogo.width * 0.5;
        _oLogo.regX = oSpriteLogo.width * 0.5;
        _oLogo.regY = oSpriteLogo.height * 0.5;
        _oLogo.rotation = -15;

        s_oStage.addChild(_oLogo);

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            var oSprite = s_oSpriteLibrary.getSprite('icon_audio');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.width / 2) + 15, y: (oSprite.height / 2) + 30};
            _oAudioToggle = new CToggle(_pStartPosAudio.x, _pStartPosAudio.y, oSprite, s_bAudioActive,s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        var oSpritePlay = s_oSpriteLibrary.getSprite('but_play');
        _oButPlay = new CGfxButton(CANVAS_WIDTH / 2, 900, oSpritePlay);
        _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        _oButPlay.pulseAnimation();

        var oSprite = s_oSpriteLibrary.getSprite('but_info');
        _pStartPosCredits = {x: (oSprite.width / 2) + 30, y: (oSprite.height / 2) + 30};
        _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSprite);
        _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);

        //  MY CODE HERE
        // var oSpriteBackToTg = s_oSpriteLibrary.getSprite('but_not'); 
        // _pStartPosCredits = {x: (oSpriteBackToTg.width / 2) + 30, y: (oSpriteBackToTg.height / 2) + 200};
        // _oButCredits = new CGfxButton(_pStartPosCredits.x, _pStartPosCredits.y, oSpriteBackToTg);
        // // _oButCredits.addEventListener(ON_MOUSE_UP, this._onCredits, this);
        // _oButCredits.addEventListener(function(){
        //     var Telegram = window.Telegram.WebApp;
        //     Telegram.close();
        // })
        // 

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            oSprite = s_oSpriteLibrary.getSprite('but_fullscreen');
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};

            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP, this._onFullscreenRelease, this);
        }


        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        s_oStage.addChild(_oFade);

        createjs.Tween.get(_oLogo).wait(300).to({rotation: 0}, 1000, createjs.Ease.cubicOut);
        createjs.Tween.get(_oLogo).wait(300).to({y: CANVAS_HEIGHT_HALF - 100}, 1000, createjs.Ease.bounceOut)

        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            s_oStage.removeChild(_oFade);
        });

        this.refreshButtonPos(s_iOffsetX, s_iOffsetY);
    };

    this.unload = function () {
        _oButPlay.unload();
        _oButPlay = null;

        _oButCredits.unload();
        _oButCredits = null;

        if (_oButContinue) {
            _oButContinue.unload();
            _oButContinue = null;
        }

        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.unload();
        }
        s_oStage.removeChild(_oBg);
        _oBg = null;

        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        s_oStage.removeAllChildren();

        s_oMenu = null;
    };

    this.exitFromCredits = function () {
        _oCreditsPanel = null;
    };

    this.refreshButtonPos = function (iNewX, iNewY) {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            _oAudioToggle.setPosition(_pStartPosAudio.x - s_iOffsetX, _pStartPosAudio.y + s_iOffsetY);
        }
        
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setPosition(_pStartPosFullscreen.x + s_iOffsetX,_pStartPosFullscreen.y + s_iOffsetY);
        }
        
        _oButCredits.setPosition(_pStartPosCredits.x + s_iOffsetX, _pStartPosCredits.y + s_iOffsetY);
    };

    this._onAudioToggle = function () {
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };

    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.enabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
        
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
    
    this._onCredits = function () {
        _oCreditsPanel = new CCreditsPanel();
    };

    this._onButPlayRelease = function () {
        this.unload();
        
        s_oMain.gotoGame();

    };

    s_oMenu = this;

    this._init();
}

var s_oMenu = null;