;(function (LaTexLex) {
    if(typeof zizhujy == "undefined") zizhujy = {};
    window.zizhujy = zizhujy;

    if(typeof zizhujy.com == "undefined") zizhujy.com = {};
    if(typeof zizhujy.com.LaTexParser == "undefined") zizhujy.com.LaTexParser = {
        version: 1.0,
        source: "",
        errorList: [],
        logBuffer: new StringBuffer(),
        nextToken: null, // new lex.TokenLexemeStruct(lex.TokenEnum.NONSENSE, ""), //new zizhujy.com.LaTexLex.TokenLexemeStruct(zizhujy.com.LaTexLex.TokenEnum.NONSENSE, ""), //new this.lex.TokenLexemeStruct(this.lex.TokenEnum.NONSENSE, ""), 
        tree: null,
        currentNode: null,
        tempNode: null,

        init: function(source) {
            this.source = source;
            this.nextToken = new LaTexLex.TokenLexemeStruct(LaTexLex.TokenEnum.NONSENSE, "");
            this.errorList.clear();
            this.logBuffer = new StringBuffer();
            this.tree = null;
            this.currentNode = null;
            this.tempNode = null;
            LaTexLex.init(source);
        },

        /// <summary>
        ///     词法分析程序
        /// </summary>
        /// <param name="buildNewLeaf" type="Boolean">可选。是否在获取下一个标记前，为语法分析树建立新的结点，默认false</param>
        /// <param name="preLex" type="Function">可选。在获取下一个标记前，需要做的自定义操作</param>
        /// <remark>
        ///     该方法有多个重载：
        ///         1. lex();
        ///         2. lex(true);
        ///         3. lex(function() {alert('hello');}, params);
        ///         4. lex(true, function() {alert('hello');}， params);
        ///         5. lex(context, function() {alert(context);}, params);
        ///         6. lex(true, context, function () {alert(context);}, params);
        ///         7. lex(true, nodeTypeEnum.Unknown);
        /// </remark>
        lex: function() {
            var buildNewLeaf = false;
            var preLex = function() {};
            var context = window;
            var args = Array.prototype.slice.call(arguments);
            var nodeType = null;

            if(arguments.length > 0) {
                switch(typeof arguments[0]) {
                    case "boolean":
                        buildNewLeaf = arguments[0];
                        switch(typeof arguments[1]){
                            case "object":
                                if(arguments.length > 1) {
                                    context = arguments[1];
                                    switch(typeof arguments[2]) {
                                        case "function":
                                            // 重载 6： lex(true, context, function () {alert(context);}, params);
                                            preLex = arguments[2];
                                            args.splice(0, 3);
                                            break;
                                        default:
                                            // lex(true, context); ==> lex(true);
                                            break;
                                    }
                                } else {
                                    nodeType = arguments[1];
                                }
                                break;
                            case "function":
                                // 重载 4： lex(true, function() {alert('hello');}， params);
                                preLex = arguments[1];
                                args.splice(0, 2);
                            default:
                                break;
                        }
                        break;
                    case "function":
                        // 重载 3： lex(function() {alert('hello');}, params);
                        preLex = arguments[0];
                        args.splice(0, 1);
                    default:
                        break;
                }
            }
            
            if(buildNewLeaf) {
                if(!!nodeType) this.newLeafForTree(nodeType);
                else this.newLeafForTree();
            }
                
            preLex.apply(context, args);

            this.nextToken = LaTexLex.lex();
            this.log("Call lex /* returns {0} */".format(!!this.nextToken ? this.nextToken.lexeme : "<null>"));
            while(!this.nextToken) {
                this.nextToken = LaTexLex.lex();                
                this.log("Call lex /* returns {0} */".format(!!this.nextToken ? this.nextToken.lexeme : "<null>"));
            }     
        },

        log: function(message){
            this.logBuffer.append(message);  
        },

        /// <summary> 
        ///     异常类
        /// </summary>
        /// <param name="errorEnum">错误枚举信息。可以是单独的一个枚举，也可以是一个错误枚举数组。如果是一个数组，则说明错误可能是其中的一个。</param>
        /// <param name="index">可选。错误出现的索引位置。</param>
        Exception: function(errorEnum, index) {
            this.errorEnum = zizhujy.com.LaTexParser.errorEnum.UNKNOWN_ERROR;
            if(arguments.length>0) this.errorEnum = arguments[0];
            this.index = LaTexLex.index - zizhujy.com.LaTexParser.nextToken.lexeme.length;
            if(arguments.length > 1) this.index = arguments[1];
            this.context = zizhujy.com.LaTexParser.source.substring(this.index >= 10 ? this.index - 10 : 0, this.index) + zizhujy.com.LaTexParser.source.substring(this.index, this.index + 1) + zizhujy.com.LaTexParser.source.substr(this.index+1, 10);
            this.contextIndicator = "-".duplicate(this.index >= 10 ? 10 : this.index) + "^" + "-".duplicate(10);
            this.contextHTML = zizhujy.com.LaTexParser.source.substring(this.index >= 10 ? this.index - 10 : 0, this.index).replace(/ /g, "&nbsp;") + "<span style=\"color: red; font-weight: bold; font-size: larger;\">{0}</span>".format(zizhujy.com.LaTexParser.source.substring(this.index, this.index + 1).replace(/ /g, "&nbsp;")) + zizhujy.com.LaTexParser.source.substr(this.index+1, 10).replace(/ /g, "&nbsp;");
            this.actualToken = zizhujy.com.LaTexParser.nextToken;

            if(!this.__initialized__){
                zizhujy.com.LaTexParser.Exception.prototype.__calculateRowCol__ = function() {
                    var rowDelimiter = "\r\n";
                    if(arguments.length > 0) rowDelimiter = arguments[0];
                    
                    var source = zizhujy.com.LaTexParser.source;
                    var row = 1;
                    var col = 1;
                    var colStartIndex = 0;
                    for(var i = 0; i < this.index - rowDelimiter.length + 1; i++) {
                        if(source.substr(i, rowDelimiter.length) == rowDelimiter) {
                            row++;
                            colStartIndex = i;
                        }
                    }
                    col += i - colStartIndex;

                    this.__rowCache__ = row;
                    this.__colCache__ = col;
                };

                zizhujy.com.LaTexParser.Exception.prototype.row = function() {
                    if(!this.__rowCache__) {
                        this.__calculateRowCol__();
                    }

                    return this.__rowCache__;
                };

                zizhujy.com.LaTexParser.Exception.prototype.col = function() {
                    if(!this.__colCache__){
                        this.__calculateRowCol__();
                    }

                    return this.__colCache__;
                };
                this.__initialized__ = true;
            }
        },

        nodeTypeEnum: {
            EXPLICIT_FUNCTION_LIST: {value: 0, name: "Explicit Function List"},
            FUNCTION_BODY: {value: 1, name: "Function Body"},
            RHS_XT: {value: 2, name: "RHS_xt"},
            RHS_YT: {value: 3, name: "RHS_yt"},
            RHS_XY: {value: 4, name: "RHS_xy"},
            ITEM_XT: {value: 5, name: "Item_xt"},
            ITEM_YT: {value: 6, name: "Item_yt"},
            ITEM_XY: {value: 7, name: "Item_xy"},
            FACTOR_XT: {value: 8, name: "Factor_xt"},
            FACTOR_YT: {value: 9, name: "Factor_yt"},
            FACTOR_XY: {value: 10, name: "Factor_xy"},
            PRIORITY_FACTOR_XT: {value: 11, name: "Priority Factor_xt"},
            PRIORITY_FACTOR_YT: {value: 12, name: "Priority Factor_yt"},
            PRIORITY_FACTOR_XY: {value: 13, name: "Priority Factor_xy"},
            LATEX_EXP_XT: {value: 14, name: "LaTex Expression_xt"},
            LATEX_EXP_YT: {value: 15, name: "LaTex Expression_yt"},
            LATEX_EXP_XY: {value: 16, name: "LaTex Expression_xy"},
            FUNCTION_EXP_XT: {value: 17, name: "Function Expression_xt"},
            FUNCTION_EXP_YT: {value: 18, name: "Function Expression_yt"},
            FUNCTION_EXP_XY: {value: 19, name: "Function Expression_xy"},
            VAR_X: {value: 20, name: "Variable x"},
            VAR_Y: {value: 21, name: "Variable y"},
            VAR_T: {value: 22, name: "Variable t"},
            CONSTANT_VALUE: {value: 23, name: "Constant Value"},
            DIGITAL_NUMBER: {value: 24, name: "Digital Number"},
            SEMICOLON: {value: 25, name: "Semicolon"},
            OTHER_LEXEME: {value: 26, name: "Other Lexeme"},

            UNKNOWN: {value: 99, name: "Unknown"}
        },

        TreeNode: function(nodeType, expression, parent, children) {
            this.nodeType = zizhujy.com.LaTexParser.nodeTypeEnum.UNKNOWN;
            this.expression = "";
            this.parent = null;
            this.children = [];

            if(arguments.length > 0) this.nodeType = arguments[0];
            if(arguments.length > 1) this.expression = arguments[1];
            if(arguments.length > 2) {  
                if(arguments[2] == null || arguments[2] instanceof zizhujy.com.LaTexParser.TreeNode)
                    this.parent = arguments[2];
            }
            if(arguments.length > 3) {
                if(arguments[2] instanceof Array){
                    for(var i = 0; i < arguments[3].length; i++) {
                        if(arguments[3][i] instanceof zizhujy.com.LaTexParser.TreeNode)
                            this.children.push(arguments[3][i]);
                    }
                }else{
                    if(arguments[3] instanceof zizhujy.com.LaTexParser.TreeNode)
                        this.children.push(arguments[3]);
                }
            }

            if(! this.__initialized__){
                zizhujy.com.LaTexParser.TreeNode.prototype.addChildren = function(children){
                    if(children instanceof Array){
                        for(var i = 0; i < children.length; i++){
                            if(children[i] instanceof zizhujy.com.LaTexParser.TreeNode)
                                this.children.push(children[i]);
                        }
                    }else{
                        if(children instanceof zizhujy.com.LaTexParser.TreeNode)
                            this.children.push(children);
                    }
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.eval = function(){
                    if(!this.evalCache) {
                        var isValid = true;
                        try{
                            switch(this.nodeType) {
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTANT_VALUE:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.DIGITAL_NUMBER:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.OTHER_LEXEME:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.VAR_T:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.VAR_X:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.VAR_Y:
                                    this.evalCache = this.getExpression();
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.PRIORITY_FACTOR_XT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.PRIORITY_FACTOR_XY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.PRIORITY_FACTOR_YT:                                                                                                   
                                    var sb = new StringBuffer();
                                    if(!!this.children[0]) {
                                        var first = this.children[0].eval();
                                        if(first == "{") {
                                            sb.append("(");
                                            for(var i = 1; i < this.children.length - 1; i++) {
                                                sb.append(this.children[i].eval());
                                                isValid = isValid && this.children[i].isValid();
                                            }
                                            var last = this.children[this.children.length-1].eval();
                                            if(last == "}") {
                                                sb.append(")");
                                                isValid = isValid && true;
                                            }else {
                                                isValid = false;
                                            }
                                        } else {
                                            for(var i = 0; i < this.children.length; i++) {
                                                sb.append(this.children[i].eval());
                                                isValid = isValid && this.children[i].isValid();
                                            }
                                        }
                                    } else {
                                        isValid = false;
                                    }
                                    this.evalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.EXPLICIT_FUNCTION_LIST:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FACTOR_XT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FACTOR_XY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FACTOR_YT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FUNCTION_BODY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FUNCTION_EXP_XT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FUNCTION_EXP_XY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FUNCTION_EXP_YT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.ITEM_XT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.ITEM_XY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.ITEM_YT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.RHS_XT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.RHS_XY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.RHS_YT:
                                    var sb = new StringBuffer();
                                    for(var i = 0; i < this.children.length; i++) {
                                        sb.append(this.children[i].eval());
                                        isValid = isValid && this.children[i].isValid();
                                    }
                                    this.evalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.LATEX_EXP_XT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.LATEX_EXP_XY:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.LATEX_EXP_YT:
                                    isValid = isValid && this.children[0].isValid();
                                    switch(this.children[0].expression){
                                        case "\\frac":
                                            this.evalCache = "({0})/({1})".format(this.children[2].eval(), this.children[5].eval());
                                            isValid = isValid && this.children[2].isValid();
                                            isValid = isValid && this.children[5].isValid();
                                            break;
                                        case "\\sqrt":
                                            this.evalCache = "sqrt({0})".format(this.children[2].eval());
                                            isValid = isValid && this.children[2].isValid();
                                            break;
                                        default:
                                            this.evalCache = "[Not Recognized LaTex]";
                                            isValid = false;
                                            break;
                                    }
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.UNKNOWN:
                                default:
                                    this.evalCache = "[Unknown Node Type]";
                                    isValid = false;
                                    break;
                            }
                        } catch (ex) {
                            this.evalCache = "[Error Thrown]";
                            isValid = false;
                        } finally {
                            this.isValidCache = isValid;
                        }
                    }
                    return this.evalCache;
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.isValid = function() {
                    if(!this.isValidCache)
                        this.eval();
                    
                    return this.isValidCache;                        
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.getExpression = function(){
                    var sb = new StringBuffer();
                    sb.append(this.expression);
                    for(var i = 0; i < this.children.length; i++) {
                        sb.append(this.children[i].getExpression());
                    }
                    return sb.toString();
                };

                this.__initialized__ = true;
            }

            if(parent != null && parent instanceof zizhujy.com.LaTexParser.TreeNode)
                parent.addChildren(this);
        },

        newLeafForTree: function() {
            var nodeType = this.nodeTypeEnum.OTHER_LEXEME;
            if(arguments.length > 0) nodeType = arguments[0];
            new this.TreeNode(nodeType, this.nextToken.lexeme, this.currentNode);
            this.log(String.format("-- New Leaf Added: {0}", this.nextToken.lexeme));
        },

        /// <summary>
        ///     记录语法分析中出现的错误
        /// </summary>
        /// <param name="ex">错误信息。它可以是一个 Exception 类的实例，或者是一个errorEnum中的某个枚举类型。</param>
        error: function(ex) {
            if(ex instanceof this.Exception) {
                this.errorList.push(ex);
                var sb = new StringBuffer();
                if(ex.errorEnum instanceof Array){
                    for(var i = 0; i < ex.errorEnum.length; i++) {
                        sb.append(ex.errorEnum[i].message);
                    }
                }else
                    sb.append(ex.errorEnum.message);
                this.log("!!Error: {0}".format(sb.toString(" Or ")));
            }
            else if(!!ex && !!ex.message) {
                this.errorList.push(new this.Exception(ex));
                this.log("!!Error: {0}".format(ex.message));
            }
            else {
                this.errorList.push(new this.Exception(this.errorEnum.UNKNOWN_ERROR));
                this.log("!!Error: {0}".format(this.errorEnum.UNKNOWN_ERROR.message));
            }

            this.newLeafForTree(this.nodeTypeEnum.UNKNOWN);
        },

        run: function() {
            if( !LaTexLex.eos() ) {//this.nextToken.token != LaTexLex.TokenEnum.End_Of_Source) {
                this.lex();
                //this.explicitFunctionLaTex();
                this.explicitFunctionList();
            }
        },        

        /// <summary>
        ///     显函数列表
        ///     按照如下规则解析语言中的字符串：
        ///     <显函数列表> -> {;}[<函数体>{;<函数体>}]
        /// </summary>
        /// <remark>
        /// </remark>
        explicitFunctionList: function() {
            this.log("Enter <显函数列表>");            
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.EXPLICIT_FUNCTION_LIST, "", this.currentNode);
            this.tree = this.currentNode;

            while(this.nextToken.token == LaTexLex.TokenEnum.SEMICOLON) { 
                this.lex(true, this.nodeTypeEnum.SEMICOLON);
            }
            /*
            if(!LaTexLex.eos()) {
                this.functionBody();
                    
                while(this.nextToken.token == LaTexLex.TokenEnum.SEMICOLON) {
                    this.lex(true);
                    if(this.nextToken.token != LaTexLex.TokenEnum.SEMICOLON) {
                        if(!LaTexLex.eos())
                            this.functionBody();
                    } else
                        this.lex(true);
                }

                if(!LaTexLex.eos())
                    this.error(this.errorEnum.SEMICOLON_EXPECTED);
            }else{
                // Done
            }*/
            // Another approach:
            
            this.functionBody();
            while(!LaTexLex.eos()){
                while(this.nextToken.token == LaTexLex.TokenEnum.SEMICOLON) {
                    this.lex(true, this.nodeTypeEnum.SEMICOLON);
                    if(this.nextToken.token != LaTexLex.TokenEnum.SEMICOLON) {
                        if(this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                            this.functionBody();
                        }
                    } else
                        this.lex(true, this.nodeTypeEnum.SEMICOLON);
                }
                if(!LaTexLex.eos()) {
                    this.error(this.errorEnum.SEMICOLON_EXPECTED);
                    this.lex(true);
                    this.functionBody();
                }
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <显函数列表>");
        },

        /// <summary>
        ///     函数体
        ///     按照如下规则解析语言中的字符串：
        ///     <函数体> -> x = <OuterRHS_xt>
        ///                 | y = <OuterRHS_yt>
        ///                 | {x = <OuterRHS_xy>; y = <OuterRHS_xy>}
        ///                 | ;
        /// </summary>
        functionBody: function() {
            this.log("Enter <函数体>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FUNCTION_BODY, "", this.currentNode);
            
            switch(this.nextToken.token) {
                case LaTexLex.TokenEnum.x:
                    // parse Equal sign
                    this.lex(true, this.nodeTypeEnum.VAR_X);
                    if(this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                        // parse <RHS_xt>
                        this.lex(true);
                        this.RHS_xt();
                    }else
                        this.error(new this.Exception(this.errorEnum.EVALUATION_OPERATOR_EXPECTED));
                    break;
                case LaTexLex.TokenEnum.y:
                    // parse equal sign:
                    this.lex(true, this.nodeTypeEnum.VAR_Y);
                    if(this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR){
                        this.lex(true);
                        this.RHS_yt();
                    }else
                        this.error(new this.Exception(this.errorEnum.EVALUATION_OPERATOR_EXPECTED));
                    break;
                case LaTexLex.TokenEnum.OPEN_BRACE:
                    // parse x
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.x){
                        // parse equal sign
                        this.lex(true);
                        if(this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                            // parse <RHS_xy>
                            this.lex(true);
                            this.RHS_xy();
                            // parse ;
                            if(this.nextToken.token == LaTexLex.TokenEnum.SEMICOLON) {
                                // parse y
                                this.lex(true, this.nodeTypeEnum.SEMICOLON);
                                if(this.nextToken.token == LaTexLex.TokenEnum.y) {
                                    // parse equal sign
                                    this.lex(true, this.nodeTypeEnum.VAR_Y);
                                    if(this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                                        // parse <RHS_xy>
                                        this.lex(true);
                                        this.RHS_xy();
                                        // parse }
                                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                                            // Done
                                            this.lex(true);
                                        }else{
                                            this.error(new this.Exception(this.errorEnum.CLOSING_BRACE_EXPECTED));
                                        }
                                    }else
                                        this.error(new this.Exception(this.errorEnum.EVALUATION_OPERATOR_EXPECTED));
                                }else 
                                    this.error(new this.Exception(this.errorEnum.DEPENDENT_VAR_Y_EXPECTED));
                            }else 
                                this.error(new this.Exception(this.errorEnum.SEMICOLON_EXPECTED));
                        }else
                            this.error(new this.Exception(this.errorEnum.EVALUATION_OPERATOR_EXPECTED));
                    }else
                        this.error(new this.Exception(this.errorEnum.DEPENDENT_VAR_X_EXPECTED));
                    break;
                case LaTexLex.TokenEnum.SEMICOLON:
                    this.lex(true, this.nodeTypeEnum.SEMICOLON);
                    break;
                default:
                    this.error(new this.Exception([this.errorEnum.DEPENDENT_VAR_X_EXPECTED, this.errorEnum.DEPENDENT_VAR_Y_EXPECTED, this.errorEnum.OPEN_BRACE_EXPECTED]));
                    break;
            } // end switch(this.nextToken.token)

            this.currentNode = this.currentNode.parent;
            this.log("Exit <函数体>");
        },

        /// <summary>
        ///     RHS_xt
        ///     按照如下规则解析语言中的字符串：
        ///     <RHS_xt> -> <项_xt>{(+|-)<项_xt>}
        /// </summary>
        RHS_xt: function(){
            this.log("Enter <RHS_xt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.RHS_XT, "", this.currentNode);

            this.item_xt();
            while(this.nextToken.token == LaTexLex.TokenEnum.PLUS_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.MINUS_OPERATOR){
                this.lex(true);
                this.item_xt();
            }

            this.lex(true);

            this.currentNode= this.currentNode.parent;
            this.log("Exit <RHS_xt>");
        },

        /// <summary>
        ///     项_xt
        ///     按照如下规则解析语言中的字符串：
        ///     <项_xt> -> <因子_xt>{(*|/)<因子_xt>}
        /// </summary>
        item_xt: function(){
            this.log("Enter <item_xt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.ITEM_XT, "", this.currentNode);

            this.factor_xt();
            while(this.nextToken.token == LaTexLex.TokenEnum.MULTIPLY_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.DIVIDE_OPERATOR){
                this.lex(true);
                this.factor_xt();
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <item_xt>");
        },

        /// <summary>
        ///     因子_xt
        ///     按照如下规则解析语言中的字符串：
        ///     <因子_xt> -> <高级因子_xt>{^<高级因子_xt>}
        /// </summary>
        factor_xt: function() {
            this.log("Enter <因子_xt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FACTOR_XT, "", this.currentNode);

            this.priorityFactor_xt();
            while(this.nextToken.token == LaTexLex.TokenEnum.POWER_OPERATOR){
                this.lex(true);
                this.priorityFactor_xt();
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <因子_xt>");
        },
        
        /// <summary>
        ///     高级因子_xt
        ///     按照如下规则解析语言中的字符串：
        ///     <高级因子_xt> -> (<RHS_xt>)
        ///                     |{<RHS_xt>}
        ///                     |<LaTex表达式_xt>
        ///                     |[(+|-)]<数字>
        ///                     |[(+|-)]y<变量_xt>
        ///                     |[(+|-)]<常量>
        ///                     |<函数_xt>
        /// </summary>
        priorityFactor_xt: function() {
            this.log("Enter <高级因子_xt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.PRIORITY_FACTOR_XT, "", this.currentNode);

            switch(this.nextToken.token){
                case LaTexLex.TokenEnum.OPEN_PARENTHESIS:
                    this.lex(true);
                    this.RHS_xt();
                    if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {this.lex(true);}
                    else
                        this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.OPEN_BRACE:
                    this.lex(true);
                    this.RHS_xt();
                    if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {this.lex(true);}
                    else
                        this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.LATEX_NAME:
                    this.laTexExpression_xt();
                    break;
                case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                    this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                    break;
                case LaTexLex.TokenEnum.CONSTANT_VALUE:
                    this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                    break;
                case LaTexLex.TokenEnum.y:
                    this.lex(true, this.nodeTypeEnum.VAR_Y);
                    break;
                case LaTexLex.TokenEnum.FUNCTION_NAME:
                    this.functionExpression_xt();
                    break;
                case LaTexLex.TokenEnum.PLUS_OPERATOR:
                case LaTexLex.TokenEnum.MINUS_OPERATOR:
                    this.lex(true);
                    switch (this.nextToken.token) {
                        case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                            this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                            break;
                        case LaTexLex.TokenEnum.y:
                            this.lex(true, this.nodeTypeEnum.VAR_Y);
                            break;
                        case LaTexLex.TokenEnum.CONSTANT_VALUE:
                            this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                            break;
                        default:
                            this.error(new this.Exception([this.errorEnum.DIGITAL_NUMBER_EXPECTED, this.errorEnum.VAR_Y_EXPECTED]));
                            break;
                    } // end of switch
                    break;
                default:
                    this.error(new this.Exception([this.errorEnum.OPEN_PARENTHESIS_EXPECTED, this.errorEnum.LATEX_EXPRESSION_EXPECTED, this.errorEnum.DIGITAL_NUMBER_EXPECTED
                    , this.errorEnum.VAR_Y_EXPECTED, this.errorEnum.FUNCTION_EXPECTED]));
                    break;
            }// end switch
            this.currentNode = this.currentNode.parent;
            this.log("Exit <高级因子_xt>");
        },        
        
        /// <summary>
        ///     LaTex表达式_xt
        ///     按照如下规则解析语言中的字符串：
        ///     <LaTex表达式_xt> -> \frac{<RHS_xt>}{RHS_xt}
        ///                         |\sqrt{<RHS_xt>}
        /// </summary>
        laTexExpression_xt: function() {
            this.log("Enter <LaTex表达式_xt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.LATEX_EXP_XT, "", this.currentNode);
            switch(this.nextToken.lexeme){
                case "\\frac":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                        this.lex(true);
                        this.RHS_xt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                            this.lex(true);
                            if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                                this.lex(true);
                                this.RHS_xt();
                                if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                                    this.lex(true);
                                } else
                                    this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                            }else
                                this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                        }else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    break;
                case "\\sqrt":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                        this.lex(true);
                        this.RHS_xt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE)  {
                            this.lex(true);
                        } else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    break;
                default:
                    this.lex(true);
                    break;
            }// end switch
            this.currentNode = this.currentNode.parent;
            this.log("Exit <LaTex表达式_xt>");
        },
        
        /// <summary>
        ///     函数表达式_xt
        ///     按照如下规则解析语言中的字符串：
        ///     <函数表达式_xt> -> sin(<RHS_xt>) | cos(<RHS_xt>) | tan(<RHS_xt>) | cot(<RHS_xt>) | ln(<RHS_xt>) | log(<RHS_xt>, <RHS_xt>)
        ///                     | sqrt(<RHS_xt>)
        /// </summary>
        functionExpression_xt: function() {
            this.log("Enter <函数表达式_xt>");            
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FUNCTION_EXP_XT, "", this.currentNode);
            switch(this.nextToken.lexeme){
                case "sin":
                case "cos":
                case "tan":
                case "cot":
                case "ln":
                case "sqrt":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS){
                        this.lex(true);
                        this.RHS_xt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                            this.lex(true); 
                        } else
                            this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    break;
                case "log":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS){
                        this.lex(true);
                        this.RHS_xt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.COMMA) {
                            this.lex(true);
                            this.RHS_xt();
                            if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                                this.lex(true);
                            } else
                                this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                        }else
                            this.error(this.errorEnum.COMMA_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    break;
                default:
                    this.lex();
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <函数表达式_xt>");
        },

        /// <summary>
        ///     RHS_yt
        ///     按照如下规则解析语言中的字符串：
        ///     <RHS_yt> -> <项_yt>{(+|-)<项_yt>}
        /// </summary>
        RHS_yt: function(){
            this.log("Enter <RHS_yt>");            
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.RHS_YT, "", this.currentNode);

            this.item_yt();
            while(this.nextToken.token == LaTexLex.TokenEnum.PLUS_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.MINUS_OPERATOR){
                this.lex(true);
                this.item_yt();
            }            
            
            this.currentNode=this.currentNode.parent;
            this.log("Exit <RHS_yt>");
        },        

        /// <summary>
        ///     项_yt
        ///     按照如下规则解析语言中的字符串：
        ///     <项_yt> -> <因子_yt>{(*|/)<因子_yt>}
        /// </summary>
        item_yt: function() {
            this.log("Enter <item_yt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.ITEM_YT, "", this.currentNode);
            this.factor_yt();
            while(this.nextToken.token == LaTexLex.TokenEnum.MULTIPLY_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.DIVIDE_OPERATOR){
                this.lex(true);
                this.factor_yt();
            }
            this.currentNode=this.currentNode.parent;
            this.log("Exit <item_yt>");
        },        

        /// <summary>
        ///     因子_yt
        ///     按照如下规则解析语言中的字符串：
        ///     <因子_yt> -> <高级因子_yt>{^<高级因子_yt>}
        /// </summary>
        factor_yt: function() {
            this.log("Enter <因子_yt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FACTOR_YT, "", this.currentNode);
            this.priorityFactor_yt();
            while(this.nextToken.token == LaTexLex.TokenEnum.POWER_OPERATOR){
                this.lex(true);
                this.priorityFactor_yt();
            }
            this.currentNode=this.currentNode.parent;
            this.log("Exit <因子_yt>");
        },        
        
        /// <summary>
        ///     高级因子_yt
        ///     按照如下规则解析语言中的字符串：
        ///     <高级因子_yt> -> (<RHS_yt>) 左递归！！！
        ///                     |{<RHS_yt>} 左递归！！！
        ///                     |<LaTex表达式_yt>
        ///                     |[(+|-)]<数字>
        ///                     |[(+|-)]x<变量_yt>
        ///                     |[(+|-)]<常量>
        ///                     |<函数_yt>
        /// </summary>
        priorityFactor_yt: function() {
            this.log("Enter <高级因子_yt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.PRIORITY_FACTOR_YT, "", this.currentNode);
            switch(this.nextToken.token){
                case LaTexLex.TokenEnum.OPEN_PARENTHESIS:
                    this.lex(true);
                    this.RHS_yt();
                    if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) this.lex(true);
                    else
                        this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.OPEN_BRACE:
                    this.lex(true);
                    this.RHS_yt();
                    if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {this.lex(true);}
                    else
                        this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.LATEX_NAME:
                    this.laTexExpression_yt();
                    break;
                case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                    this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                    break;
                case LaTexLex.TokenEnum.x:
                    this.lex(true, this.nodeTypeEnum.VAR_X);
                    break;
                case LaTexLex.TokenEnum.CONSTANT_VALUE:
                    this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                    break;
                case LaTexLex.TokenEnum.FUNCTION_NAME:
                    this.functionExpression_yt();
                    break;
                case LaTexLex.TokenEnum.PLUS_OPERATOR:
                case LaTexLex.TokenEnum.MINUS_OPERATOR:
                    this.lex(true);
                    switch (this.nextToken.token) {
                        case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                            this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                            break;
                        case LaTexLex.TokenEnum.x:
                            this.lex(true, this.nodeTypeEnum.VAR_X);
                            break;
                        case LaTexLex.TokenEnum.CONSTANT_VALUE:
                            this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                            break;
                        default:
                            this.error(new this.Exception([this.errorEnum.DIGITAL_NUMBER_EXPECTED, this.errorEnum.VAR_X_EXPECTED]));
                            break;
                    } // end of switch
                    break;
                default:
                    this.error(new this.Exception([this.errorEnum.OPEN_PARENTHESIS_EXPECTED, this.errorEnum.LATEX_EXPRESSION_EXPECTED, this.errorEnum.DIGITAL_NUMBER_EXPECTED
                    , this.errorEnum.VAR_X_EXPECTED, this.errorEnum.FUNCTION_EXPECTED]));
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <高级因子_yt>");
        },                 
        
        /// <summary>
        ///     LaTex表达式_yt
        ///     按照如下规则解析语言中的字符串：
        ///     <LaTex表达式_yt> -> \frac{<RHS_yt>}{RHS_yt}
        ///                         |\sqrt{<RHS_yt>}
        /// </summary>
        laTexExpression_yt: function() {
            this.log("Enter <LaTex表达式_yt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.LATEX_EXP_YT, "", this.currentNode);
            switch(this.nextToken.lexeme){
                case "\\frac":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                        this.lex(true);
                        this.RHS_yt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                            this.lex(true);
                            if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                                this.lex(true);
                                this.RHS_yt();
                                if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                                    this.lex(true); 
                                } else
                                    this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                            }else
                                this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                        }else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    break;
                case "\\sqrt":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                        this.lex(true);
                        this.RHS_yt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE)  {
                            this.lex(true); 
                        } else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    break;
                default:
                    this.lex(true);
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <LaTex表达式_yt>");
        },        
        
        /// <summary>
        ///     函数表达式_yt
        ///     按照如下规则解析语言中的字符串：
        ///     <函数表达式_yt> -> sin(<RHS_yt>) | cos(<RHS_yt>) | tan(<RHS_yt>) | cot(<RHS_yt>) | ln(<RHS_yt>) | log(<RHS_yt>, <RHS_yt>)
        ///                     | sqrt(<RHS_yt>)
        /// </summary>
        functionExpression_yt: function() {
            this.log("Enter <函数表达式_yt>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FUNCTION_EXP_YT, "", this.currentNode);
            switch(this.nextToken.lexeme){
                case "sin":
                case "cos":
                case "tan":
                case "cot":
                case "ln":
                case "sqrt":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS){
                        this.lex(true);
                        this.RHS_yt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                            this.lex(true);
                        } else
                            this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    break;
                case "log":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS){
                        this.lex(true);
                        this.RHS_yt();
                        if(this.nextToken.token == LaTexLex.TokenEnum.COMMA) {
                            this.lex(true);
                            this.RHS_yt();
                            if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                                this.lex(true);
                            } else
                                this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                        }else
                            this.error(this.errorEnum.COMMA_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    break;
                default:
                    this.lex();
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <函数表达式_yt>");
        },

        /// <summary>
        ///     RHS_xy
        ///     按照如下规则解析语言中的字符串：
        ///     <RHS_xy> -> <项_xy>{(+|-)<项_xy>}
        /// </summary>
        RHS_xy: function() {
            this.log("Enter <RHS_xy>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.RHS_XY, "", this.currentNode);
            this.item_xy();
            while(this.nextToken.token == LaTexLex.TokenEnum.PLUS_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.MINUS_OPERATOR){
                this.lex(true);
                this.item_xy();
            }
            this.currentNode=this.currentNode.parent;
            this.log("Exit <RHS_xy>");
        },          

        /// <summary>
        ///     项_xy
        ///     按照如下规则解析语言中的字符串：
        ///     <项_xy> -> <因子_xy>{(*|/)<因子_xy>}
        /// </summary>
        item_xy: function() {
            this.log("Enter <item_xy>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.ITEM_XY, "", this.currentNode);
            this.factor_xy();
            while(this.nextToken.token == LaTexLex.TokenEnum.MULTIPLY_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.DIVIDE_OPERATOR){
                this.lex(true);
                this.factor_xy();
            }
            this.currentNode=this.currentNode.parent;
            this.log("Exit <item_xy>");
        },          
        
        /// <summary>
        ///     因子_xy
        ///     按照如下规则解析语言中的字符串：
        ///     <因子_xy> -> <高级因子_xy>{^<高级因子_xy>}
        /// </summary>
        factor_xy: function() {
            this.log("Enter <因子_xy>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FACTOR_XY, "", this.currentNode);
            this.priorityFactor_xy();
            while(this.nextToken.token == LaTexLex.TokenEnum.POWER_OPERATOR){
                this.lex(true);
                this.priorityFactor_xy();
            }
            this.currentNode=this.currentNode.parent;
            this.log("Exit <因子_xy>");
        },
        
        /// <summary>
        ///     高级因子_xy
        ///     按照如下规则解析语言中的字符串：
        ///     <高级因子_xy> -> (<RHS_xy>)
        ///                     |{<RHS_xy>}
        ///                     |<LaTex表达式_xy>
        ///                     |[(+|-)]<数字>
        ///                     |[(+|-)]t<变量_xy>
        ///                     |[(+|-)]<常量>
        ///                     |<函数_xy>
        /// </summary>
        priorityFactor_xy: function() {
            this.log("Enter <高级因子_xy>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.PRIORITY_FACTOR_XY, "", this.currentNode);
            switch(this.nextToken.token){
                case LaTexLex.TokenEnum.OPEN_PARENTHESIS:
                    this.lex(true);
                    this.RHS_xy();
                    if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {this.lex(true);}
                    else
                        this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.OPEN_BRACE:
                    this.lex(true);
                    this.RHS_xy();
                    if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {this.lex(true);}
                    else
                        this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.LATEX_NAME:
                    this.laTexExpression_xy();
                    break;
                case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                    this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                    break;
                case LaTexLex.TokenEnum.t:
                    this.lex(true, this.nodeTypeEnum.VAR_T);
                    break;
                case LaTexLex.TokenEnum.CONSTANT_VALUE:
                    this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                    break;
                case LaTexLex.TokenEnum.FUNCTION_NAME:
                    this.functionExpression_xy();
                    break;
                case LaTexLex.TokenEnum.PLUS_OPERATOR:
                case LaTexLex.TokenEnum.MINUS_OPERATOR:
                    this.lex(true);
                    switch (this.nextToken.token) {
                        case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                            this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                            break;
                        case LaTexLex.TokenEnum.t:
                            this.lex(true, this.nodeTypeEnum.VAR_T);
                            break;
                        case LaTexLex.TokenEnum.CONSTANT_VALUE:
                            this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                            break;
                        default:
                            this.error(new this.Exception([this.errorEnum.DIGITAL_NUMBER_EXPECTED, this.errorEnum.VAR_T_EXPECTED]));
                            break;
                    } // end of switch
                    break;
                default:
                    this.error(new this.Exception([this.errorEnum.OPEN_PARENTHESIS_EXPECTED, this.errorEnum.LATEX_EXPRESSION_EXPECTED, this.errorEnum.DIGITAL_NUMBER_EXPECTED
                    , this.errorEnum.VAR_T_EXPECTED, this.errorEnum.FUNCTION_EXPECTED]));
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <高级因子_xy>");
        },
        
        /// <summary>
        ///     LaTex表达式_xy
        ///     按照如下规则解析语言中的字符串：
        ///     <LaTex表达式_xy> -> \frac{<RHS_xy>}{RHS_xy}
        ///                         |\sqrt{<RHS_xy>}
        /// </summary>
        laTexExpression_xy: function() {
            this.log("Enter <LaTex表达式_xy>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.LATEX_EXP_XY, "", this.currentNode);
            switch(this.nextToken.lexeme){
                case "\\frac":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                        this.lex(true);
                        this.RHS_xy();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                            this.lex(true);
                            if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                                this.lex(true);
                                this.RHS_xy();
                                if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                                    this.lex(true);
                                } else
                                    this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                            }else
                                this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                        }else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    break;
                case "\\sqrt":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE){
                        this.lex(true);
                        this.RHS_xy();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                            this.lex(true);
                        } else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    break;
                default:
                    this.lex(true);
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <LaTex表达式_x>");
        },             
        
        /// <summary>
        ///     函数表达式_xy
        ///     按照如下规则解析语言中的字符串：
        ///     <函数表达式_xy> -> sin(<RHS_xy>) | cos(<RHS_xy>) | tan(<RHS_xy>) | cot(<RHS_xy>) | ln(<RHS_xy>) | log(<RHS_xy>, <RHS_xy>)
        ///                     | sqrt(<RHS_xy>)
        /// </summary>
        functionExpression_xy: function() {
            this.log("Enter <函数表达式_xy>");            
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FUNCTION_EXP_XY, "", this.currentNode);
            switch(this.nextToken.lexeme){
                case "sin":
                case "cos":
                case "tan":
                case "cot":
                case "ln":
                case "sqrt":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS){
                        this.lex(true);
                        this.RHS_xy();
                        if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                            this.lex(true);
                        } else
                            this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    break;
                case "log":
                    this.lex(true);
                    if(this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS){
                        this.lex(true);
                        this.RHS_xy();
                        if(this.nextToken.token == LaTexLex.TokenEnum.COMMA) {
                            this.lex(true);
                            this.RHS_xy();
                            if(this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                                this.lex(true);
                            } else
                                this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                        }else
                            this.error(this.errorEnum.COMMA_EXPECTED);
                    }else
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    break;
                default:
                    this.lex(true);
                    break;
            }// end switch
            this.currentNode=this.currentNode.parent;
            this.log("Exit <函数表达式_xy>");
        },

        errorEnum: {
            DOLLAR_SIGN_EXPECTED: {message: "Dollar Sign \"$\" is expected."},
            EVALUATION_OPERATOR_EXPECTED: {message: "Evaluation Operator \"=\" is expected."},
            OPEN_BRACE_EXPECTED: {message: "Open Brace \"{\" is expected."},
            CLOSING_BRACE_EXPECTED: {message: "Closing Brace \"}\" is expected."},
            DEPENDENT_VAR_Y_EXPECTED: {message: "Dependent Variable y is expected."},
            SEMICOLON_EXPECTED: {message: "Semicolon \";\" is expected."},
            DEPENDENT_VAR_X_EXPECTED: {message: "Dependent Variable x is expected."},
            OPEN_PARENTHESIS_EXPECTED: {message: "Open Parenthesis \"(\" is expected."},
            CLOSING_PARENTHESIS_EXPECTED: {message: "Closing Parenthesis \")\" is expected."},
            LATEX_EXPRESSION_EXPECTED: {message: "LaTex Expression name (\\frac or \\sqrt) is expected."},
            DIGITAL_NUMBER_EXPECTED: {message: "Digital Number (123.123) is expected."},
            VAR_Y_EXPECTED: {message: "Variable y is expected."},
            VAR_X_EXPECTED: {message: "Variable x is expected."},
            VAR_T_EXPECTED: {message: "Variable t is expected."},
            FUNCTION_EXPECTED: {message: "Function name (sin or cos) is expected."},
            COMMA_EXPECTED: {message: "Comma \",\"  is expected."},

            UNKNOWN_ERROR: {message: "Unknown error."}
        }
    };
})(zizhujy.com.LaTexLex);