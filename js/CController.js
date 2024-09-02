function CController() {

    var _pStartPosControlRight;
    var _pStartPosControlLeft;
    var _pStartPosControlUp;
    var _pStartPosControlDown;
    var _oControlLeft;
    var _oControlRight;
    var _oControlUp;
    var _oControlDown;


    this._init = function () {
        _pStartPosControlRight = {x: CANVAS_WIDTH * 0.5 - 190, y: CANVAS_HEIGHT - 80};
        _pStartPosControlLeft = {x: CANVAS_WIDTH * 0.5 - 380, y: CANVAS_HEIGHT - 80};
        _pStartPosControlUp = {x: CANVAS_WIDTH * 0.5 + 135, y: CANVAS_HEIGHT - 80};
        _pStartPosControlDown = {x: CANVAS_WIDTH * 0.5 + 260, y: CANVAS_HEIGHT - 80};

        var oSpriteArrow = s_oSpriteLibrary.getSprite("arrow");
        var oSpriteRotation=s_oSpriteLibrary.getSprite("but_rotation");

        _oControlLeft = new CGfxButton(_pStartPosControlLeft.x, _pStartPosControlLeft.y, oSpriteArrow, s_oStage);
        _oControlLeft.addEventListener(ON_MOUSE_DOWN, s_oGame.onLeft, this);
        _oControlLeft.addEventListener(ON_MOUSE_UP, s_oGame.dirKeyUp, this);
        _oControlLeft.setScaleX(-1);

        _oControlRight = new CGfxButton(_pStartPosControlRight.x, _pStartPosControlRight.y, oSpriteArrow, s_oStage);
        _oControlRight.addEventListener(ON_MOUSE_DOWN, s_oGame.onRight, this);
        _oControlRight.addEventListener(ON_MOUSE_UP, s_oGame.dirKeyUp, this);

        _oControlUp = new CGfxButton(_pStartPosControlUp.x, _pStartPosControlUp.y, oSpriteRotation, s_oStage);
        _oControlUp.addEventListener(ON_MOUSE_DOWN, s_oGame.onUp, this);
		
        _oControlDown = new CGfxButton(_pStartPosControlDown.x, _pStartPosControlDown.y, oSpriteArrow, s_oStage);
        _oControlDown.addEventListener(ON_MOUSE_DOWN, s_oGame.onDown, this);
        _oControlDown.addEventListener(ON_MOUSE_UP, s_oGame.onDownKeyUp, this);
		_oControlDown.rotation(90);
    };

    this.getStartPositionControlRight = function () {
        return _pStartPosControlRight;
    };

    this.getStartPositionControlLeft = function () {
        return _pStartPosControlLeft;
    };

    this.getStartPositionControlUp = function () {
        return _pStartPosControlUp;
    };

    this.getStartPositionControlDown = function () {
        return _pStartPosControlDown;
    };

    this.setPositionControlRight = function (iX, iY) {
        _oControlRight.setPosition(iX, iY);
    };

    this.setPositionControlLeft = function (iX, iY) {
        _oControlLeft.setPosition(iX, iY);
    };

    this.setPositionControlUp = function (iX, iY) {
        _oControlUp.setPosition(iX, iY);
    };

    this.setPositionControlDown = function (iX, iY) {
        _oControlDown.setPosition(iX, iY);
    };

    this.unload = function () {
        _oControlLeft.unload();
        _oControlLeft = null;

        _oControlRight.unload();
        _oControlRight = null;

        _oControlUp.unload();
        _oControlUp = null;

        _oControlDown.unload();
        _oControlDown = null;
    };

    this._init();

    return this;
}