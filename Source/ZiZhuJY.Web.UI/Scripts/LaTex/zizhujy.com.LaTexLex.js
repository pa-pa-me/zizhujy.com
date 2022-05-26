;(function () {
    if(typeof zizhujy == "undefined") zizhujy = {};
    window.zizhujy = zizhujy;

    if(typeof zizhujy.com == "undefined") zizhujy.com = {};
    if(typeof zizhujy.com.LaTexLex== "undefined") zizhujy.com.LaTexLex = {
        version: 1.0,
        TokenEnum: {
            // value值越小，优先级越高。优先级是很重要的！比如 sin 可以是 Identifier，也可以是 function_name。优先做为 function_name
            // 考虑，故 function_name 项必须在 identifier 之前：
            y: {value: -3, name: "Variable - y", code: "y", regex: /^y$/},
            x: {value: -2, name: "Variable - x", code: "x", regex: /^x$/},
            t: {value: -1, name: "Variable - t", code: "t", regex: /^t$/},
            FUNCTION_NAME: {value: 0, name: "Function Name", code: "sin", regex: /^(sin|cos|tan|cot|pow|exp|sqrt|log|ln)$/},    
            CONSTANT_VALUE: {value: 1, name: "Constant Value", code: "PI", regex: /^(PI|E|e|pi)$/},   
            DIGITAL_NUMBER: {value: 2, name: "Digital Number", code: "123", regex: /^(\d+|\d*.\d+)$/},     
            IDENTIFIER: {value: 3, name: "Identifier", code: "abc", regex: /^[A-Za-z]\w*$/},
            PLUS_OPERATOR: {value: 4, name: "Plus Operator", code: "+", regex: /^\+$/},
            POWER_OPERATOR: {value: 5, name: "Power Operator", code: "^", regex: /^\^$/},
            MINUS_OPERATOR: {value: 6, name: "Minus Operator", code: "-", regex: /^\-$/},
            MULTIPLY_OPERATOR: {value: 7, name: "Multiply Operator", code: "*", regex: /^\*$/},
            DIVIDE_OPERATOR: {value: 8, name: "Divide Operator", code: "/", regex: /^\/$/},
            EVALUATION_OPERATOR: {value: 9, name: "Evaluation Operator", code: "=", regex: /^=$/},
            LATEX_NAME: {value: 10, name: "LaTex Name", code: "\\frac", regex: /^(\\frac|\\sqrt)$/},
            DOLLAR_SIGN: {value: 11, name: "Dollar Sign", code: "$", regex: /^\$$/},
            NEW_LINE: {value: 12, name: "New Line", code: "\r\n", regex: /^[\r\n]$/},
            WHITE_SPACE: {value: 13, name: "White Space", code: " ", regex: /^\s+$/},
            OPEN_PARENTHESIS: {value: 14, name: "Open Parenthesis", code: "(", regex: /^\($/},
            CLOSING_PARENTHESIS: {value: 15, name: "Closing Parenthesis", code: ")", regex: /^\)$/},
            OPEN_BRACE: {value: 16, name: "Open Brace", code: "{", regex: /^\{$/},
            CLOSING_BRACE: {value: 17, name: "Closing Brace", code: "}", regex: /^\}$/},
            SEMICOLON: {value: 18, name: "Semicolon", code: ";", regex: /^;$/},
            COMMA: {value: 19, name: "Comma", code: ",", regex: /^,$/},
            END_OF_SOURCE: {value: 89, name: "End of Source", code: "", regex: /^$/},
            NONSENSE: {value: 99, name: "Nonsense", code: "@", regex: /^[&#]+$/},
            OTHER: {value: 999, name: "Other", code: "...", regex: null}
        },
        CharClassEnum: {
            LETTER: {value: 0, name: "Letter", code: "A"},
            DIGIT: {value: 1, name: "Digit", code: "0"},
            POINT: {value: 2, name: "Point", code: "."},
            OPEN_PARENTHESIS: {value: 3, name: "Open Parenthesis", code: "("},
            CLOSING_PARENTHESIS: {value: 4, name: "Closing Parenthesis", code: ")"},
            OPEN_BRACE: {value: 5, name: "Open Brace", code: "{"},
            CLOSING_BRACE: {value: 6, name: "Closing Brace", code: "}"},
            PLUS_OPERATOR: {value: 7, name: "Plus Operator", code: "+"},
            POWER_OPERATOR: {value: 8, name: "Power Operator", code: "^"},
            MINUS_OPERATOR: {value: 9, name: "Minus Operator", code: "-"},
            MULTIPLY_OPERATOR: {value: 10, name: "Multiply Operator", code: "*"},
            DIVIDE_OPERATOR: {value: 11, name: "Divide Operator", code: "/"},
            EVALUATION_OPERATOR: {value: 12, name: "Evaluation Operator", code: "="},
            BACK_SLASH: {value: 13, name: "Back Slash", code: "\\"},
            DOLLAR_SIGN: {value: 14, name: "Dollar Sign", code: "$"},
            NEW_LINE: {value: 15, name: "New Line", code: "\r\n"},
            WHITE_SPACE: {value: 16, name: "White Space", code: " "},
            END_OF_SOURCE: {value: 17, name: "End of Source", code: ""},
            SEMICOLON: {value: 18, name: "Semicolon", code: ";"},
            COMMA: {value: 19, name: "Comma", code: ","},
            NONSENSE: {value: 99, name: "Nonsense", code: "@"},
            OTHER: {value: 999, name: "Other", code: "..."}
        },
        // 待处理的源输入字符串
        source: "",
        // 当前指向源的位置（第几个字符）
        index: 0,
        nextChar: "",
        lexeme: "",
        charClass: {value: 17, name: "Nonsense", code: "@"}, //this.CharClassEnum.NONSENSE,
        tokenLexemeList: [],

        getChar: function() {
            // Read one character
            this.nextChar = this.source.substr(this.index, 1);
            // Decide its char class
            switch(this.nextChar){
                case "A": case "B": case "C": case "D": case "E": case "F": case "G": case "H": case "I": case "J": case "K": case "L": case "M": case "N": case "O": case "P":
                case "Q": case "R": case "S": case "T": case "U": case "V": case "W": case "X": case "Y": case "Z": case "a": case "b": case "c": case "d": case "e": case "f":
                case "g": case "h": case "i": case "j": case "k": case "l": case "m": case "n": case "o": case "p": case "q": case "r": case "s": case "t": case "u": case "v":
                case "w": case "x": case "y": case "z": case "_":
                    this.charClass = this.CharClassEnum.LETTER; break;
                
                case "0": case "1": case "2": case "3": case "4": case "5": case "6": case "7": case "8": case "9":
                    this.charClass = this.CharClassEnum.DIGIT; break;

                case ".":
                    this.charClass = this.CharClassEnum.POINT; break;

                case "(":
                    this.charClass = this.CharClassEnum.OPEN_PARENTHESIS; break;

                case ")":
                    this.charClass = this.CharClassEnum.CLOSING_PARENTHESIS; break;

                case "{":
                    this.charClass = this.CharClassEnum.OPEN_BRACE; break;
                
                case "}":
                    this.charClass = this.CharClassEnum.CLOSING_BRACE; break;

                case "+":
                    this.charClass = this.CharClassEnum.PLUS_OPERATOR; break;

                case "-":
                    this.charClass = this.CharClassEnum.MINUS_OPERATOR; break;

                case "^":
                    this.charClass = this.CharClassEnum.POWER_OPERATOR; break;

                case "*":
                    this.charClass = this.CharClassEnum.MULTIPLY_OPERATOR; break;

                case "/":
                    this.charClass = this.CharClassEnum.DIVIDE_OPERATOR; break;

                case "=":
                    this.charClass = this.CharClassEnum.EVALUATION_OPERATOR; break;

                case "\\":
                    this.charClass = this.CharClassEnum.BACK_SLASH; break;

                case "$":
                    this.charClass = this.CharClassEnum.DOLLAR_SIGN; break;

                case "\r": case "\n": 
                    this.charClass = this.CharClassEnum.NEW_LINE; break;

                case " ": 
                    this.charClass = this.CharClassEnum.WHITE_SPACE; break;

                case "@": 
                    this.charClass = this.CharClassEnum.NONSENSE; break;

                case ";":
                    this.charClass = this.CharClassEnum.SEMICOLON; break;

                case ",":
                    this.charClass = this.CharClassEnum.COMMA; break;

                case "":
                    this.charClass = this.CharClassEnum.END_OF_SOURCE; break;

                default:
                    this.charClass = this.CharClassEnum.OTHER;
                    break;
            } // end switch (this.nextChar)
        },
        addChar: function(){
            if(this.charClass != this.CharClassEnum.WHITE_SPACE && this.charClass != this.CharClassEnum.NEW_LINE)
                this.lexeme += this.nextChar;
            this.index ++;
        },
        /// <summary>
        ///     一个Token-Lexeme对结构。
        /// </summary>
        /// <param name="token">zizhujy.com.lex.ToeknEnum类型，标记</param>
        /// <param name="lexeme">string，词素</param>
        TokenLexemeStruct: function(token, lexeme){
            this.token = token;
            this.lexeme = lexeme;
        },
        lookup: function(lexeme) {
            var token = this.TokenEnum.NONSENSE;
            for(var name in this.TokenEnum){
                if(!!this.TokenEnum[name].regex && this.TokenEnum[name].regex instanceof RegExp && this.TokenEnum[name].regex.test(lexeme)) {
                    token = this.TokenEnum[name];
                    break;
                }
            }            
            this.lexeme = "";
            return new this.TokenLexemeStruct(token, lexeme);
        },

        eos: function() {
            return this.index >= this.source.length;
        },

        lex: function(){
            if(!this.eos()){
                this.getChar();
                switch(this.charClass){
                    // Parse identifiers and reserved words
                    case (this.CharClassEnum.LETTER):
                        this.addChar();
                        this.getChar();
                        while(this.charClass == this.CharClassEnum.LETTER || this.charClass == this.CharClassEnum.DIGIT) {
                            this.addChar();
                            this.getChar();
                        }
                        return this.lookup(this.lexeme);
                        break;
                    case (this.CharClassEnum.DIGIT):
                        this.addChar();
                        this.getChar();
                        while(this.charClass == this.CharClassEnum.DIGIT) {
                            this.addChar();
                            this.getChar();
                        }
                        if(this.charClass == this.CharClassEnum.POINT) {
                            this.addChar();
                            this.getChar();
                            while(this.charClass == this.CharClassEnum.DIGIT) {
                                this.addChar();
                                this.getChar();
                            }
                            return this.lookup(this.lexeme);
                        }else{
                            return this.lookup(this.lexeme);
                        }
                        break;
                    case (this.CharClassEnum.POINT):
                        this.addChar();
                        this.getChar();
                        while(this.charClass == this.CharClassEnum.DIGIT){
                            this.addChar();
                            this.getChar();
                        }
                        return this.lookup(this.lexeme);
                        break;
                    case (this.CharClassEnum.OPEN_PARENTHESIS):
                        this.addChar();
                        this.getChar();
                        return this.lookup(this.lexeme);
                        break;
                    case (this.CharClassEnum.BACK_SLASH):
                        this.addChar();
                        this.getChar();
                        while(this.charClass == this.CharClassEnum.LETTER){
                            this.addChar();
                            this.getChar();
                        }
                        return this.lookup(this.lexeme);
                        break;
                    case (this.CharClassEnum.COMMA):
                        this.addChar();
                        this.getChar();
                        return this.lookup(this.lexeme);
                        break;
                    case (this.CharClassEnum.WHITE_SPACE):
                        this.addChar();
                        this.getChar();
                        while(this.charClass == this.CharClassEnum.WHITE_SPACE){
                            this.addChar();
                            this.getChar();
                        }
                        return null;
                        break;
                    case (this.CharClassEnum.NEW_LINE):
                        this.addChar();
                        this.getChar();
                        while(this.charClass == this.CharClassEnum.NEW_LINE) {
                            this.addChar();
                            this.getChar();
                        }
                        return null;
                        break;
                    default:
                        // This statement is very important, which keeps the lex move forward along the source string (this.index++).
                        // If this statement is missing, infinite loop may be introduced by the caller who calls lex() in its 
                        // while-loop or for-loop or whatever loop
                        this.addChar();
                        return this.lookup(this.lexeme);
                        break;
                } // end switch (this.charClass)
            }else{
                return new this.TokenLexemeStruct(this.TokenEnum.END_OF_SOURCE, "");
            }
        },
        init: function(source) {
            this.source = source;
            this.index = 0;
            this.nextChar = "";
            this.lexeme = "";
            this.charClass = this.CharClassEnum.NONSENSE;
        },
        run: function(){
            if(arguments.length > 0){
                this.init(arguments[0]);
            }

            this.tokenLexemeList.clear();
            while(!this.eos()) {
                var tokenLexeme = this.lex();
                if(!!tokenLexeme)
                    this.tokenLexemeList.push(tokenLexeme);
            }

            return this.tokenLexemeList;
        },
        htmlTokenLexemeListToTable: function(){
            var header1 = "Token", header2 = "Lexeme";
            if(arguments.length > 0) header1 = arguments[0];
            if(arguments.length > 1) header2 = arguments[1];
            var sb = new StringBuffer();
            var tableStruct = "<table class=\"tbGridView\"><thead><tr><th>{0}</th><th>{1}</th></tr></thead><tbody>{2}</tbody></table>";
            var rowStruct = "<tr><td>{0}</td><td>{1}</td></tr>";
            for(var i = 0; i < (this.tokenLexemeList.length); i++) {
                sb.append(rowStruct.format(this.tokenLexemeList[i].token.name, this.tokenLexemeList[i].lexeme));
            }
            return tableStruct.format(header1, header2, sb.toString());
        }
    };
})();