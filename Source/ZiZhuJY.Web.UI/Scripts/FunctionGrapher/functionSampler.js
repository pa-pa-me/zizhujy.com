;(function (console) {
    var Distance = {
        // sqrt(x^2 +  y^2), computed to avoid overflow and underflow.
        // http://en.wikipedia.org/wiki/Hypot
        hypot: function(x, y){
            if(x===0 && y===0){
                return 0;
            }

            if(Math.abs(x)>Math.abs(y)){
                return Math.abs(x)*Math.sqrt((y/x)*(y/x)+1);
            }else{
                return Math.abs(y)*Math.sqrt((x/y)*(x/y)+1);
            }
        },

        // (x1 + x2)/2, computed to avoid overflow.
        mean: function(x1, x2){
            return ((x1 > 0) === (x2 > 0)) ?
                        x1 + 0.5*(x2-x1)
                        : 0.5*(x1+x2)
            ;
        }
    };
    
    /// <summary>
    ///     floatMiddle is a helper function for bisecting floats.
    ///     Necessary because floats are denser near 0 than they are 
    ///     elsewhere, so using a normal mean results in slow bisection
    ///     to 0.
    ///
    ///     This function returns the arithmetic mean if both numbers 
    ///     have magnitude larger than 1e-2, 0 if the numbers are small
    ///     and have opposite signs, and the signed geometric mean if
    ///     the numbers have the same sign. The geometric mean bisects the
    ///     exponent instead of the mantissa, which is what we want near
    ///     0.
    /// </summary>
    function floatMiddle(a, b){
        var tmp;
        if(a > b){
            tmp = a; a = b; b = temp;
        }

        var aPos = a>0;
        var bPos = b>0;
        var aLarge = Math.abs(a) > 1e-2;
        var bLarge = Math.abs(b) > 1e-2;
        if(aLarge || bLarge) return Distance.mean(a, b);
        if(a === 0) return b*Math.abs(b);
        if(b === 0) return a*Math.abs(a);
        if(aPos != bPos) return 0;
        var gMean = (aPos) ? Math.sqrt(a*b) : -Math.sqrt(a*b);
        // Check ifthe geometric mean actually lies between the numbers
        // (it might not because of floating point rounding). If it does
        // not, return the normal mean, which is computed in a way that
        // guarantees it will be between the inputs.
        return ((gMean >= a) && (b >= gMean)) ? gMean : Distance.mean(a, b);
    }

    function bisectFinite(x0, y0, x2, y2, fn){
        // Preconditions:
        //  1. isFinite(y0) !== isFinite(y2)
        if(isFinite(y0) === isFinite(y2)){
            console.log('bisectFinite called with bad y values', [y0, y2]);
            return;
        }

        while(true){
            var x1 = floatMiddle(x0, x2);
            var y1 = fn(x1);

            // We can't bisect any further; return [x, y] pair for side that is finite.
            if(x1 === x0 || x1 === x2) return isFinite(y0)? [x0, y0] : [x2, y2];

            // Bisect on side that brackets zero
            if(isFinite(y1) !== isFinite(y0)){
                x2 = x1;
                y2 = y1;
            }else{
                x0 = x1;
                y0 = y1;
            }
        }
    }

    function bisectFiniteTY(t0, x0, y0, t2, x2, y2, fnX, fnY){
        // Preconditions:
        //  1. isFinite(y0) !== isFinite(y2) 
        if(isFinite(y0) === isFinite(y2)){
            console.log("bisectFiniteTY called with bad y values", [y0, y2]);
            return;
        }

        while(!isNaN(t0) && !isNaN(x0) && !isNaN(y0) && !isNaN(t2) && !isNaN(x2) && !isNaN(y2)){
            var t1 = floatMiddle(t0, t2);
            var x1 = fnX(t1);
            var y1 = fnY(t1);

            // We can't bisect any further: return [t, x, y] for side that is finite.
            if(x1 === x0 || x1 === x2) return isFinite(y0) ? [t0, x0, y0] : [t2, x2, y2];

            // Bisect on side that brackets zero
            if(isFinite(y1) !== isFinite(y0)){
                t2 = t1;
                x2 = x1;
                y2 = y1;
            } else {
                t0 = t1;
                x0 = x1;
                y0 = y1;
            }
        }
    }

    function bisectFiniteTX(t0, x0, y0, t2, x2, y2, fnX, fnY){
        // Preconditions:
        //  1. isFinite(x0) !== isFinite(x2)
        if(isFinite(x0) === isFinite(x2)){
            //console.log("bisectFiniteTX called with bad x values", [x0, x2]);
            return;
        }

        while(true){
            var t1 = floatMiddle(t0, t2);
            var x1 = fnX(t1);
            var y1 = fnY(t1);

            // We can't bisect any further: return [t, x, y] for side that is finite.
            if(y1 === y0 || y1 === y2) return isFinite(x0) ? [t0, x0, y0] : [t2, x2, y2];

            // Bisect on side that brackets zero
            if(isFinite(x1) !== isFinite(x0)){
                t2 = t1;
                x2 = x1;
                y2 = y1;
            }else{
                t0 = t1;
                x0 = x1;
                y0 = y1;
            }
        }
    }

    /// <summary>
    ///     Returns largest jump among 4 points. Used in final step of
    ///     bisectJump
    /// </summary>
    function largestJump(x0, y0, x1, y1, x2, y2, x3, y3){
        // Preconditions:
        //  1. y0, y1, y2, and y3 are all finite
        var d1 = Math.abs(y1-y0);
        var d2 = Math.abs(y2-y1);
        var d3 = Math.abs(y3-y2);

        if(d1>d2 && d1>d3) return [[x0, y0], [x1,y1]];
        if(d3>d2 && d3>d1) return [[x2, y2], [x3,y3]];
        return [[x1, y1], [x2, y2]];
    }

    function largestJumpX(x0, y0, x1, y1, x2, y2, x3, y3){
        var d1 = Math.abs(x1-x0);
        var d2 = Math.abs(x2-x1);
        var d3 = Math.abs(x3-x2);

        if(d1>d2 && d1>d3) return [[x0, y0], [x1,y1]];
        if(d3>d2 && d3>d1) return [[x2, y2], [x3,y3]];
        return [[x1, y1], [x2, y2]];        
    }

    /// <summary>
    ///     Tries to find the largest jump in an interval. Returns
    ///     left side and right side of jump as [[xl, yl], [xr, yr]],
    ///     or null if no jump was found.
    ///     Tolerance is allowed to be 0, and this works for some
    ///     smooth functions, but returns false positive for others.
    function bisectJump(x0, y0, x2, y2, x4, y4, fn, tolerance){
        // Preconditions:
        //  1. x0 < x2 < x4
        //  2. y0, y2, and y4 are all finite.
        // Also expect x2 - x0 ~= x4 - x2
        if(!(x0 < x2 && x2 < x4)){
            console.log('bisectJump called with bad x values', [x0, x2, x4]);
            return;
        }

        if(!(isFinite(y0) && isFinite(y2) && isFinite(y4))){
            console.log('bisectJump called with bad y values', [y0, y2, y4]);
            return;
        }

        while(true){
            var x1 = floatMiddle(x0, x2);
            var y1 = fn(x1);
            var x3 = floatMiddle(x2, x4);
            var y3 = fn(x3);
            var dy1 = Math.abs(y1 - Distance.mean(y0, y2));
            var dy3 = Math.abs(y3 - Distance.mean(y2, y4));
            var left;
            var right;
            if(!tolerance) tolerance = 0;

            if(dy1 <= tolerance && dy3 <= tolerance) return null;
            
            // An undefined region counts as a jump.
            if(!isFinite(y1)){
                left = bisectFinite(x0, y0, x1, y1, fn);
                right = bisectFinite(x1, y1, x4, y4, fn);
                return [left, right];
            }

            if(!isFinite(y3)){
                left = bisectFinite(x0, y0, x3, y3, fn);
                right = bisectFinite(x3, y3, x4, y4, fn);
                return [left, right];
            }

            if((x1 === x0 || x1 === x2) && (x3 === x2 || x3 === x4)){
                if(Math.abs(y2-y0) > Math.abs(y4-y2)){
                    left = [x0, y0];
                    right = [x2, y2];
                }else{
                    left = [x2, y2];
                    right = [x4, y4];
                }

                return [left, right];
            } else if (x1 === x0 || x1 === x2){
                return largestJump(x0, y0, x2, y2, x3, y3, x4, y4);
            } else if (x3 === x2 || x3 === x4){
                return largestJump(x0, y0, x1, y1, x2, y2, x4, y4);
            }

            if(dy1 > dy3){
                x4 = x2; y4 = y2; x2 = x1; y2 = y1;
            }else{
                x0 = x2; y0=y2; x2=x3; y2 = y3;
            }
        }
    }

    function bisectJumpTY(t0, x0, y0, t2, x2, y2, t4, x4, y4, fnX, fnY, tolerance){
        if(!(x0 < x2 && x2 < x4)){
            //console.log("bisectJumpTY called with bad x values", [x0, x2, x4]);
            return;
        }

        if(!(isFinite(y0) && isFinite(y2) && isFinite(y4))){
            console.log("bisectJumpTY called with bad y values", [y0, y2, y4]);
            return;
        }

        while(true){
            var t1 = floatMiddle(t0, t2);
            var x1 = fnX(t1);
            var y1 = fnY(t1);

            var t3 = floatMiddle(t2, t4);
            var x3 = fnX(t3);
            var y3 = fnY(t3);
                        
            var dy1 = Math.abs(y1 - Distance.mean(y0, y2));
            var dy3 = Math.abs(y3 - Distance.mean(y2, y4));

            var left;
            var right;
            if(!tolerance) tolerance = 0;

            if(dy1 <= tolerance && dy3 <= tolerance) return null;

            if(!isFinite(y1)){
                left = bisectFiniteTY(t0, x0, y0, t1, x1, y1, fnX, fnY);
                right = bisectFiniteTY(t1, x1, y1, t4, x4, y4, fnX, fnY);
                return [[left[1], left[2]], [right[1], right[2]]];
            }
            if(!isFinite(y3)){
                left = bisectFiniteTY(t0, x0, y0, t3, x3, y3, fnX, fnY);
                right = bisectFiniteTY(t3, x3, y3, t4, x4, y4, fnX, fnY);
                return [[left[1], left[2]], [right[1], right[2]]];
            }
            
            if((x1 === x0 || x1 === x2) && (x3 === x2 || x3 === x4)){
                if(Math.abs(y2-y0) > Math.abs(y4-y2)){
                    left = [x0, y0];
                    right = [x2, y2];
                }else{
                    left = [x2, y2];
                    right = [x4, y4];
                }

                return [left, right];
            } else if (x1 === x0 || x1 === x2){
                return largestJump(x0, y0, x2, y2, x3, y3, x4, y4);
            } else if (x3 === x2 || x3 === x4){
                return largestJump(x0, y0, x1, y1, x2, y2, x4, y4);
            }

            if(dy1 > dy3){
                t4 = t2; x4 = x2; y4 = y2; 
                t2 = t1; x2 = x1; y2 = y1;
            }else{
                t0 = t2; x0 = x2; y0 = y2; 
                t2 = t3; x2 = x3; y2 = y3;
            }
        }
    }

    function bisectJumpTX(t0, x0, y0, t2, x2, y2, t4, x4, y4, fnX, fnY, tolerance){
        if(!(y0 < y2 && y2 < y4)){
            console.log("bisectJumpTY called with bad y values", [y0, y2, y4]);
            return;
        }

        if(!(isFinite(x0) && isFinite(x2) && isFinite(x4))){
            console.log("bisectJumpTY called with bad x values", [x0, x2, x4]);
            return;
        }

        while(true){
            var t1 = floatMiddle(t0, t2);
            var x1 = fnX(t1);
            var y1 = fnY(t1);

            var t3 = floatMiddle(t2, t4);
            var x3 = fnX(t3);
            var y3 = fnX(t3);
                        
            var dx1 = Math.abs(x1 - Distance.mean(x0, x2));
            var dx3 = Math.abs(x3 - Distance.mean(x2, x4));

            var left;
            var right;
            if(!tolerance) tolerance = 0;

            if(dx1 <= tolerance && dx3 <= tolerance) return null;

            if(!isFinite(x1)){
                left = bisectFiniteTX(t0, x0, y0, t1, x1, y1, fnX, fnY);
                right = bisectFiniteTX(t1, x1, y1, t4, x4, y4, fnX, fnY);
                return [[left[1], left[2]], [right[1], right[2]]];
            }
            if(!isFinite(x3)){
                left = bisectFiniteTY(t0, x0, y0, t3, x3, y3, fnX, fnY);
                right = bisectFiniteTY(t3, x3, y3, t4, x4, y4, fnX, fnY);
                return [[left[1], left[2]], [right[1], right[2]]];
            }
            
            if((y1 === y0 || y1 === y2) && (y3 === y2 || y3 === y4)){
                if(Math.abs(x2-x0) > Math.abs(x4-x2)){
                    left = [x0, y0];
                    right = [x2, y2];
                }else{
                    left = [x2, y2];
                    right = [x4, y4];
                }

                return [left, right];
            } else if (y1 === y0 || y1 === y2){
                return largestJumpX(x0, y0, x2, y2, x3, y3, x4, y4);
            } else if (y3 === y2 || y3 === y4){
                return largestJumpX(x0, y0, x1, y1, x2, y2, x4, y4);
            }

            if(dx1 > dx3){
                t4 = t2; x4 = x2; y4 = y2; 
                t2 = t1; x2 = x1; y2 = y1;
            }else{
                t0 = t2; x0 = x2; y0=y2; 
                t2 = t3; x2=x3; y2 = y3;
            }
        }
    }

    var POI = {
        bisectJump: bisectJump,
        bisectJumpTY: bisectJumpTY,
        bisectJumpTX: bisectFiniteTX,
        bisectFinite: bisectFinite,
        bisectFiniteTY: bisectFiniteTY,
        bisectFiniteTX: bisectFiniteTX
    };

    var Plotter = {
        sampleXYNaive: function(fn, domain){
            var data = [];
            var x, y;
            try{
                for(x = domain.min; x <= domain.max; x+= domain.step){
                    y= fn(x);
                    data.push([x,y]);
                }
            }catch (ex) {
                data.push([x, null]);
            }

            return data;
        },

        sampleXY: function (fn, domain, range) {
            // backward compatibility for now, need to delete the following line.
            range = $.extend(true, { min: -Infinity, max: Infinity }, range);
            
            var data = [];
            var x, y;

            try{
                x = domain.min;
                y = fn(x);
                var previousPoint = [x, y];
                var jumpTolerance;

                if(!!domain) jumpTolerance = domain.ytolerance || domain.tolerance;
                var handleJump = function (previousPoint, point){
                    var jump ;
                    var xc;
                    var edge;

                    xc = Distance.mean(previousPoint[0], point[0]);
                    jump = POI.bisectJump(
                        previousPoint[0], previousPoint[1],
                        xc, fn(xc), 
                        point[0], point[1], 
                        fn, jumpTolerance
                    );

                    if(jump){
                        data.push(jump[0]);
                        data.push(null);
                        data.push(jump[1]);
                    }
                };

                if (isFinite(y)) data.push([x, y >= range.min && y <= range.max ? y : null]);
                
                for(x+=domain.step; x<domain.max + domain.step; x+= domain.step){
                    y = fn(x);
                    if(isFinite(y) && isFinite(previousPoint[1])){
                        handleJump(previousPoint, [x,y]);
                        data.push([x, y >= range.min && y <= range.max ? y : null]);
                    }else if (isFinite(y) && !isFinite(previousPoint[1])){
                        // left edge
                        edge = POI.bisectFinite(previousPoint[0], previousPoint[1], x, y, fn);
                        if(edge[0] !== x) {
                            data.push(null);
                            data.push(edge);
                            data.push(null);
                        }

                        handleJump(edge, [x, y]);
                        data.push(null); data.push([x, y >= range.min && y <= range.max ? y : null]); data.push(null);
                    } else if (!isFinite(y) && isFinite(previousPoint[1])){
                        // right edge
                        edge = POI.bisectFinite(previousPoint[0], previousPoint[1], x,y, fn);
                        handleJump(previousPoint, edge);
                        if(edge[0]!== previousPoint[0]){
                            data.push(null);
                            data.push(edge);
                            data.push(null);
                        }
                    }

                    previousPoint = [x, y];
                }
            } catch (ex) {
                var urlParams = zizhujy.com.deserializeUrlParams();
                if (!!urlParams && !!urlParams.debug) {
                    console.log(ex);
                }
                data.push([x, null]);
            }

            return data;
        },

        /// <summary>
        /// </summary>
        /// <returns>
        ///     data: [[x1, y1], [x2, y2], ..., [xn, yn]]
        /// <returns>
        sampleTXY: function (fnX, fnY, domain, ranges) {
            // backward compatibility for now, need to delete the following line.
            $.extend(true, [{ min: -Infinity, max: Infinity }, { min: -Infinity, max: Infinity }], ranges);
            
            var data  =[];
            var t, x, y;
//            try{
                t = domain.min;
                x = fnX(t);
                y = fnY(t);
                while((isNaN(y) || isNaN(x)) && t < domain.max + domain.step){
                    t += domain.step;

                    x = fnX(t);
                    y = fnY(t);
                }

                if(t >= domain.max + domain.step) {
                    return data;
                }

                var previousPoint = [t, x, y];
                var jumpTolerance;

                if(!!domain) jumpTolerance = domain.tolerance;
                var handleJumpY = function(previousPoint, point){
                    var jump;
                    var tc, xc, yc;
                    var edge;

                    tc = Distance.mean(previousPoint[0], point[0]);
                    xc = Distance.mean(previousPoint[1], point[1]);
                    yc = fnY(tc);
                    jump = POI.bisectJumpTY(
                        previousPoint[0], previousPoint[1], previousPoint[2],
                        tc, xc, yc,
                        point[0], point[1], point[2],
                        fnX, fnY, jumpTolerance
                    );

                    if(jump){
                        data.push(jump[0]);
                        data.push(null);
                        data.push(jump[1]);
                    }
                };
                var handleJumpX = function(previousPoint, point){
                    var jump;
                    var tc, xc, yc;
                    var edge;

                    tc = Distance.mean(previousPoint[0], point[0]);
                    xc = fnX(tc);
                    yc = Distance.mean(previousPoint[2], point[2]);
                    jump = POI.bisectJumpTX(
                        previousPoint[0], previousPoint[1], previousPoint[2],
                        tc, xc, yc,
                        point[0], point[1], point[2],
                        fnX, fnY, jumpTolerance
                    );

                    if(jump){
                        data.push(jump[0]);
                        data.push(null);
                        data.push(jump[1]);
                    }
                };
                if(isFinite(x) && isFinite(y)) data.push([x,y]);
                for(t += domain.step; t<domain.max + domain.step; t+=domain.step){
                    x = fnX(t);
                    y = fnY(t);

                    if(isNaN(x) || isNaN(y)){
                        continue;
                    }

                    if(isFinite(y) && isFinite(previousPoint[2])){
                        handleJumpY(previousPoint, [t, x, y]);
                        data.pushUnique([x >= ranges[0].min && x <= ranges[0].max ? x : null, y >= ranges[1].min && y <= ranges[1].max ? y : null], function (e) { return !!e && e[0] == x && e[1] == y; });
                    }else if (isFinite(y) && !isFinite(previousPoint[2])){
                        // left edge
                        edge = POI.bisectFiniteTY(previousPoint[0], previousPoint[1], previousPoint[2], t, x, y, fnX, fnY);

                        if(edge[1] !== x){
                            data.push(null);
                            data.push([edge[1], edge[2]]);
                            data.push(null);
                        }

                        handleJumpY(edge, [t, x, y]);
                        data.push(null); data.pushUnique([x >= ranges[0].min && x <= ranges[0].max ? x : null, y >= ranges[1].min && y <= ranges[1].max ? y : null], function (e) { return !!e && e[0] == x && e[1] == y; }); data.push(null);
                    }else if (!isFinite(y) && isFinite(previousPoint[2])){
                        // right edge
                        edge = POI.bisectFiniteTY(previousPoint[0], previousPoint[1], previousPoint[2], t, x, y, fnX, fnY);

                        handleJumpY(previousPoint, edge);
                        if(edge[1] !== previousPoint[1]){
                            data.push(null);
                            data.push([edge[1], edge[2]]);
                            data.push(null);
                        }
                    }

                    if(isFinite(x) && isFinite(previousPoint[1])){
                        handleJumpX(previousPoint, [t, x, y]);
                        data.pushUnique([x >= ranges[0].min && x <= ranges[0].max ? x : null, y >= ranges[1].min && y <= ranges[1].max ? y : null], function (e) { return !!e && e[0] == x && e[1] == y; });
                    }else if(isFinite(x) && !isFinite(previousPoint[1])){
                        // left edge
                        edge = POI.bisectFiniteTX(previousPoint[0], previousPoint[1], previousPoint[2], t, x, y, fnX, fnY);
                        if(edge[2] !== y){
                            data.push(null);
                            data.push([edge[1], edge[2]]);
                            data.push(null);
                        }

                        handleJumpX(edge, [t, x, y]);
                        data.push(null); data.pushUnique([x >= ranges[0].min && x <= ranges[0].max ? x: null, y >= ranges[1].min && y <= ranges[1].max ? y : null], function (e) { return !!e && e[0] == x && e[1] == y; }); data.push(null);
                    }else if (!isFinite(x) && isFinite(previousPoint[1])){
                        // right edge
                        edge = POI.bisectFiniteTX(previousPoint[0], previousPoint[1], previousPoint[2], t, x, y, fnX, fnY);
                        handleJumpX(previousPoint, edge);
                        if(edge[2] !== previousPoint[2]){
                            data.push(null);
                            data.push([edge[1], edge[2]]);
                            data.push(null);
                        }
                    }

                    previousPoint = [t, x, y];
                }
//            }catch(ex){
//                data.push([null, null]);
//                throw String.format("Error occurred! t={0},x={1},y={2}\r\n{3}", t, x, y, ex);
//            }

            return data;
        },

        /// <param name="r">
        ///     r = function ({xRange: {val: [x1, x2], def: [false, true]}, yRange: {val: [y1, y2], def: [false, true]}) {
        ///         return {val: [false, true], def: [false, true]};
        ///     }
        /// </param>
        /// <param name="leftContext">
        ///     The left most x value in the context
        /// </param>
        sampleImplicit: function(r, left, right, bottom, top, leftContext, rightContext, bottomContext, topContext, context, domain, debug){
            var data = [];

            function getPointsFromRegion(coor, u){
                return [[u.xRange.val[0], u.yRange.val[0]]];
            }
            
            function paintCoorColor(coor, u, color) {
                if(!!coor.fillRegion){
                    coor.fillRegion(u, color);
                }
            }

            function strokeCoorRegion(coor, u, color){
                if(!!coor.strokeRegion){
                    coor.strokeRegion(u, color);
                }
            }

            function refinePixels(coor, r, U, undecidedU, debug){
                var newU = [];
                if(!!U && U.length > 0){
                    for(var i = 0; i < U.length; i++){
                        var u = U[i];
                        if (!!debug) {
                            paintCoorColor(coor, u, "#FFFF00");
                        }
                        var res = r(coor.outerBoundary(u));
                        if(res.val.equals([true, true]) && res.def.equals([true, true])){
                            paintCoorColor(coor, u, "#000000");
                            if (!!debug) {
                                data = data.concat(getPointsFromRegion(coor, u));
                            }
                        } else if (res.val.equals([false, false]) && res.def.equals([true,true]) || res.def.equals([false, false])){
                            if (!!debug) {
                                //paint white
                                paintCoorColor(coor, u, "#ffffff");
                            }
                        } else {
                            newU = newU.concat(fourCoorSubsquares(coor, u, undecidedU, debug));
                        }
                    }
                }

                return newU;
            }

            function handleRestU(coor, r, U){
                if(!!U && U.length > 0){
                    var rest = [];
                    for(var i = 0; i < U.length; i++){
                        var u = U[i];
                        var res = r(coor.outerBoundary(u));
                        if(!res.def.equals([true, true])){
                            // paint white
                            //paintCoorColor(coor, u, "#ffffff");
                        }else{
                            if(!res.val.equals([false, false])){
                                // paint black
                                paintCoorColor(coor, u, "#000000");
                                data = data.concat(getPointsFromRegion(coor, u));
                            } else {
                                // paint white
                                //paintCoorColor(coor, u, "#ffffff");
                            }
                        }
                    }
                }
            }

            function fourCoorSubsquares(coor, u, undecidedU, debug) {
                var subSquares = [];
                if (!!u) {
                    var xDistance = u.xRange.val[1] - u.xRange.val[0];
                    var yDistance = u.yRange.val[1] - u.yRange.val[0];
                    if (xDistance > coor.pixelWidth && yDistance > coor.pixelHeight) {
                        var xMid = (u.xRange.val[0] + xDistance / 2);
                        var yMid = (u.yRange.val[0] + yDistance / 2);
                        subSquares.push({ xRange: { val: [u.xRange.val[0], xMid], def: [true, true] }, yRange: { val: [u.yRange.val[0], yMid], def: [true, true]} });
                        subSquares.push({ xRange: { val: [xMid, u.xRange.val[1]], def: [true, true] }, yRange: { val: [u.yRange.val[0], yMid], def: [true, true]} });
                        subSquares.push({ xRange: { val: [u.xRange.val[0], xMid], def: [true, true] }, yRange: { val: [yMid, u.yRange.val[1]], def: [true, true]} });
                        subSquares.push({ xRange: { val: [xMid, u.xRange.val[1]], def: [true, true] }, yRange: { val: [yMid, u.yRange.val[1]], def: [true, true]} });
                    } else if (xDistance > coor.pixelWidth) {
                        var xMid = (u.xRange.val[0] + xDistance / 2);
                        subSquares.push({ xRange: { val: [u.xRange.val[0], xMid], def: [true, true] }, yRange: u.yRange });
                        subSquares.push({ xRange: { val: [xMid, u.xRange.val[1]], def: [true, true] }, yRange: u.yRange });
                    } else if (yDistance > coor.pixelHeight) {
                        var yMid = (u.yRange.val[0] + yDistance / 2);
                        subSquares.push({ xRange: u.xRange, yRange: { val: [u.yRange.val[0], yMid], def: [true, true]} });
                        subSquares.push({ xRange: u.xRange, yRange: { val: [yMid, u.yRange.val[1]], def: [true, true]} });
                    } else {
                        // undecision region += u
                        // Note: can't use undecidedU = undecidedU.concat(u), it won't touch the original undecidedU ???
                        // But push() can work
                        undecidedU.push(u);
                    }
                }

                return subSquares;
            }

            var coor;
            if(!!context)
                coor = new zizhujy.com.RectangularCoordinate(context, left, right, bottom, top, leftContext, rightContext, bottomContext, topContext);
            else 
                coor = new zizhujy.com.BaseRectangularCoordinate(left, right, bottom, top, leftContext, rightContext, bottomContext, topContext);
            var width = right-left;
            var height = top - bottom;
            var k = 15; //Math.gcd(contextWidth, contextHeight);
            var U = [];
            var undecidedU = [];
            var xMin = left, xMax = right, yMin = bottom, yMax = top;
            if(!!domain){
                if(typeof domain.xMin != "undefined") xMin = eval(domain.xMin);
                if(typeof domain.xMax != "undefined") xMax = eval(domain.xMax);
                if(typeof domain.yMin != "undefined") yMin = eval(domain.yMin);
                if(typeof domain.yMax != "undefined") yMax = eval(domain.yMax);
            }
            U = fourCoorSubsquares(coor, {xRange: {val: [xMin, xMax], def: [true, true]}, yRange: {val:[yMin, yMax], def:[true, true]}}, undecidedU, debug);
            
            //paintCoorColor(coor, {xRange: {val: [left, right], def: [true, true]}, yRange: {val:[bottom, top], def:[true, true]}}, "#FF0000");
            //strokeCoorRegion(coor, {xRange: {val: [left, right], def: [true, true]}, yRange: {val:[bottom, top], def:[true, true]}}, "#FFFF00");
            
            while(k >= 0 && !!U && U.length > 0){
                U = refinePixels(coor, r, U, undecidedU, debug);
                k--;
            }
            
            handleRestU(coor, r, undecidedU.concat(U));
            //var r = confirm("k = {0}, return new data? ".format(k));
            return data;
        }
    };  

    // Expose Plotter to the global object
    window.Plotter = Plotter;
})(zizhujy.com.Console);