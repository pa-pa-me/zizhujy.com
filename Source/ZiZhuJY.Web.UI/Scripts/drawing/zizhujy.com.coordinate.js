; (function (window) {
    if(typeof zizhujy == "undefined"){
        zizhujy = {};
        window.zizhujy = zizhujy;
    }

    if(typeof zizhujy.com == "undefined"){
        zizhujy.com = {};
    }

    if(typeof zizhujy.com.coordinate == "undefined"){
        zizhujy.com.RectangularCoordinate = RectangularCoordinate;
        zizhujy.com.GeneralRectangularCoordinate = GeneralRectangularCoordinate;
    }

    /// <summary>
    ///     更通用的基类，基类只是更通用的基类中的一种特殊情况
    /// </summary>
    function BaseRectangularCoordinate(left, right, bottom, top, leftContext, rightContext, bottomContext, topContext){        
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.leftContext = leftContext;
        this.rightContext = rightContext;        
        this.bottomContext = bottomContext;
        this.topContext = topContext;

        this.origin = {
            x: this.leftContext - this.left * (this.rightContext - this.leftContext) / (this.right - this.left),
            y: this.bottomContext + this.bottom * (this.topContext - this.bottomContext) / (this.top - this.bottom)
        };

        this.pixelWidth = Math.abs((this.right - this.left) / (this.rightContext - this.leftContext));
        this.pixelHeight = Math.abs((this.top - this.bottom) / (this.topContext - this.bottomContext));

        if(typeof BaseRectangularCoordinate.__initialized__ == "undefined"){
            BaseRectangularCoordinate.prototype.outerBoundary = function (region){
                return region;
            };

            BaseRectangularCoordinate.prototype.innerBoundary = function (region){
                return region;
            };

            BaseRectangularCoordinate.prototype.context2coordinate = function (x_context, y_context){
                var coor = {};

                coor.x = this.left + (x_context - this.leftContext) * (this.right - this.left) / (this.rightContext - this.leftContext);
                coor.y = this.bottom + (y_context - this.bottomContext) * (this.top - this.bottom) / (this.topContext - this.bottomContext);

                return coor;
            };

            BaseRectangularCoordinate.prototype.coordinate2context = function (x_coor, y_coor){
                var contextCoor = {};

                contextCoor.x = this.leftContext + (x_coor - this.left) * (this.rightContext - this.leftContext) / (this.right - this.left);
                contextCoor.y = this.bottomContext + (y_coor - this.bottom) * (this.topContext - this.bottomContext) / (this.top - this.bottom);

                contextCoor.x = Math.round(contextCoor.x);
                contextCoor.y = Math.round(contextCoor.y);

                return contextCoor;
            };

            BaseRectangularCoordinate.__initialized__ = true;
        }
    }

    /// <summary>
    ///     基类 继承自 BaseRectangularCoordinate
    /// </summary>
    function GeneralRectangularCoordinate(left, right, bottom, top, contextWidth, contextHeight){
        BaseRectangularCoordinate.call(this, left, right, bottom, top, 0, contextWidth, 0, contextHeight);
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.contextWidth = contextWidth;
        this.contextHeight = contextHeight;

        this.origin = {
            //   right - left           x_coor - 0_coor              x_coor - 0
            // --------------- = --------------------------- = --------------------------
            //      W - 0            x_context - x0_context       x_context - x0_context
            //
            // so 
            //  x_coor = (x_context - x0_context) * (right - left) / W
            //
            //      top - bottom             y_coor - 0_coor                y_coor - 0
            //  ------------------- = ---------------------------- = -------------------------
            //         0 - H              y_context - y0_context       y_context - y0_context
            //
            // so
            //  y_coor = (y0_context - y_context) * (top - bottom) / H
            // 
            //      right - left          0_coor - left           -left        
            //  ------------------- = -------------------- = ------------------
            //        W - 0              x0_context - 0          x0_context    
            // so
            //  x0_context = -left * W / (right - left)
            //
            x: -left * contextWidth / (right - left),
            //  top - bottom       0_coor - top              - top
            // -------------- = ---------------------- = ----------------
            //    0 - H             y0_context - 0           y0_context
            // so
            //  y0_context = top * H / (top - bottom)
            //
            y: top * contextHeight / (top - bottom)
        };
        this.pixelWidth = Math.abs((this.right - this.left) / this.contextWidth);
        this.pixelHeight = Math.abs((this.top - this.bottom) / this.contextHeight);

        if(typeof GeneralRectangularCoordinate.__initialized__ == "undefined"){
            GeneralRectangularCoordinate.__initialized__ = true;
        }
    }

    // Note: Important for implementing the inherit relation!
    GeneralRectangularCoordinate.prototype = new BaseRectangularCoordinate();

    /// <summary>
    ///     继承自 BaseRectangularCoordinate
    /// </summary>
    function RectangularCoordinate(context, left, right, bottom, top, leftContext, rightContext, bottomContext, topContext){
        BaseRectangularCoordinate.call(this, left, right, bottom, top, leftContext, rightContext, bottomContext, topContext);
        this.context = context;

        if(typeof RectangularCoordinate.__initialized__ == "undefined"){
            RectangularCoordinate.prototype.save = function(){
                this.context.save();
            };

            RectangularCoordinate.prototype.restore = function(){
                this.context.restore();
            };

            RectangularCoordinate.prototype.fillStyle = function(fillStyle){
                this.context.fillStyle = fillStyle;
            };

            RectangularCoordinate.prototype.fillRect = function(x1_coor, y1_coor, x2_coor, y2_coor){
                this.save();
                var contextCoor1 = this.coordinate2context(x1_coor, y1_coor);
                var contextCoor2 = this.coordinate2context(x2_coor, y2_coor);

                var width = Math.max(Math.abs(contextCoor2.x - contextCoor1.x), 1);
                var height = Math.max(Math.abs(contextCoor2.y - contextCoor1.y), 1);

                this.context.fillRect(Math.min(contextCoor1.x, contextCoor2.x), Math.min(contextCoor1.y, contextCoor2.y), width, height);
                this.restore();
            };
            
            RectangularCoordinate.prototype.fillRegion = function(region, color){
                this.save();
                this.fillStyle(color);
                this.fillRect(region.xRange.val[0], region.yRange.val[0], region.xRange.val[1], region.yRange.val[1]);
                this.restore();
            };

            RectangularCoordinate.prototype.strokeStyle = function(strokeStyle){
                this.context.strokeStyle = strokeStyle;
            };

            RectangularCoordinate.prototype.strokeRegion = function(region, color){
                this.save();
                this.strokeStyle(color);
                
                var contextCoor1 = this.coordinate2context(region.xRange.val[0], region.yRange.val[0]);
                var contextCoor2 = this.coordinate2context(region.xRange.val[1], region.yRange.val[1]);
                
                var width = Math.max(Math.abs(contextCoor2.x - contextCoor1.x), 1);
                var height = Math.max(Math.abs(contextCoor2.y - contextCoor1.y), 1);

                this.context.strokeRect(Math.min(contextCoor1.x, contextCoor2.x), Math.min(contextCoor1.y, contextCoor2.y), width, height);
                this.restore();
            };

            RectangularCoordinate.prototype.point = function(x_coor, y_coor){
                var contextCoor = this.coordinate2context(x_coor, y_coor);

                this.context.fillRect(contextCoor.x, contextCoor.y, 1, 1);
            };

            RectangularCoordinate.prototype.line = function(x1_coor, y1_coor, x2_coor, y2_coor) {                
                this.save();
                var contextCoor1 = this.coordinate2context(x1_coor, y1_coor);
                var contextCoor2 = this.coordinate2context(x2_coor, y2_coor);

                this.context.moveTo(contextCoor1.x, contextCoor1.y);
                this.context.lineTo(contextCoor2.x, contextCoor2.y);

                this.context.stroke();
                this.restore();
            };

            RectangularCoordinate.prototype.drawAxis = function(){
                this.line(left, 0, right, 0);
                this.line(0, top, 0, bottom);
            };

            RectangularCoordinate.__initialized__ = true;
        }
    }

    // Note: Important for implementing the inherit relation!
    RectangularCoordinate.prototype = new BaseRectangularCoordinate();
})(window);