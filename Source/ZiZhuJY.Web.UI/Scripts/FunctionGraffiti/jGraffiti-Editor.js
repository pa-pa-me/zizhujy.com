//*************************************************************************
// jGraffiti-Editor
//
// Version: 1.0
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: A plugin that enhanced jGraffit to let it works well with EditArea
//
// using jGraffiti.js
// using editarea.js
// 
(function(jGraffiti, eAL) {

    jGraffiti.prototype.plugin = function() {       
        var jG = this;

        // Detect if the editor is toggled on
        function editorToggledOn () {
            var editor = document.getElementById("frame_" + jG.config.inputBoardId);
            var $Editor = $(editor);
            return editor && ($Editor.css("display") != "none");
        }
        
        //
        // 获取用户输入
        //
        jGraffiti.prototype.getUserInput = function () {
            if (this.uiReady()) {
                var toggledOffByMe = false;
                if(editorToggledOn()){
                    eAL.toggle_off(this.config.inputBoardId);
                    toggledOffByMe = true;
                }

                this.dataCenter.userInput = this.processUserInput(this.ui.$InputBoard.attr("value"));
                 
                if(toggledOffByMe) {
                    eAL.toggle_on(this.config.inputBoardId);
                }

                return this.dataCenter.userInput;
            } else {
                return "";
            }
        };

        // Reset Button Click
        this.ui.reset = function() {
            var toggledOffByMe = false;
            if(editorToggledOn()){
                eAL.toggle_off(jG.config.inputBoardId);
                toggledOffByMe = true;
            }

            jG.ui.$InputBoard.attr("value", "");

            if(toggledOffByMe){
                eAL.toggle_on(jG.config.inputBoardId);
            }

            jG.run();
        };
            
        jGraffiti.prototype.graph = function(functions, minOfx, maxOfx, minOfy, maxOfy, minOft, maxOft, points) {
            if(functions != undefined) {
                var toggledOffByMe = false;
                if(editorToggledOn()){
                    eAL.toggle_off(this.config.inputBoardId);
                    toggledOffByMe = true;
                }

                this.ui.$InputBoard.attr("value", functions);

                if(toggledOffByMe) {
                    eAL.toggle_on(this.config.inputBoardId);
                }else{
                    this.ui.$InputBoard.focus();
                }
            }

            if(minOfx != undefined) {
                this.ui.RangeX.$Min.attr("value", minOfx);
            }

            if(maxOfx != undefined) {
                this.ui.RangeX.$Max.attr("value", maxOfx);
            }

            if(minOfy != undefined) {
                this.ui.RangeY.$Min.attr("value", minOfy);
            }

            if(maxOfy != undefined) {
                this.ui.RangeY.$Max.attr("value", maxOfy);
            }

            if(minOft != undefined) {
                this.ui.RangeT.$Min.attr("value", minOft) ;
            }

            if(maxOft != undefined) {
                this.ui.RangeT.$Max.attr("value", maxOft);
            }

            if(points != undefined) {
                this.ui.$PointsCount.attr("value", points);
            }

            var originState = this.config.autoComputeRangeY;
            if(arguments.length >= 9) {
                var autoComputeYRange = arguments[8];
                this.config.autoComputeRangeY = autoComputeYRange;
            } 

            this.run();

            this.config.autoComputeRangeY = originState;
        };
    };
})(JGraffiti, eAL);