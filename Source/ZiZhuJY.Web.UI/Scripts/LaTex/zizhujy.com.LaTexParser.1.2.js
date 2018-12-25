; (function (LaTexLex) {
    if (typeof zizhujy == "undefined") zizhujy = {};
    window.zizhujy = zizhujy;

    if (typeof zizhujy.com == "undefined") zizhujy.com = {};
    // Usage:
    //  zizhujy.com.LaTexParser.init(input);
    //  zizhujy.com.LaTexParser.run();
    //  var tree = zizhujy.com.LaTexParser.tree;
    if (typeof zizhujy.com.LaTexParser == "undefined") zizhujy.com.LaTexParser = {
        version: 1.2,
        source: "",
        errorList: [],
        logBuffer: new StringBuffer(),
        nextToken: null,
        tree: null,
        currentNode: null,
        tempNode: null,
        logPadCount: 0,

        init: function (source) {
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
        ///         3. lex(true, nodeType);
        /// </remark>
        lex: function () {
            var buildNewLeaf = false;
            var nodeType = null;

            if (arguments.length > 0) {
                switch (typeof arguments[0]) {
                    case "boolean":
                        buildNewLeaf = arguments[0];
                        switch (typeof arguments[1]) {
                            case "object":
                                nodeType = arguments[1];
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
            }

            if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                if (buildNewLeaf) {
                    if (!!nodeType) this.newLeafForTree(nodeType);
                    else this.newLeafForTree();
                }

                this.nextToken = LaTexLex.lex();
                this.log("Call lex /* returns {0} as {1}*/".format(!!this.nextToken ? this.nextToken.lexeme : "<null>", !!this.nextToken ? this.nextToken.token.name : "<null>"));
                while (!this.nextToken) {
                    this.nextToken = LaTexLex.lex();
                    this.log("Call lex /* returns {0} */".format(!!this.nextToken ? this.nextToken.lexeme : "<null>"));
                }
            }
        },

        peek: function () {
            LaTexLex.beginPeek();

            var nextToken = this.nextToken;
            if (nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                nextToken = LaTexLex.lex();
                while (!nextToken) {
                    nextToken = LaTexLex.lex();
                }
            }

            LaTexLex.endPeek();

            return nextToken;
        },

        log: function (message) {
            if (message.startsWith("Exit")) this.logPadCount -= 4;
            this.logBuffer.append(".".duplicate(this.logPadCount) + message);
            if (message.startsWith("Enter")) this.logPadCount += 4;
        },

        /// <summary> 
        ///     异常类
        /// </summary>
        /// <param name="errorEnum">错误枚举信息。可以是单独的一个枚举，也可以是一个错误枚举数组。如果是一个数组，则说明错误可能是其中的一个。</param>
        /// <param name="index">可选。错误出现的索引位置。</param>
        Exception: function (errorEnum, index) {
            this.errorEnum = zizhujy.com.LaTexParser.errorEnum.UNKNOWN_ERROR;
            if (arguments.length > 0) this.errorEnum = arguments[0];
            this.index = LaTexLex.index - zizhujy.com.LaTexParser.nextToken.lexeme.length;
            if (arguments.length > 1) this.index = arguments[1];
            this.context = zizhujy.com.LaTexParser.source.substring(this.index >= 10 ? this.index - 10 : 0, this.index) + zizhujy.com.LaTexParser.source.substring(this.index, this.index + zizhujy.com.LaTexParser.nextToken.lexeme.length) + zizhujy.com.LaTexParser.source.substr(this.index + zizhujy.com.LaTexParser.nextToken.lexeme.length, 10);
            this.contextIndicator = "-".duplicate(this.index >= 10 ? 10 : this.index) + "^".duplicate(zizhujy.com.LaTexParser.nextToken.lexeme.length) + "-".duplicate(10);
            this.contextHTML = zizhujy.com.LaTexParser.source.substring(this.index >= 10 ? this.index - 10 : 0, this.index).htmlEncode() + "<span style=\"color: red; font-weight: bold; font-size: larger; border: solid 1px red; padding: 5px;\">{0}</span>".format(zizhujy.com.LaTexParser.source.substring(this.index, this.index + zizhujy.com.LaTexParser.nextToken.lexeme.length).htmlEncode()) + zizhujy.com.LaTexParser.source.substr(this.index + zizhujy.com.LaTexParser.nextToken.lexeme.length, 10).htmlEncode();
            //this.contextHTML = "<pre>" + zizhujy.com.LaTexParser.source.substring(this.index >= 10 ? this.index - 10 : 0, this.index) + "<span style=\"color: red; font-weight: bold; font-size: larger;\">{0}</span>".format(zizhujy.com.LaTexParser.source.substring(this.index, this.index + 1)) + zizhujy.com.LaTexParser.source.substr(this.index+1, 10) + "</pre>";
            //this.contextDec = "<pre>" + zizhujy.com.LaTexParser.source.substring(this.index >= 10 ? this.index - 10 : 0, this.index).toDec() + "<span style=\"color: red; font-weight: bold; font-size: larger;\">{0}</span>".format(zizhujy.com.LaTexParser.source.substring(this.index, this.index + 1).toDec()) + zizhujy.com.LaTexParser.source.substr(this.index+1, 10).toDec() + "</pre>";
            this.actualToken = zizhujy.com.LaTexParser.nextToken;

            if (!this.__initialized__) {
                zizhujy.com.LaTexParser.Exception.prototype.__calculateRowCol__ = function () {
                    var rowDelimiter = "\n";
                    if (arguments.length > 0) rowDelimiter = arguments[0];

                    var source = zizhujy.com.LaTexParser.source;
                    var row = 1;
                    var col = 1;
                    var colStartIndex = 0;
                    for (var i = 0; i < this.index - rowDelimiter.length + 1; i++) {
                        if (source.substr(i, rowDelimiter.length) == rowDelimiter) {
                            row++;
                            colStartIndex = i;
                        }
                    }
                    col += i - colStartIndex - 1;

                    this.__rowCache__ = row;
                    this.__colCache__ = col;
                };

                zizhujy.com.LaTexParser.Exception.prototype.row = function () {
                    if (!this.__rowCache__) {
                        this.__calculateRowCol__();
                    }

                    return this.__rowCache__;
                };

                zizhujy.com.LaTexParser.Exception.prototype.col = function () {
                    if (!this.__colCache__) {
                        this.__calculateRowCol__();
                    }

                    return this.__colCache__;
                };
                this.__initialized__ = true;
            }
        },

        nodeTypeEnum: {
            EQUATION: { value: 0, name: "Equation" },
            EXPRESSION: { value: 1, name: "Expression" },
            TERM: { value: 2, name: "Term" },
            FACTOR: { value: 3, name: "Factor" },
            POWER: { value: 4, name: "Power" },
            VARIABLE_NAME: { value: 5, name: "Variable Name" },
            LATEX_COMMAND: { value: 6, name: "LaTex Command" },
            FUNCTION_EXPRESSION: { value: 7, name: "Function Expression" },
            CONSTANT_VALUE: { value: 8, name: "Constant Value" },
            DIGITAL_NUMBER: { value: 9, name: "Digital Number" },
            CONSTRAINT: { value: 10, name: "Constraint" },
            CONSTRAINTS: { value: 11, name: "Constraints" },
            OTHER_LEXEME: { value: 26, name: "Other Lexeme" },
            UNKNOWN: { value: 99, name: "Unknown" }
        },

        TreeNode: function (nodeType, expression, parent, children) {
            this.nodeType = zizhujy.com.LaTexParser.nodeTypeEnum.UNKNOWN;
            this.expression = "";
            this.parent = null;
            this.children = [];

            if (arguments.length > 0) this.nodeType = arguments[0];
            if (arguments.length > 1) this.expression = arguments[1];
            if (arguments.length > 2) {
                if (arguments[2] == null || arguments[2] instanceof zizhujy.com.LaTexParser.TreeNode)
                    this.parent = arguments[2];
            }
            if (arguments.length > 3) {
                if (arguments[2] instanceof Array) {
                    for (var i = 0; i < arguments[3].length; i++) {
                        if (arguments[3][i] instanceof zizhujy.com.LaTexParser.TreeNode)
                            this.children.push(arguments[3][i]);
                    }
                } else {
                    if (arguments[3] instanceof zizhujy.com.LaTexParser.TreeNode)
                        this.children.push(arguments[3]);
                }
            }

            zizhujy.com.LaTexParser.log("+ A node was added to its parent node '{2}' with the expression: '{1}' as type {0}".format(this.nodeType.name, this.expression, !!this.parent ? this.parent.nodeType.name : "Root"));

            if (!this.__initialized__) {
                zizhujy.com.LaTexParser.TreeNode.prototype.addChildren = function (children) {
                    if (children instanceof Array) {
                        for (var i = 0; i < children.length; i++) {
                            if (children[i] instanceof zizhujy.com.LaTexParser.TreeNode)
                                this.children.push(children[i]);
                        }
                    } else {
                        if (children instanceof zizhujy.com.LaTexParser.TreeNode)
                            this.children.push(children);
                    }
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.getLeaves = function () {
                    var leaves = [];
                    if (!!this.children) {
                        if (this.children.length <= 0) {
                            leaves.push(this);
                        } else {
                            for (var i = 0; i < this.children.length; i++) {
                                leaves = leaves.concat(this.children[i].getLeaves());
                            }
                        }
                    } else {
                        leaves.push(this);
                    }

                    return leaves;
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.eval = function () {
                    if (!this.evalCache) {
                        var isValid = true;
                        try {
                            switch (this.nodeType) {
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTRAINTS:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTRAINT:
                                    this.evalCache = "";
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTANT_VALUE:
                                    this.evalCache = this.getExpression().replaceAll("\\", "");
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.DIGITAL_NUMBER:
                                    this.evalCache = this.getExpression();

                                    if (Fraction && Fraction.repeatingDecimalRegex
                                        && Fraction.repeatingDecimalRegex.test(this.evalCache)) {
                                        //console.log('evaling... ' + this.evalCache);
                                        var frac = Fraction.newFraction(this.evalCache);
                                        
                                        if (frac.valid) {
                                            isValid = true;
                                            this.evalCache = '\\frac{' + frac.numerator + '}{' + frac.denominator + '}';
                                        } else {
                                            isValid = false;
                                        }
                                        
                                    } else {
                                        isValid = true;
                                    }

                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.VARIABLE_NAME:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.OTHER_LEXEME:
                                    
                                    this.evalCache = this.getExpression().replaceAll("\\cdot", "*")
                                                                        .replaceAll("\\cos", "cos")
                                                                        .replaceAll("\\sin", "sin")
                                                                        .replaceAll("\\cosec", "cosec")
                                                                        .replaceAll("\\tan", "tan")
                                                                        .replaceAll("\\cot", "cot")
                                                                        .replaceAll("\\pow", "pow")
                                                                        .replaceAll("\\exp", "exp")
                                                                        .replaceAll("\\sign", "sign")
                                                                        .replaceAll("\\log", "log")
                                                                        .replaceAll("\\ln", "ln")
                                                                        .replaceAll("\\sec", "sec")
                                                                        .replaceAll("\\sgn", "sgn")
                                                                        .replaceAll("\\arcsin", "arcsin")
                                                                        .replaceAll("\\arccos", "arccos")
                                                                        .replaceAll("\\arctan", "arctan")
                                                                        .replaceAll("\\arccot", "arccot")
                                                                        .replaceAll("\\asin", "asin")
                                                                        .replaceAll("\\acos", "acos")
                                                                        .replaceAll("\\atan", "atan")
                                                                        .replaceAll("\\acot", "acot")
                                                                        .replaceAll("\\abs", "abs");

                                    
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FACTOR:
                                    isValid = this.children.reduce(function(current, next) {
                                        return current && next.isValid();
                                    }, true);

                                    this.evalCache =
                                        zizhujy.com.LaTexParser.TreeNode.evalFactor(
                                        this.children.map(function(c) {
                                            return c.eval();
                                        }));
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.EQUATION:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.EXPRESSION:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FUNCTION_EXPRESSION:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.TERM:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.POWER:
                                    var sb = new StringBuffer();
                                    var abs = false;

                                    for (var i = 0; i < this.children.length; i++) {
                                        if (this.children[i].getExpression() == "|") {
                                            if (abs) {
                                                sb.append(")");
                                                abs = false;
                                            } else {
                                                var cur = sb.toString().trim();
                                                if (cur.length > 0) {
                                                    var operator = cur.substr(cur.length - 1, 1);
                                                    //if (operator != "*" && operator != "/" && operator != "+" && operator != "-" && operator != "^") {
                                                    if (!isNaN(parseFloat(operator)) && isFinite(operator) || operator == ")") {
                                                        sb.append("*");
                                                    }
                                                }
                                                sb.append("abs(");
                                                abs = true;
                                            }
                                        } else {
                                            var next = this.children[i].eval();
                                            

                                            if (next.toString().startsWith("(")
                                                || next.toString().startsWith("abs(")) {
                                                var cur = sb.toString().trim();
                                                if (cur.length > 0) {
                                                    var operator = cur.substr(cur.length - 1, 1);
                                                    //if (operator != "*" && operator != "/" && operator != "+" && operator != "-" && operator != "^") {
                                                    if (!isNaN(parseFloat(operator)) && isFinite(operator) || operator == ")") {
                                                        sb.append("*");
                                                    }
                                                }
                                            }

                                            sb.append(next);
                                            isValid = isValid && this.children[i].isValid();
                                        }
                                    }
                                    this.evalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.LATEX_COMMAND:
                                    if (this.children.length === 0) {
                                        switch (this.expression) {
                                            case "\\le":
                                                this.evalCache = "<=";
                                                isValid = isValid && true;
                                                break;
                                            case "\\ge":
                                                this.evalCache = ">=";
                                                isValid = isValid && true;
                                                break;
                                            default:
                                                this.evalCache = "[Not Recognized LaTex]";
                                                isValid = false;
                                                break;
                                        }
                                    } else {

                                        isValid = isValid && this.children[0].isValid();
                                        switch (this.children[0].expression) {
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
                                    }
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.UNKNOWN:
                                default:
                                    this.evalCache = "[Unknown Node Type: {" + this.nodeType.name + "}]";
                                    isValid = false;
                                    break;
                            }
                        } catch (ex) {
                            console.log(ex);
                            //throw ex;
                            this.evalCache = "[Error Thrown]";
                            isValid = false;
                        } finally {
                            this.isValidCache = isValid;
                        }
                    }
                    return this.evalCache;
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.intervalEval = function () {
                    if (!this.intervalEvalCache) {
                        var isValid = true;
                        try {
                            switch (this.nodeType) {
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTRAINT:
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTRAINTS:
                                    this.intervalEvalCache = "";bug-http-zizhujycom-zh-c
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.VARIABLE_NAME:
                                    this.intervalEvalCache = this.getExpression();
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.CONSTANT_VALUE:
                                    this.intervalEvalCache = "IntervalArithmetic.constantValue(" + this.getExpression().replace("\\", "") + ")";
                                    //console.log("CONSTANT_VALUE: " + this.getExpression());
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.DIGITAL_NUMBER:
                                    this.intervalEvalCache = "{val: [{0}, {1}], def: [true, true]}".format(this.getExpression(), this.getExpression());
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.OTHER_LEXEME:
                                    //this.intervalEvalCache = this.getExpression();
                                    this.intervalEvalCache = this.getExpression()
                                                                        .replaceAll("\\cos", "cos")
                                                                        .replaceAll("\\sin", "sin")
                                                                        .replaceAll("\\cosec", "cosec")
                                                                        .replaceAll("\\tan", "tan")
                                                                        .replaceAll("\\cot", "cot")
                                                                        .replaceAll("\\pow", "pow")
                                                                        .replaceAll("\\exp", "exp")
                                                                        .replaceAll("\\sign", "sign")
                                                                        .replaceAll("\\log", "log")
                                                                        .replaceAll("\\ln", "ln")
                                                                        .replaceAll("\\sec", "sec")
                                                                        .replaceAll("\\sgn", "sgn")
                                                                        .replaceAll("\\arcsin", "arcsin")
                                                                        .replaceAll("\\arccos", "arccos")
                                                                        .replaceAll("\\arctan", "arctan")
                                                                        .replaceAll("\\arccot", "arccot")
                                                                        .replaceAll("\\asin", "asin")
                                                                        .replaceAll("\\acos", "acos")
                                                                        .replaceAll("\\atan", "atan")
                                                                        .replaceAll("\\acot", "acot")
                                                                        .replaceAll("\\abs", "abs");
                                    isValid = true;
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FACTOR:
                                    var sb = new StringBuffer();
                                    var baseIndex = 0;
                                    if (this.children[0].getExpression() == "-" | this.children[0].getExpression() == "+") {
                                        baseIndex = 1;
                                    }
                                    var i = baseIndex + 1;
                                    var addRhsNextTime = false;
                                    var base = this.children[baseIndex].intervalEval();
                                    isValid = isValid && this.children[baseIndex].isValid();
                                    while (!!this.children[i] && this.children[i].expression == "^"
                                        || !!this.children[i]) {
                                        if (!!this.children[i] && this.children[i].expression == "^") {
                                            var pow = "IntervalArithmetic.pow({0}, {1})".format(this.children[i - 1].intervalEval(), !!this.children[i + 1] ? this.children[i + 1].intervalEval() : "");
                                            if (!!addRhsNextTime) {
                                                base = "{0}{1})".format(base, pow);
                                                addRhsNextTime = false;
                                            } else {
                                                base = "IntervalArithmetic.pow({0}, {1})".format(base, !!this.children[i + 1] ? this.children[i + 1].intervalEval() : "");
                                            }
                                            isValid = isValid && !!this.children[i + 1] && this.children[i + 1].isValid();
                                            i += 2;
                                        } else {
                                            if (!addRhsNextTime) {
                                                base = "IntervalArithmetic.multiply({0}, ".format(base);
                                                isValid = isValid && this.children[i].isValid();
                                                i++;
                                                addRhsNextTime = true;
                                            } else {
                                                base = "{0}{1})".format(base, this.children[i].intervalEval());
                                                isValid = isValid && this.children[i].isValid();
                                                i++;
                                                addRhsNextTime = false;
                                            }
                                        }
                                    }

                                    if (addRhsNextTime) {
                                        base = "{0}{1})".format(base, this.children[this.children.length - 1].intervalEval());
                                        isValid = isValid && this.children[this.children.length - 1].isValid();
                                        addRhsNextTime = false;
                                    }

                                    sb.append(baseIndex == 0 ? base : (this.children[0].getExpression() == "-" ? "IntervalArithmetic.negative({0})".format(base) : base));
                                    this.intervalEvalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.FUNCTION_EXPRESSION:
                                    var sb = new StringBuffer();
                                    sb.append("IntervalArithmetic.{0}".format(this.children[0].intervalEval()));
                                    isValid = isValid && this.children[0].isValid();

                                    for (var i = 1; i < this.children.length; i++) {
                                        sb.append(this.children[i].intervalEval());
                                        isValid = isValid && this.children[i].isValid();
                                    }
                                    this.intervalEvalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.EXPRESSION:
                                    var sb = new StringBuffer();
                                    for (var i = 0; i < this.children.length; i++) {
                                        if (this.children[i].getExpression() == "+") {
                                            sb.reset("IntervalArithmetic.add({0}, {1})".format(sb.toString(), this.children[i + 1].intervalEval()));
                                            isValid = isValid && this.children[i + 1].isValid();
                                            i++;
                                        } else if (this.children[i].getExpression() == "-") {
                                            sb.reset("IntervalArithmetic.subtract({0}, {1})".format(sb.toString(), this.children[i + 1].intervalEval()));
                                            isValid = isValid && this.children[i + 1].isValid();
                                            i++;
                                        } else {
                                            sb.append(this.children[i].intervalEval());
                                            isValid = isValid && this.children[i].isValid();
                                        }
                                    }
                                    this.intervalEvalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.TERM:
                                    var sb = new StringBuffer();
                                    for (var i = 0; i < this.children.length; i++) {
                                        if (this.children[i].intervalEval() == "*" || this.children[i].intervalEval() == "\\cdot") {
                                            sb.reset("IntervalArithmetic.multiply({0}, {1})".format(sb.toString(), this.children[i + 1].intervalEval()));
                                            isValid = isValid && this.children[i + 1].isValid();
                                            i++;
                                        } else if (this.children[i].intervalEval() == "/") {
                                            sb.reset("IntervalArithmetic.divide({0}, {1})".format(sb.toString(), this.children[i + 1].intervalEval()));
                                            isValid = isValid && this.children[i + 1].isValid();
                                            i++;
                                        } else {
                                            var cur = sb.toString().trim();
                                            var next = this.children[i].intervalEval();
                                            if (i == 0) {
                                                sb.append(next);
                                            } else {
                                                sb.reset("IntervalArithmetic.multiply({0}, {1})".format(cur, next));
                                            }
                                            isValid = isValid && this.children[i].isValid();
                                        }
                                    }
                                    this.intervalEvalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.POWER:
                                    var sb = new StringBuffer();
                                    var start = 0;
                                    var closed = true;
                                    var abs = false;
                                    if (this.children[0].getExpression() == "-") {
                                        start = 1;

                                        sb.append("IntervalArithmetic.negative(");
                                        closed = false;
                                    } else if (this.children[0].getExpression() == "+") {
                                        start = 1;
                                    }
                                    for (var i = start; i < this.children.length; i++) {
                                        if (this.children[i].getExpression() == "|") {
                                            if (abs) {
                                                sb.append(")");
                                                abs = false;
                                            } else {
                                                sb.append("IntervalArithmetic.abs(");
                                                abs = true;
                                            }
                                        } else {
                                            var next = this.children[i].intervalEval();

                                            sb.append(next);
                                            isValid = isValid && this.children[i].isValid();
                                        }
                                    }
                                    if (!closed) {
                                        sb.append(")");
                                    }
                                    this.intervalEvalCache = sb.toString();
                                    break;bug-http-zizhujycom-zh-c
                                case zizhujy.com.LaTexParser.nodeTypeEnum.EQUATION:
                                    var sb = new StringBuffer();
                                    for (var i = 0; i < this.children.length; i++) {
                                        sb.append(this.children[i].intervalEval());
                                        isValid = isValid && this.children[i].isValid();
                                    }
                                    this.intervalEvalCache = sb.toString();
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.LATEX_COMMAND:
                                    if (this.children.length === 0) {
                                        switch(this.expression) {
                                            case "\\le":
                                                this.intervalEvalCache = "<=";
                                                isValid = isValid && true;
                                                break;
                                            case "\\ge":
                                                this.intervalEvalCache = ">=";
                                                isValid = isValid && true;
                                                break;
                                            default:
                                                this.intervalEvalCache = "[Not Recognized LaTex]";
                                                isValid = false;
                                                break;
                                        }
                                    } else {
                                        isValid = isValid && this.children[0].isValid();
                                        switch (this.children[0].expression) {
                                            case "\\frac":
                                                this.intervalEvalCache = "IntervalArithmetic.divide({0}, {1})".format(this.children[2].intervalEval(), this.children[5].intervalEval());
                                                isValid = isValid && this.children[2].isValid();
                                                isValid = isValid && this.children[5].isValid();
                                                break;
                                            case "\\sqrt":
                                                this.intervalEvalCache = "IntervalArithmetic.sqrt({0})".format(this.children[2].intervalEval());
                                                isValid = isValid && this.children[2].isValid();
                                                break;
                                            default:
                                                this.intervalEvalCache = "[Not Recognized LaTex]";
                                                isValid = false;
                                                break;
                                        }
                                    }
                                    break;
                                case zizhujy.com.LaTexParser.nodeTypeEnum.UNKNOWN:
                                default:
                                    this.intervalEvalCache = "[Unknown Node Type: {" + this.nodeType.name + "}]";
                                    isValid = false;
                                    break;
                            }
                        } catch (ex) {
                            this.intervalEvalCache = "[Error Thrown]";
                            isValid = false;
                        } finally {
                            this.isValidCache = isValid;
                        }
                    }

                    return this.intervalEvalCache;
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.isValid = function () {
                    if (!this.isValidCache)
                        this.eval();

                    return this.isValidCache;
                };

                zizhujy.com.LaTexParser.TreeNode.prototype.getExpression = function () {
                    var sb = new StringBuffer();
                    sb.append(this.expression);
                    for (var i = 0; i < this.children.length; i++) {
                        sb.append(this.children[i].getExpression());
                    }
                    return sb.toString();
                };

                this.__initialized__ = true;
            }

            if (parent != null && parent instanceof zizhujy.com.LaTexParser.TreeNode)
                parent.addChildren(this);
        },

        newLeafForTree: function () {
            var nodeType = this.nodeTypeEnum.OTHER_LEXEME;
            if (arguments.length > 0) nodeType = arguments[0];
            new this.TreeNode(nodeType, this.nextToken.lexeme, this.currentNode);
            //this.log(String.format("-- New Leaf Added: {0} as type {1}", this.nextToken.lexeme, nodeType.name));
        },

        /// <summary>
        ///     记录语法分析中出现的错误
        /// </summary>
        /// <param name="ex">错误信息。它可以是一个 Exception 类的实例，或者是一个errorEnum中的某个枚举类型。</param>
        error: function (ex) {
            if (ex instanceof this.Exception) {
                this.errorList.push(ex);
                var sb = new StringBuffer();
                if (ex.errorEnum instanceof Array) {
                    for (var i = 0; i < ex.errorEnum.length; i++) {
                        sb.append(ex.errorEnum[i].message);
                    }
                } else
                    sb.append(ex.errorEnum.message);
                this.log("!!Error: {0}".format(sb.toString(" Or ")));
            }
            else if (!!ex && !!ex.message) {
                this.errorList.push(new this.Exception(ex));
                this.log("!!Error: {0}".format(ex.message));
            }
            else {
                this.errorList.push(new this.Exception(this.errorEnum.UNKNOWN_ERROR));
                this.log("!!Error: {0}".format(this.errorEnum.UNKNOWN_ERROR.message));
            }

            if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                this.newLeafForTree(this.nodeTypeEnum.UNKNOWN);
            }
        },

        run: function () {
            if (!LaTexLex.eos()) {
                this.lex();
                //this.explicitFunctionList();
                this.equation();
            }
        },
        
        runSpecific: function(func) {
            if (!LaTexLex.eos()) {
                this.lex();
                func(this);
            }
        },

        getConstraints: function (tree) {
            var constraints = {};

            for (var i = 0; i < tree.children.length; i++) {
                if (tree.children[i].nodeType == this.nodeTypeEnum.CONSTRAINTS) {
                    var constraintsNode = tree.children[i];
                    for (var j = 0; j < constraintsNode.children.length; j++) {
                        var constraint = { varName: "", range: [] };

                        var constraintNode = constraintsNode.children[j];
                        for (var k = 0; k < constraintNode.children.length; k++) {
                            if (constraintNode.children[k].nodeType == this.nodeTypeEnum.EXPRESSION) {
                                constraint.range.push(constraintNode.children[k].eval());
                            } else if (constraintNode.children[k].nodeType == this.nodeTypeEnum.VARIABLE_NAME) {
                                constraint.varName = constraintNode.children[k].eval();

                                if (constraint.range.length <= 0) constraint.range.push(undefined);
                            }
                        }

                        constraints[constraint.varName] = constraint.range;
                    }

                    break;
                }
            }

            return constraints;
        },

        /// <summary>
        ///     A constraints -2<=x<2;-2<=y<=2;-3<=t<=PI/2
        ///     Parse the string according to the following rule:
        ///     <Constraints> -> <Constraint>{;<Constraint>}
        /// </summary>
        constraints: function () {
            this.log("Enter <Constraints>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.CONSTRAINTS, "", this.currentNode);

            this.constraint();
            while (this.nextToken.token == LaTexLex.TokenEnum.SEMICOLON) {
                this.lex();
                this.constraint();
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <Constraints>");
        },

        /// <summary>
        ///     A constraint -2<=x<2
        ///     Parse the string according to the following rule:
        ///     <Constraint> -> <Expression> <[=] <Variable> [<[=] <Expression>]
        ///                 |   <Variable> <[=] <Expression>
        /// </summary>
        constraint: function () {
            this.log("Enter <Constraint>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.CONSTRAINT, "", this.currentNode);

            var firstToken = this.nextToken;
            var nextToken = this.peek();

            if (firstToken.token == LaTexLex.TokenEnum.VARIABLE_NAME && nextToken.token == LaTexLex.TokenEnum.LESS_THAN) {
                // <Variable> <[=] <Expression>
                this.lex(true, this.nodeTypeEnum.VARIABLE_NAME);
                if (this.nextToken.token == LaTexLex.TokenEnum.LESS_THAN) {
                    this.lex();
                    if (this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                        this.lex();
                    }
                    this.expression();
                } else {
                    this.error(this.errorEnum.LESS_THAN_EXPECTED);
                }
            } else {
                // <Expression> <[=] <Variable> [<[=] <Expression>]
                this.expression();
                if (this.nextToken.token == LaTexLex.TokenEnum.LESS_THAN) {
                    this.lex();
                    if (this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                        this.lex();
                    }
                    if (this.nextToken.token == LaTexLex.TokenEnum.VARIABLE_NAME) {
                        this.lex(true, this.nodeTypeEnum.VARIABLE_NAME);
                        if (this.nextToken.token == LaTexLex.TokenEnum.LESS_THAN) {
                            this.lex();
                            if (this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                                this.lex();
                            }
                            this.expression();
                        }
                    } else {
                        this.error(this.errorEnum.VAR_X_EXPECTED, this.errorEnum.VAR_Y_EXPECTED, this.errorEnum.VAR_T_EXPECTED, this.errorEnum.VARIABLE_NAME_EXPECTED);
                    }
                } else {
                    this.error(this.errorEnum.LESS_THAN_EXPECTED);
                }
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <Constraint>");
        },

        /// <summary>
        ///     An equation
        ///     Parse the string according to the following rule:
        ///     <Equation> -> <Expression> = <Expression>     
        ///                 | <Expression> = <Expression> \{ <Constraints> \}   
        ///                 | <Expression> = <Expression> \left\\{ <Constraints> \right\\}
        ///                 | x=<Expression>;y=<Expression>   
        ///                 | x=<Expression>;y=<Expression> \{ <Constraints> \} 
        ///                 | x=<Expression>;y=<Expression> \left\\{ <Constraints> \right\\}
        ///
        ///                 | <Expression> < <Expression>
        /// </summary>
        equation: function () {
            this.log("Enter <Equation>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.EQUATION, "", this.currentNode);
            this.tree = this.currentNode;

            var firstToken = this.nextToken;
            var nextToken = this.peek();

            if (firstToken.lexeme == "x" && nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                this.log("x=f(t);y=g(t) mode");
                // parse x
                this.lex(true, this.nodeTypeEnum.VARIABLE_NAME);
                // parse =
                this.lex(true);
                // parse <Expression>
                this.expression();
                if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                    if (this.nextToken.token == LaTexLex.TokenEnum.SEMICOLON) {
                        // parse semicolon ';'
                        this.lex(true);
                        if (this.nextToken.lexeme == "y") {
                            // parse y
                            this.lex(true, this.nodeTypeEnum.VARIABLE_NAME);
                            if (this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR) {
                                // parse =
                                this.lex(true);
                                this.expression();
                                if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                    if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\left") {
                                        this.lex();
                                        if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME_OPEN_BRACE) {
                                            // parse constraints {-2<=x<=2}
                                            this.lex();
                                            this.constraints();
                                            if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right") {
                                                this.lex();
                                                if (this.nextToken.token != LaTexLex.TokenEnum.LATEX_NAME_CLOSING_BRACE) {
                                                    this.error(this.errorEnum.LATEX_CLOSING_BRACE_EXPECTED);
                                                } else {
                                                    this.lex();
                                                }
                                            } else {
                                                this.error(this.errorEnum.RIGHT_COMMAND_EXPECTED);
                                            }

                                            if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                                this.error(this.errorEnum.END_OF_SOURCE_EXPECTED);
                                            }
                                        } else {
                                            this.error(this.errorEnum.LATEX_OPEN_BRACE_EXPECTED);
                                        }
                                    } else if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                                        // parse constraints {-2<=x<=2}
                                        this.lex();
                                        this.constraints();
                                        if (this.nextToken.token != LaTexLex.TokenEnum.CLOSING_BRACE) {
                                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                                        } else {
                                            this.lex();
                                        }

                                        if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                            this.error(this.errorEnum.END_OF_SOURCE_EXPECTED);
                                        }
                                    } else {
                                        this.error(new this.Exception([this.errorEnum.END_OF_SOURCE_EXPECTED, this.errorEnum.OPEN_BRACE_EXPECTED, this.errorEnum.LEFT_COMMAND_EXPECTED]));
                                    }
                                }
                            } else {
                                this.error(this.errorEnum.EVALUATION_OPERATOR_EXPECTED);
                            }
                        } else {
                            // TODO: If y is expected, why bother user to input it? If not y, why not insert it for the user?
                            // Have another thought, this is not parser's job, this should be done by the input collector.
                            this.error(this.errorEnum.VAR_Y_EXPECTED);
                        }
                    } else {
                        if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\left") {
                            this.lex();
                            if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME_OPEN_BRACE) {
                                // parse constraints {-2<=x<=2}
                                this.lex();
                                this.constraints();
                                if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right") {
                                    this.lex();
                                    if (this.nextToken.token != LaTexLex.TokenEnum.LATEX_NAME_CLOSING_BRACE) {
                                        this.error(this.errorEnum.LATEX_CLOSING_BRACE_EXPECTED);
                                    } else {
                                        this.lex();
                                    }
                                } else {
                                    this.error(this.errorEnum.RIGHT_COMMAND_EXPECTED);
                                }

                                if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                    this.error(this.errorEnum.END_OF_SOURCE_EXPECTED);
                                }
                            } else {
                                this.error(this.errorEnum.LATEX_OPEN_BRACE_EXPECTED);
                            }
                        } else if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                            // parse constraints {-2<=x<=2}
                            this.lex();
                            this.constraints();
                            if (this.nextToken.token != LaTexLex.TokenEnum.CLOSING_BRACE) {
                                this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                            } else {
                                this.lex();
                            }

                            if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                this.error(this.errorEnum.END_OF_SOURCE_EXPECTED);
                            }
                        } else {
                            this.error(new this.Exception([this.errorEnum.END_OF_SOURCE_EXPECTED, this.errorEnum.SEMICOLON_EXPECTED, this.errorEnum.OPEN_BRACE_EXPECTED, this.errorEnum.LEFT_COMMAND_EXPECTED]));
                        }
                    }
                }
            } else {
                // <Expression>=<Expression>
                this.expression();
                if (this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR ||
                                this.nextToken.token == LaTexLex.TokenEnum.LESS_THAN ||
                                this.nextToken.token == LaTexLex.TokenEnum.GREATER_THAN ||
                this.nextToken.token == LaTexLex.TokenEnum.LESS_THAN_OR_EQUAL_TO ||
                this.nextToken.token == LaTexLex.TokenEnum.GREATER_THAN_OR_EQUAL_TO) {
                    if (this.nextToken.token == LaTexLex.TokenEnum.LESS_THAN_OR_EQUAL_TO ||
                        this.nextToken.token == LaTexLex.TokenEnum.GREATER_THAN_OR_EQUAL_TO) {
                        this.lex(true, this.nodeTypeEnum.LATEX_COMMAND);
                    } else {
                        this.lex(true);
                    }

                    this.expression();
                    if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                        if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\left") {
                            this.lex();
                            if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME_OPEN_BRACE) {
                                // parse constraints {-2<=x<=2}
                                this.lex();
                                this.constraints();
                                if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right") {
                                    this.lex();
                                    if (this.nextToken.token != LaTexLex.TokenEnum.LATEX_NAME_CLOSING_BRACE) {
                                        this.error(this.errorEnum.LATEX_CLOSING_BRACE_EXPECTED);
                                    } else {
                                        this.lex();
                                    }
                                } else {
                                    this.error(this.errorEnum.RIGHT_COMMAND_EXPECTED);
                                }

                                if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                    this.error(this.errorEnum.END_OF_SOURCE_EXPECTED);
                                }
                            } else {
                                this.error(this.errorEnum.LATEX_OPEN_BRACE_EXPECTED);
                            }
                        } else if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                            // parse constraints {-2<=x<=2}
                            this.lex();
                            this.constraints();
                            if (this.nextToken.token != LaTexLex.TokenEnum.CLOSING_BRACE) {
                                this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                            } else {
                                this.lex();
                            }

                            if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                                this.error(this.errorEnum.END_OF_SOURCE_EXPECTED);
                            }
                        } else {
                            this.error(new this.Exception([this.errorEnum.END_OF_SOURCE_EXPECTED, this.errorEnum.OPEN_BRACE_EXPECTED, this.errorEnum.LEFT_COMMAND_EXPECTED]));
                        }
                    }
                } else {
                    this.error(this.errorEnum.EQUAL_SIGN_EXPECTED);
                    this.lex();
                }
            }

            this.log("Exit <Equation>");
        },

        /// <summary>
        ///     An expression
        ///     Parse the string according to the following rule:
        ///     <Expression> -> <Term> {(+|-)<Term>}
        /// </summary>
        expression: function (isRoot) {
            this.log("Enter <Expression>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.EXPRESSION, "", this.currentNode);
            
            if (isRoot) {
                this.tree = this.currentNode;
            }

            this.term();
            while (this.nextToken.token == LaTexLex.TokenEnum.PLUS_OPERATOR || this.nextToken.token == LaTexLex.TokenEnum.MINUS_OPERATOR) {
                this.lex(true);
                this.term();
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <Expression>");
        },

        /// <summary>
        ///     A term
        ///     Parse the string according to the following rule:
        ///     <Term> -> <Factor> {[(*|/|\cdot)]<Factor>} 
        ///
        /// </summary>
        term: function () {
            this.log("Enter <Term>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.TERM, "", this.currentNode);

            this.factor();
            /*
            while(this.nextToken.token == LaTexLex.TokenEnum.MULTIPLY_OPERATOR 
                || this.nextToken.token == LaTexLex.TokenEnum.DIVIDE_OPERATOR
                || (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\cdot")){
                this.lex(true);
                this.factor();
            }*/
            while (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                if (this.nextToken.token == LaTexLex.TokenEnum.MULTIPLY_OPERATOR
                || this.nextToken.token == LaTexLex.TokenEnum.DIVIDE_OPERATOR
                || (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\cdot")) {
                    this.lex(true);
                }
                if (this.nextToken.token == LaTexLex.TokenEnum.EVALUATION_OPERATOR
                    || this.nextToken.lexeme == "\\right") {
                    break;
                }
                if (this.nextToken.lexeme == "\\left") {
                    var nextToken = this.peek();
                    if (nextToken.token == LaTexLex.TokenEnum.PIPE
                        || nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS) {
                        this.factor();
                        continue;
                    } else {
                        break;
                    }
                }
                if (this.nextToken.token == LaTexLex.TokenEnum.FUNCTION_NAME
                    || this.nextToken.token == LaTexLex.TokenEnum.CONSTANT_VALUE
                    || this.nextToken.token == LaTexLex.TokenEnum.VARIABLE_NAME
                    || this.nextToken.token == LaTexLex.TokenEnum.DIGITAL_NUMBER
                    || this.nextToken.token == LaTexLex.TokenEnum.IDENTIFIER
                    || this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME
                    || this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS
                    ) {
                } else {
                    break;
                }
                this.factor();
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <Term>");
        },

        /// <summary>
        ///     A factor
        ///     Parse the string according to the following rule:
        ///     <Factor> -> [(+|-)]<Power> {^<Power>}  | <Power> {^\{<Expression>\}} | <Power> {<Power>}
        /// </summary>
        factor: function () {
            this.log("Enter <Factor>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FACTOR, "", this.currentNode);

            switch (this.nextToken.token) {
                case LaTexLex.TokenEnum.PLUS_OPERATOR:
                case LaTexLex.TokenEnum.MINUS_OPERATOR:
                    this.lex(true);
                    break;
                default:
                    break;
            }

            this.power();
            while (this.nextToken.token == LaTexLex.TokenEnum.POWER_OPERATOR
                || this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS
                || (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme != "\\left" && this.nextToken.lexeme != "\\right" && this.nextToken.lexeme != "\\cdot")
                || this.nextToken.token == LaTexLex.TokenEnum.DIGITAL_NUMBER
                || this.nextToken.token == LaTexLex.TokenEnum.VARIABLE_NAME
                || this.nextToken.token == LaTexLex.TokenEnum.CONSTANT_VALUE
                || this.nextToken.token == LaTexLex.TokenEnum.FUNCTION_NAME) {
                if (this.nextToken.token == LaTexLex.TokenEnum.POWER_OPERATOR) {
                    this.lex(true);
                    if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                        this.lex();
                        if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                            this.expression();
                        }
                        if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE)
                            this.lex();
                        else
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                    } else {
                        if (this.nextToken.token != LaTexLex.TokenEnum.END_OF_SOURCE) {
                            this.power();
                        } else {
                            this.error(this.errorEnum.UNEXPECTED_END_OF_SOURCE);
                        }
                    }
                } else {
                    this.power();
                }
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <Factor>");
        },

        /// <summary>
        ///     A power factor
        ///     Parse the string according to the following rule:
        ///     <Power> ->  [(+|-)](<Expression>)
        ///             |   [(+|-)]<LaTexCommand>
        ///             |   [(+|-)]<Number>
        ///             |   [(+|-)]<Variable>
        ///             |   [(+|-)]<Constant>
        ///             |   [(+|-)]<FunctionExpression>
        /// </summary>
        power: function () {
            var lexeme = this.nextToken.lexeme;
            this.log("Enter <Power> lexeme: {0}".format(lexeme));
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.POWER, "", this.currentNode);

            switch (this.nextToken.token) {
                case LaTexLex.TokenEnum.OPEN_PARENTHESIS:
                    this.lex(true);
                    this.expression();
                    if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS)
                        this.lex(true);
                    else
                        this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                    break;
                case LaTexLex.TokenEnum.LATEX_NAME:
                    this.laTexCommand();
                    break;
                case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                    this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                    break;
                case LaTexLex.TokenEnum.VARIABLE_NAME:
                    this.lex(true, this.nodeTypeEnum.VARIABLE_NAME);
                    break;
                case LaTexLex.TokenEnum.CONSTANT_VALUE:
                    this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                    break;
                case LaTexLex.TokenEnum.PLUS_OPERATOR:
                case LaTexLex.TokenEnum.MINUS_OPERATOR:
                    this.lex(true);
                    switch (this.nextToken.token) {
                        case LaTexLex.TokenEnum.DIGITAL_NUMBER:
                            this.lex(true, this.nodeTypeEnum.DIGITAL_NUMBER);
                            break;
                        case LaTexLex.TokenEnum.VARIABLE_NAME:
                            this.lex(true, this.nodeTypeEnum.VARIABLE_NAME);
                            break;
                        case LaTexLex.TokenEnum.CONSTANT_VALUE:
                            this.lex(true, this.nodeTypeEnum.CONSTANT_VALUE);
                            break;
                        case LaTexLex.TokenEnum.LATEX_NAME:
                            this.laTexCommand();
                            break;
                        case LaTexLex.TokenEnum.FUNCTION_NAME:
                            this.functionExpression();
                            break;
                        case LaTexLex.TokenEnum.OPEN_PARENTHESIS:
                            this.lex(true);
                            this.expression();
                            if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                                this.lex(true);
                            } else {
                                this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                            }
                            break;
                        default:
                            this.error(new this.Exception([this.errorEnum.DIGITAL_NUMBER_EXPECTED, this.errorEnum.VARIABLE_NAME_EXPECTED, this.errorEnum.CONSTANT_VALUE_EXPECTED]));
                            break;
                    }
                    break;
                case LaTexLex.TokenEnum.FUNCTION_NAME:
                    this.functionExpression();
                    break;
                default:
                    this.error(new this.Exception([this.errorEnum.DIGITAL_NUMBER_EXPECTED, this.errorEnum.CONSTANT_VALUE_EXPECTED, this.errorEnum.VARIABLE_NAME_EXPECTED, this.errorEnum.OPEN_PARENTHESIS_EXPECTED, this.errorEnum.LATEX_COMMAND_EXPECTED, this.errorEnum.POSITIVE_SIGN_EXPECTED, this.errorEnum.NEGATIVE_SIGN_EXPECTED, this.errorEnum.FUNCTION_EXPECTED]));
                    this.lex();
                    break;
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <Power> lexeme: {0}".format(lexeme));
        },

        /// <summary>
        ///     A LaTex command
        ///     Parse the string according to the following rule:
        ///     <LaTexCommand>  ->  \frac{<expression>}{<expression>}
        ///                     |   \sqrt{<expression>}
        ///                     |   \left(<expression>\right)
        ///                     |   \left|<expression>\right|
        ///
        /// </summary>
        laTexCommand: function () {
            var lexeme = this.nextToken.lexeme;
            this.log("Enter <LaTexCommand> lexeme: {0}".format(lexeme));
            if (this.nextToken.lexeme != "\\left" && this.nextToken.lexeme != "\\right") {
                this.currentNode = new this.TreeNode(this.nodeTypeEnum.LATEX_COMMAND, "", this.currentNode);
            }
            switch (this.nextToken.lexeme) {
                case "\\frac":
                    this.lex(true);
                    if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                        this.lex(true);
                        this.expression();
                        if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                            this.lex(true);
                            if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                                this.lex(true);
                                this.expression();
                                if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                                    this.lex(true);
                                } else {
                                    this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                                }
                            } else {
                                this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                            }
                        } else {
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                        }
                    } else {
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    }
                    break;
                case "\\sqrt":
                    this.lex(true);
                    if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_BRACE) {
                        this.lex(true);
                        this.expression();
                        if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_BRACE) {
                            this.lex(true);
                        } else {
                            this.error(this.errorEnum.CLOSING_BRACE_EXPECTED);
                        }
                    } else {
                        this.error(this.errorEnum.OPEN_BRACE_EXPECTED);
                    }
                    break;
                case "\\left":
                    this.lex();
                    if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS) {
                        this.lex(true);
                        this.expression();
                        if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right") {
                            this.lex();
                            if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                                this.lex(true);
                            } else {
                                this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                            }
                        } else {
                            this.error(this.errorEnum.RIGHT_COMMAND_EXPECTED);
                        }
                    } else if (this.nextToken.token == LaTexLex.TokenEnum.PIPE) {
                        this.lex(true);
                        this.expression();
                        if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right") {
                            this.lex();
                            if (this.nextToken.token == LaTexLex.TokenEnum.PIPE) {
                                this.lex(true);
                            } else {
                                this.error(this.errorEnum.PIPE_EXPECTED);
                            }
                        } else {
                            this.error(this.errorEnum.RIGHT_COMMAND_EXPECTED);
                        }
                    } else {
                        this.error(new this.Exception(this.errorEnum.OPEN_PARENTHESIS_EXPECTED, this.errorEnum.PIPI_EXPECTED));
                    }
                    break;
                case "\\right":
                    this.error(this.errorEnum.UNEXPECTED_RIGHT_COMMAND);
                    this.lex();
                    break;
                default:
                    this.error(this.errorEnum.UNKNOWN_LATEX_COMMAND_MET);
                    this.log("Unknown LaTex command met: ".format(this.nextToken.lexeme));
                    this.lex(true);
                    break;
            }

            if (lexeme != "\\left" && lexeme != "\\right") {
                // Back to the parent node
                this.currentNode = this.currentNode.parent;
            }
            this.log("Exit <LaTexCommand> lexeme: {0}".format(lexeme));
        },

        /// <summary>
        ///     A function expression
        ///     Parse a string according to the following rule:
        ///     <FunctionExpression>    ->  sin(<expression>)       | sin\left(<expression>\right)      | \sin(<expression>)    | \sin\left(<expression>\right)
        ///                             |   cos(<expression>)       | cos\left(<expression>\right)      | \cos(<expression>)    | \cos\left(<expression>\right)
        ///                             |   tan(<expression>)       | tan\left(<expression>\right)      | \tan(<expression>)    | \tan\left(<expression>\right)
        ///                             |   cot(<expression>)       | cot\left(<expression>\right)      | \cot(<expression>)    | \cot\left(<expression>\right)
        ///                             |   exp(<expression>)       | exp\left(<expression>\right)      | \exp(<expression>)    | \exp\left(<expression>\right)
        ///                             |   arcsin(<expression>)    | arcsin\left(<expression>\right)   | \arcsin(<expression>) | \arcsin\left(<expression>\right)
        ///                             |   arccos(<expression>)    | arccos\left(<expression>\right)   | \arccos(<expression>) | \arccos\left(<expression>\right)
        ///                             |   arctan(<expression>)    | arctan\left(<expression>\right)   | \arctan(<expression>) | \arctan\left(<expression>\right)
        ///                             |   arccot(<expression>)    | arccot\left(<expression>\right)   | \arccot(<expression>) | \arccot\left(<expression>\right)
        ///                             |   asin(<expression>)      | asin\left(<expression>\right)     | \asin(<expression>)   | \asin\left(<expression>\right)
        ///                             |   acos(<expression>)      | acos\left(<expression>\right)     | \acos(<expression>)   | \acos\left(<expression>\right)
        ///                             |   atan(<expression>)      | atan\left(<expression>\right)     | \atan(<expression>)   | \atan\left(<expression>\right)
        ///                             |   acot(<expression>)      | acot\left(<expression>\right)     | \acot(<expression>)   | \acot\left(<expression>\right)
        ///                             |   abs(<expression>)       | abs\left(<expression>\right)      | \abs(<expression>)    | \abs\left(<expression>\right)
        ///                             |   sign(<expression>)      | sign\left(<expression>\right)     | \sign(<expression>)   | \sign\left(<expression>\right)
        ///                             |   ln(<expression>)        | ln\left(<expression>\right)       | \ln(<expression>)     | \ln\left(<expression>\right)
        ///                             |   log(<expression>, <expression>) | log\left(<expression>, <expression>\right)    | \log(<expression>, <expression>)      | \log\left(<expression>, <expression>\right)
        ///                             |   sqrt(<expression>)      | sqrt\left(<expression>\right)     // \sqrt would only be treated as LaTex Command
        ///                             |   sec(<expression>)       | sec\left(<expression>\right)      | \sec(<expression>)    | \sec\left(<expression>\right)
        ///                             |   cosec(<expression>)     | cosec\left(<expression>\right)    | \cosec(<expression>)  | \cosec\left(<expression>\right)
        ///                             |   pow(<expression>, <expression>) | pow\left(<expression>, <expression>\right)        | \pow(<expression>, <expression>)  | \pow\left(<expression>, <expression>\right)
        /// </summary>
        functionExpression: function () {
            this.log("Enter <FunctionExpression>");
            this.currentNode = new this.TreeNode(this.nodeTypeEnum.FUNCTION_EXPRESSION, "", this.currentNode);
            switch (this.nextToken.lexeme) {
                case "sin":
                case "\\sin":
                case "cos":
                case "\\cos":
                case "tan":
                case "\\tan":
                case "cot":
                case "\\cot":
                case "exp":
                case "\\exp":
                case "arcsin":
                case "\\arcsin":
                case "arccos":
                case "\\arccos":
                case "arctan":
                case "\\arctan":
                case "arccot":
                case "\\arccot":
                case "asin":
                case "\\asin":
                case "acos":
                case "\\acos":
                case "atan":
                case "\\atan":
                case "acot":
                case "\\acot":
                case "abs":
                case "\\abs":
                case "sign":
                case "\\sign":
                case "ln":
                case "\\ln":
                case "sqrt":
                    // \sqrt would only be treated as LaTex Command
                case "sec":
                case "\\sec":
                case "cosec":
                case "\\cosec":
                case "sgn":
                case "\\sgn":
                    this.lex(true);
                    if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\left")
                        this.lex();
                    if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS) {
                        this.lex(true);
                        this.expression();
                        if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right")
                            this.lex();
                        if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                            this.lex(true);
                        } else {
                            this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                        }
                    } else {
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    }
                    break;
                case "log":
                case "\\log":
                case "pow":
                case "\\pow":
                    this.lex(true);
                    if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\left")
                        this.lex();
                    if (this.nextToken.token == LaTexLex.TokenEnum.OPEN_PARENTHESIS) {
                        this.lex(true);
                        this.expression();
                        if (this.nextToken.token == LaTexLex.TokenEnum.COMMA) {
                            this.lex(true);
                            this.expression();
                            if (this.nextToken.token == LaTexLex.TokenEnum.LATEX_NAME && this.nextToken.lexeme == "\\right")
                                this.lex();
                            if (this.nextToken.token == LaTexLex.TokenEnum.CLOSING_PARENTHESIS) {
                                this.lex(true);
                            } else {
                                this.error(this.errorEnum.CLOSING_PARENTHESIS_EXPECTED);
                            }
                        } else {
                            this.error(this.errorEnum.COMMA_EXPEXTED);
                        }
                    } else {
                        this.error(this.errorEnum.OPEN_PARENTHESIS_EXPECTED);
                    }
                    break;
                default:
                    this.lex();
                    break;
            }

            this.currentNode = this.currentNode.parent;
            this.log("Exit <FunctionExpression>");
        },

        errorEnum: {
            EVALUATION_OPERATOR_EXPECTED: { message: "Evaluation Operator \"=\" is expected." },
            OPEN_BRACE_EXPECTED: { message: "Open Brace \"{\" is expected." },
            LATEX_OPEN_BRACE_EXPECTED: { message: "Open Brace inside LaTex command \"\\{\" is expected." },
            CLOSING_BRACE_EXPECTED: { message: "Closing Brace \"}\" is expected." },
            LATEX_CLOSING_BRACE_EXPECTED: { message: "Closing Brace inside LaTex command \"\\}\" is expected." },
            DEPENDENT_VAR_Y_EXPECTED: { message: "Dependent Variable y is expected." },
            SEMICOLON_EXPECTED: { message: "Semicolon \";\" is expected." },
            DEPENDENT_VAR_X_EXPECTED: { message: "Dependent Variable x is expected." },
            OPEN_PARENTHESIS_EXPECTED: { message: "Open Parenthesis \"(\" is expected." },
            CLOSING_PARENTHESIS_EXPECTED: { message: "Closing Parenthesis \")\" is expected." },
            LATEX_COMMAND_EXPECTED: { message: "LaTex command (\\frac or \\sqrt) is expected." },
            DIGITAL_NUMBER_EXPECTED: { message: "Digital Number (123.123) is expected." },
            VAR_Y_EXPECTED: { message: "Variable y is expected." },
            VAR_X_EXPECTED: { message: "Variable x is expected." },
            VAR_T_EXPECTED: { message: "Variable t is expected." },
            VARIABLE_NAME_EXPECTED: { message: "Variable name (abc) is expected." },
            CONSTANT_VALUE_EXPECTED: { message: "Constant value (PI) is expected." },
            FUNCTION_EXPECTED: { message: "Function name (sin or cos) is expected." },
            COMMA_EXPECTED: { message: "Comma \",\"  is expected." },
            END_OF_SOURCE_EXPECTED: { message: "End of input is expected." },
            EQUAL_SIGN_EXPECTED: { message: "Equal sign '=' is expected." },
            POSITIVE_SIGN_EXPECTED: { message: "Positive sign '+' is expected." },
            NEGATIVE_SIGN_EXPECTED: { message: "Negative sign '-' is expected." },
            UNKNOWN_ERROR: { message: "Unknown error." },
            UNEXPECTED_END_OF_SOURCE: { message: "Unexpected end of source met." },
            LEFT_COMMAND_EXPECTED: { message: "The LaTex command '\\left' is expected." },
            RIGHT_COMMAND_EXPECTED: { message: "The LaTex command '\\right' is expected." },
            LESS_THAN_EXPECTED: { message: "The operator Less Than '<' is expected." },
            PIPE_EXPECTED: { message: "The pipe line '|' is expected." },
            UNEXPECTED_RIGHT_COMMAND: { message: "Unexpected LaTex command '\\right' met." },
            UNKNOWN_LATEX_COMMAND_MET: { message: "Unknown LaTex command met." }
        }
    };

    zizhujy.com.LaTexParser.TreeNode.evalFactor = function (/*
     * 'expression 1',
     * 'expression 2',
     * ...
     */expressions) {
        if (!(expressions instanceof Array)) {
            expressions = Array.prototype.slice.call(arguments, 0);
        }

        var sb = new StringBuffer();
        var baseIndex = 0;
        if (expressions[0] == "-" || expressions[0] == "+") {
            baseIndex = 1;
        }

        var i = baseIndex + 1;
        var base = expressions[baseIndex];
        var addRhsNextTime = false;
        
        while (!!expressions[i]) {
            if (expressions[i] == "^") {
                var pow = "pow({0}, {1})".format(expressions[i - 1], !!expressions[i + 1]
                    ? expressions[i + 1] : "");

                if (!!addRhsNextTime) {
                    base = "{0}{1}".format(base, pow);
                    addRhsNextTime = false;
                } else {
                    base = "pow({0}, {1})".format(base, !!expressions[i + 1] ? expressions[i + 1] : "");
                }

                i += 2;
            } else {
                if (!addRhsNextTime) {
                    base = "{0} * ".format(base);
                    i++;
                    addRhsNextTime = true;
                } else {
                    base = "{0}{1}".format(base, expressions[i - 1]);
                    
                    addRhsNextTime = false;
                }
            }
        }

        if (addRhsNextTime) {
            base = "{0}{1}".format(base, expressions[expressions.length - 1]);
        }

        sb.append(baseIndex == 0 ? base : expressions[0] + base);

        return sb.toString();
    };
})(zizhujy.com.LaTexLex);
