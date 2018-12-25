//*************************************************************************
// jPloter-Editor
//
// Version: 1.0
// Copyright (c) 2011 - jeff@zizhujy.com
// http://www.zizhujy.com
//
// Usage: A plugin that enhanced jPloter to let it works well with EditArea
//
// using jPloter.js
// using editarea.js
// 
(function(jPloter, eAL) {

    jPloter.prototype.plugin = function() {       
        var jP = this;

        // Detect if the editor is toggled on
        function editorToggledOn (id) {
            var editor = document.getElementById("frame_" + id);
            var $Editor = $(editor);
            return editor && ($Editor.css("display") != "none");
        }
        
        //
        // 获取用户输入
        //
        jPloter.prototype.getUserInput = function () {
            if (this.uiReady()) {
                var toggledOffByMe = false;
                if(editorToggledOn()){
                    eAL.toggle_off(this.config.inputBoardId);
                    toggledOffByMe = true;
                }

                this.dataCenter.userInput = this.ui.$InputBoard.attr("value");
                 
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
            var toggledXOffByMe = false;
            var toggledYOffByMe = false;

            if(editorToggledOn(jP.config.inputBoardId)){
                eAL.toggle_off(jP.config.inputBoardId);
                toggledOffByMe = true;
            }

            if(editorToggledOn("xValues")){
                eAL.toggle_off("xValues");
                toggledXOffByMe = true;
            }

            if(editorToggledOn("yValues")){
                eAL.toggle_off("yValues");
                toggledYOffByMe = true;
            }

            jP.ui.$InputBoard.attr("value", "");

            $("#" + jP.config.inputBoardId).trigger("change");

            if(toggledOffByMe){
                eAL.toggle_on(jP.config.inputBoardId);
            }
            if(toggledXOffByMe){
                eAL.toggle_on("xValues");
            }
            if(toggledYOffByMe){
                eAL.toggle_on("yValues");
            }

            jP.run();
        };

        $("#taExpression").change(function() {
            var expression = $("#taExpression").val();
            var toggledXOffByMe = false;
            var toggledYOffByMe = false;

            try{
                if(editorToggledOn("xValues")){
                    eAL.toggle_off("xValues");
                    toggledXOffByMe = true;
                }

                if(editorToggledOn("yValues")){
                    eAL.toggle_off("yValues");
                    toggledYOffByMe = true;
                }

                if(expression.length > 0) {
                    eval(expression);

                    $("#xValues").val(x.toString("\r\n"));
                    $("#yValues").val(y.toString("\r\n"));
                }else{
                    $("#xValues").val("");
                    $("#yValues").val("");
                }
            }catch(ex){                
                $("#xValues").val("");
                $("#yValues").val("");
            }finally {
                if(toggledXOffByMe){
                    eAL.toggle_on("xValues");
                }
                if(toggledYOffByMe){
                    eAL.toggle_on("yValues");
                }

                jP.run();
            }
        });

        function changeExpression() {
            var x = $("#xValues").val().toString().trim().replace(/\n/g, ", ").trim();
            var y = $("#yValues").val().toString().trim().replace(/\n/g, ", ").trim();
            if(x[x.length-1] == ",") x = x.substring(0, x.length - 1);
            if(y[y.length - 1] == ",") y = y.substring(0, y.length - 1);
            var expression = String.format("var x = [{0}];\r\n\r\nvar y = [{1}];", x, y);
            
            var toggledOffByMe = false;
            if(editorToggledOn("taExpression")){
                eAL.toggle_off("taExpression");
                toggledOffByMe = true;
            }

            $("#taExpression").val(expression);

            if(toggledOffByMe) {
                eAL.toggle_on("taExpression");
            }

            jP.run();
        }

        $("#xValues").change(changeExpression);
        $("#yValues").change(changeExpression);

        $("#taExpression").trigger("change");
    };
})(JPloter, eAL);