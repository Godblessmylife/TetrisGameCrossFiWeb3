function CGame(oData) {

    var _oBgLevel;
    var _oInterface;
    var _oGameField;
    var _oBlock;
    var _oContainerGame;
    var _oDirFunc;
    var _oEdges;
    var _iScore;
    var _iNextType;
    var _iLevel;
    var _iLines;
    var _iLevelLines;
    var _bPressedKeys;
    var _bPause;
    var _bInput;
    var _bKeyDown = false;
    var _bKeyDir = false;
    var _fTimeRefresh;
    var _fMaxTimeRefresh;
    var _fTimeRefreshDirection;
    var _aSpawnBlocksOccurence;

    this._init = function () {
        setVolume("soundtrack", 0.4);
        this.setPause(true);

        _oBgLevel = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(_oBgLevel);

        _oEdges = new CEdges();

        this.createGameContainer();

        _bPressedKeys = false;

        _oGameField = new CGameField();

        _iScore = 0;

        _iLevel = 0;

        _iLines = 0;
        _iLevelLines = 0;

        _fMaxTimeRefresh = TIME_REFRESH_GAME;

        _fTimeRefresh = _fMaxTimeRefresh;

        _aSpawnBlocksOccurence = new Array();

        for (var i = 0; i < BLOCKS_TYPE.length; i++) {
            for (var j = 0; j < BLOCKS_OCCURENCE[i]; i++) {
                _aSpawnBlocksOccurence.push(i);
            }
        }

        var iRandType = Math.floor(Math.random() * _aSpawnBlocksOccurence.length);
        this.createBlock(_aSpawnBlocksOccurence[iRandType]);

        this.nextType();

        _oInterface = new CInterface(_iNextType);
        _oInterface.refreshLevel(_iLevel + 1);

        this.canInput(true);

        _oEdges.createIEdge();

        $(s_oMain).trigger("start_level", 1);

        _oInterface.showHelpPanel();

        if (!s_bMobile) {
            document.onkeydown = onKeyDown;
            document.onkeyup = onKeyUp;
        } else {

        }
    };

    this.createGameContainer = function () {
        _oContainerGame = new createjs.Container();
        s_oStage.addChild(_oContainerGame);
    };

    this.nextType = function () {
        var iRandType = Math.floor(Math.random() * _aSpawnBlocksOccurence.length);
        _iNextType = _aSpawnBlocksOccurence[iRandType];
    };

    this.setPause = function (bVal) {
        _bPause = bVal;
    };

    this._onExitHelpPanel = function () {
        this.setPause(false);
        _oInterface.unloadHelp();
    };

    this.onExit = function () {
        setVolume("soundtrack", 1);
        s_oGame.unload();
        s_oMain.gotoMenu();
        $(s_oMain).trigger("end_level", 1);
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
    };

    this.restartGame = function () {
        _oGameField.unload();
        _oGameField = null;
        _oContainerGame.removeAllChildren();
        _oBlock = null;
        _bKeyDir = false;
        this.nextType();
        _oInterface.refreshNextBlock(_iNextType);
        _oGameField = new CGameField();
        var iRandType = Math.floor(Math.random() * _aSpawnBlocksOccurence.length);
        this.createBlock(_aSpawnBlocksOccurence[iRandType]);
        _fMaxTimeRefresh = TIME_REFRESH_GAME;
        _iScore = 0;
        _iLevel = 0;
        _iLines = 0;
        _iLevelLines = 0;
        _oInterface.refreshLevel(_iLevel + 1);
        _oInterface.refreshLines(_iLines);
        _oInterface.refreshScore(_iScore);
        _bPause = false;
    };

    this.unload = function () {
        if (s_bMobile) {

        } else {
            document.onkeydown = null;
            document.onkeyup = null;
        }

        _oGameField.unload();
        _oGameField = null;
        _oInterface.unload();
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };

    function onKeyDown(evt) {
        if (!_bPressedKeys && !_bPause && !s_oGameField.isAnimFullLines()) {
            if (evt.keyCode === 37) {
                s_oGame.onLeft();
                _bPressedKeys = true;
            } else if (evt.keyCode === 39) {
                s_oGame.onRight();
                _bPressedKeys = true;
            } else if (evt.keyCode === 38) {
                s_oGame.onUp();
                _bPressedKeys = true;
            }

        }


        if (evt.keyCode === 40 && _bKeyDown === false && !_bPause) {
            s_oGame.onDown();
        }

        evt.preventDefault();
        return false;
    }

    this.onLeft = function () {
        if (_oBlock.getReplace()) {
            return;
        }
        _oDirFunc = s_oGame.onLeft;
        _bKeyDir = true;
        _fTimeRefreshDirection = TIME_REFRESH_DIRECTION;
        if (_oBlock.getCol() > 0) {
            var _bHitSomething = _oGameField.checkDirection(_oBlock, LEFT);

            if (!_bHitSomething) {
                _oBlock.setCol(_oBlock.getCol() - 1);
                _oBlock.refreshCellPosition();
            }
        }
    };

    this.onRight = function () {
        if (_oBlock.getReplace()) {
            return;
        }
        _oDirFunc = s_oGame.onRight;
        _bKeyDir = true;
        _fTimeRefreshDirection = TIME_REFRESH_DIRECTION;
        if (_oBlock.getCol() < GRID_X - _oBlock.getWidth()) {
            var _bHitSomething = _oGameField.checkDirection(_oBlock, RIGHT);

            if (!_bHitSomething) {
                _oBlock.setCol(_oBlock.getCol() + 1);
                _oBlock.refreshCellPosition();
            }
        }
    };

    this.onUp = function () {
        playSound("shift_piece", 1, false);
        _oBlock.setOrientation(_oBlock.getOrientation() + 90);
        _oBlock.refreshCellPosition();
    };

    this.onDown = function () {
        _bKeyDown = true;
        if (!_oBlock.getReplace()) {
            _oBlock.down();
        }
        _fTimeRefresh = TIME_REFRESH_GAME_KEY_DOWN;
    };

    this.calculateScore = function (iFullLines) {
        this.addScore(iFullLines * 20)   // SCORE_LINE[iFullLines - 1]) * (_iLevel + 1));
    };

    this.checkForNewLevel = function (iFullLines) {
        _iLines += iFullLines;
        _iLevelLines += iFullLines;
        _oInterface.refreshLines(_iLines);
        if (_iLevelLines >= LEVEL_UP_LINES) {
            _iLevel++;
            _iLevelLines = _iLevelLines - LEVEL_UP_LINES;
            _oInterface.refreshLevel(_iLevel + 1);
            var fTempRefresh = _fMaxTimeRefresh - STEP_DECREASE;
            if (fTempRefresh >= MIN_REFRESH_GAME) {
                _fMaxTimeRefresh = fTempRefresh;
            }
            STEP_DECREASE -= 0.05;
            if (STEP_DECREASE < 0.05) {
                STEP_DECREASE = 0.05;
            }
        }
    };

    this.canInput = function (bVal) {
        _bInput = bVal;
    };

    this.addScore = function (iAddScore) {
        _iScore += iAddScore; // origin
        // _iScore += 20; // improve this
        _oInterface.refreshScore(_iScore);
    };

    function onKeyUp(evt) {
        if (_bPressedKeys && !_bPause && !s_oGameField.isAnimFullLines()) {
            if (evt.keyCode === 37) {
                _bPressedKeys = false;
                s_oGame.dirKeyUp();
            } else if (evt.keyCode === 39) {
                _bPressedKeys = false;
                s_oGame.dirKeyUp();
            } else if (evt.keyCode === 38) {
                _bPressedKeys = false;
            } else if (evt.keyCode === 80) {
                _bPressedKeys = false;
            } else if (evt.keyCode === 32) {
                _bPressedKeys = false;
            }
        }
        if (evt.keyCode === 40 && _bKeyDown === true) {
            s_oGame.onDownKeyUp();
        }

        evt.preventDefault();
        return false;
    }

    this.dirKeyUp = function () {
        _bKeyDir = false;
    };

    this.onDownKeyUp = function () {
        _bKeyDown = false;
        _fTimeRefresh = _fMaxTimeRefresh;
    };

    this.createBlock = function (iType) {
        var oSpriteCell = s_oSpriteLibrary.getSprite("cell_" + iType);
        _oBlock = new CBlock(iType, oSpriteCell, _oContainerGame);
    };

    this.getContainerGame = function () {
        return _oContainerGame;
    };

    this.gameOver = function () {
        this.setPause(true);
        
        s_aSounds["game_over"].on('end', function(){
            setVolume("soundtrack", 0.4);
        });
        
        playSound("game_over", 1, false);
        setVolume("soundtrack", 0);
        
        
        $(s_oMain).trigger("end_level", 1);
        _oInterface.gameOver(_iScore, _iLevel + 1, _iLines);
    };

    this.keysDirectionPress = function () {
        if (_bKeyDir) {
            _oDirFunc();
        }
    };

    this.update = function () {
        if (_bPause === false) {
            if (s_oGameField.isAnimFullLines()) {
                return;
            }
            if (_oBlock.getReplace() === true) {
                _oBlock = null;
                this.createBlock(_iNextType);
                this.nextType();
                _oInterface.refreshNextBlock(_iNextType);
                if (s_oGameField.checkDirection(_oBlock)) {
                    this.gameOver();
                    return;
                }
            }

            if (_fTimeRefresh < 0) {
                _oBlock.down();
                if (!_bKeyDown) {
                    _fTimeRefresh = _fMaxTimeRefresh * 1000;
                } else {
                    _fTimeRefresh = TIME_REFRESH_GAME_KEY_DOWN;
                }

            } else {
                _fTimeRefresh -= s_iTimeElaps;
            }


            if (_fTimeRefreshDirection < 0) {
                _fTimeRefreshDirection = TIME_REFRESH_DIRECTION;
                this.keysDirectionPress();
            } else {
                if (_bKeyDir) {
                    _fTimeRefreshDirection -= FPS_TIME;
                }
            }
        }
    };

    s_oGame = this;

    LEVEL_UP_LINES = oData.level_up_lines;
    MIN_REFRESH_GAME = oData.min_refresh_game;
    SCORE_LINE = oData.score_line;
    TIME_REFRESH_GAME = oData.start_refresh_game;
    STEP_DECREASE = oData.step_decrease_refresh_game;
    BLOCKS_OCCURENCE = oData.blocks_occurence;
    NUM_LEVEL_FOR_ADS = oData.num_levels_for_ads;
    TIME_REFRESH_GAME_KEY_DOWN = MIN_REFRESH_GAME;


    this._init();
}

var s_oGame;
var s_oScrollStage;