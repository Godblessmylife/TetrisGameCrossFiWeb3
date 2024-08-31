function CEdges() {

    var _oLEdge;
    var _oIEdge;

    this._init = function () {

        var oSpriteLEdge = s_oSpriteLibrary.getSprite("frame_bottom");
        _oLEdge = createBitmap(oSpriteLEdge);
        _oLEdge.x = 300 + oSpriteLEdge.width*0.5;
        _oLEdge.y = 713;
        _oLEdge.regX = oSpriteLEdge.width;
        _oLEdge.regY = oSpriteLEdge.height * 0.5;

        s_oStage.addChild(_oLEdge);
    };

    this.createIEdge = function () {
        var oSpriteIEdge = s_oSpriteLibrary.getSprite("frame_top");
        _oIEdge = createBitmap(oSpriteIEdge);
        _oIEdge.x = 88;
        _oIEdge.y = 709;
        _oIEdge.regX = oSpriteIEdge.width * 0.5;
        _oIEdge.regY = oSpriteIEdge.height * 0.5;

        s_oStage.addChild(_oIEdge);
    };

    this._init();

    return this;
}