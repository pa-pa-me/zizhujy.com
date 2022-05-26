; (function () {
    if(typeof zizhujy == "undefined") zizhujy = {};
    window.zizhujy = zizhujy;

    if (typeof zizhujy.com == "undefined") zizhujy.com = {};

    if (typeof zizhujy.com.Collection === "undefined") {
        throw "zizhujy.com.DataTable is dependent on zizhujy.com.Collection which hasn't been referenced yet!";
    }

    if(typeof zizhujy.com.DataTableCell == "undefined") {
        zizhujy.com.DataTableCell = function () {
            this.row = 0;
            this.col = 0;
            this.value = "";
            if(arguments.length > 0) {
                switch(typeof arguments[0]){
                    case "object":
                        try{
                            this.value = arguments[0].value;
                            this.row = arguments[0].row;
                            this.col = arguments[0].col;
                        }catch (ex) {
                            throw "构造函数 DataTableCell() 的参数不正确。 {0}".format(ex);
                        }
                        break;
                    default:
                        this.value = arguments[0];
                        break;
                }
            }
            if(arguments.length > 1) this.row = arguments[1];
            if(arguments.length > 2) this.col = arguments[2];

            if(!this.__initialized__) {
                zizhujy.com.DataTableCell.prototype.toHtml = function(htmlEncode){
                    var value = "&nbsp;";
                    if(!!this.value && this.value.length > 0) {
                        value = this.value;

                        if(!!htmlEncode) value = value.htmlEncode();
                    }
                    return "<td>{0}</td>".format(value);
                };
                this.__initialized__ = true;
            }
        };
    }
    if(typeof zizhujy.com.DataTableRow == "undefined") {
        zizhujy.com.DataTableRow = function () {
            this.rowNo = 0;
            this.cells = [];
            if(arguments.length > 0) {
                var args = Array.prototype.slice.call(arguments);
                if(arguments[0] instanceof Array) args = arguments[0];
                for(var i = 0; i < args.length; i++) {
                    if(args[i] instanceof zizhujy.com.DataTableCell) 
                        this.cells.push(args[i]);
                    else {
                        switch(typeof args[i]) {
                            case "object":
                                this.cells.push(new zizhujy.com.DataTableCell(args[i]));
                                break;
                            default:
                                this.cells.push(new zizhujy.com.DataTableCell(args[i], this.rowNo, i));
                                break;
                        }
                    }
                }
            }

            if(!this.__initialized__) {
                zizhujy.com.DataTableRow.prototype.setRowNo = function(row){
                    this.rowNo = row;
                    for(var i = 0; i < this.cells.length; i++) {
                        this.cells[i].row = row;
                    }
                };

                zizhujy.com.DataTableRow.prototype.toHtml = function(htmlEncode){
                    var sb = new StringBuffer();
                    for(var i = 0; i < this.cells.length; i++) {
                        sb.append(this.cells[i].toHtml(htmlEncode));
                    }
                    return "<tr>{0}</tr>".format(sb.toString());
                };

                this.__initialized__ = true;
            }
        };
    }
    if(typeof zizhujy.com.DataTableColumn == "undefined") {
        zizhujy.com.DataTableColumn = function () {
            this.colNo = 0;
            this.colName = "";
            this.cells = [];

            if(arguments.length > 0) this.colName = arguments[0];

            if(!this.__initialized__) {
                zizhujy.com.DataTableColumn.prototype.setColumnNo = function (col) {
                    this.colNo = col;
                    for(var i = 0; i < this.cells.length; i++) {
                        this.cells[i].col = col;
                    }
                };

                zizhujy.com.DataTableColumn.prototype.toHtml = function() {
                    return "<col />";
                };

                this.__initialized__ = true;
            }
        };
    }
    if(typeof zizhujy.com.DataTableCellCollection == "undefined") {
        zizhujy.com.DataTableCellCollection = function() {
            zizhujy.com.Collection.call(this, arguments);
            if(!zizhujy.com.DataTableCellCollection.__initialized__) {
                zizhujy.com.DataTableCellCollection.prototype.toHtml = function (htmlEncode) {
                    var sb = new StringBuffer();
                    for(var i = 0; i < this.elements.length; i++) {
                        var cell = this.elements[i];
                        sb.append(cell.toHtml(htmlEncode));
                    }

                    return sb.toString();
                };
                zizhujy.com.DataTableCellCollection.__initialized__ = true;
            }
        }; zizhujy.com.DataTableCellCollection.prototype = new zizhujy.com.Collection();
    }
    if(typeof zizhujy.com.DataTableRowCollection == "undefined") {
        zizhujy.com.DataTableRowCollection = function () {
            zizhujy.com.Collection.call(this, arguments);
            if(!zizhujy.com.DataTableRowCollection.__initialized__) {
                zizhujy.com.DataTableRowCollection.prototype.add = function () {
                    var row = null;
                    if(arguments[0] instanceof zizhujy.com.DataTableRow) {
                        row = arguments[0];
                    } else {
                        var args = Array.prototype.slice.call(arguments);
                        row = new zizhujy.com.DataTableRow(args);
                    }

                    zizhujy.com.Collection.prototype.add.call(this, row);
                };

                zizhujy.com.DataTableRowCollection.prototype.toHtml = function (htmlEncode) {
                    var sb = new StringBuffer();
                    for(var i = 0; i < this.elements.length; i++) {
                        var row = this.elements[i];
                        sb.append(row.toHtml(htmlEncode));
                    }

                    return sb.toString();
                };
                zizhujy.com.DataTableRowCollection.__initialized__ = true;
            }
        }; zizhujy.com.DataTableRowCollection.prototype = new zizhujy.com.Collection();
    }
    if(typeof zizhujy.com.DataTableColumnCollection == "undefined") {
        zizhujy.com.DataTableColumnCollection = function () {
            zizhujy.com.Collection.call(this, arguments);
            if(!zizhujy.com.DataTableColumnCollection.__initialized__) {
                zizhujy.com.DataTableColumnCollection.prototype.add = function () {
                    var col = null;
                    if(arguments[0] instanceof zizhujy.com.DataTableColumn) {
                        col = arguments[0];
                    }else {
                        col = new zizhujy.com.DataTableColumn(arguments[0]);
                    }

                    zizhujy.com.Collection.prototype.add.call(this, col);
                };

                zizhujy.com.DataTableColumnCollection.prototype.toHtml = function(htmlEncode) {
                    var sb = new StringBuffer();
                    for(var i = 0; i < this.elements.length; i++) {
                        var col = this.elements[i];
                        sb.append(col.toHtml(htmlEncode));
                    }

                    return sb.toString();
                };

                zizhujy.com.DataTableColumnCollection.__initialized__ =true;
            }
        }; zizhujy.com.DataTableColumnCollection.prototype = new zizhujy.com.Collection();
    }
    if(typeof zizhujy.com.DataTable == "undefined") { 
        zizhujy.com.DataTable = function (){
            this.rows = new zizhujy.com.DataTableRowCollection();
            this.columns = new zizhujy.com.DataTableColumnCollection();
            if(!this.__initialized__) {
                zizhujy.com.DataTable.prototype.clear = function () {
                    this.rows.clear();
                    this.columns.clear();
                };

                /// <summary>
                ///     将DataTable转化成Html表示形式
                /// </summary>
                /// <remark>
                ///     重载：
                ///     1. toHtml();
                ///     2. toHtml(true);
                ///     3. toHtml(cssClass, true);
                ///     4. toHtml(cssClass, true, caption);
                ///     5. toHtml(cssClass, caption);
                ///     6. toHtml(cssClass);
                ///     7. toHtml(true, caption);
                /// </remark>
                zizhujy.com.DataTable.prototype.toHtml = function () {
                    var cssClass = "";
                    var htmlEncode = false;
                    var caption = "";
                    switch(typeof arguments[0]) {
                        case "boolean":
                            htmlEncode = arguments[0];
                            switch(typeof arguments[1]) {
                                case "string":
                                    caption = arguments[1];
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "string":
                            cssClass = arguments[0];
                            switch(typeof arguments[1]) {
                                case "boolean":
                                    htmlEncode = arguments[1];
                                    switch(typeof arguments[2]) {
                                        case "string":
                                            caption = arguments[2];
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                case "string":
                                    caption = arguments[1];
                                default:
                                    break;
                            }
                        default:
                            break;
                    }
                    var sb = new StringBuffer();
                    sb.append("<table ");
                    if(cssClass.length > 0) sb.append("class=\"{0}\"".format(cssClass));
                    sb.append(">");
                    if(!!caption && caption.length > 0)
                        sb.append(  "<caption>{0}</caption>".format(caption));
                    sb.append(  "<colgroup>");
                    sb.append(      this.columns.toHtml(htmlEncode));
                    sb.append(  "</colgroup>");
                    sb.append(  "<thead>");
                    sb.append(      "<tr>");
                    for(var i = 0; i < this.columns.elements.length; i++) {
                        var col = this.columns.elements[i];
                        sb.append(      "<th>{0}</th>".format(col.colName));
                    }
                    sb.append(      "</tr>");
                    sb.append(  "</thead>");
                    sb.append(  "<tbody>");
                    sb.append(      this.rows.toHtml(htmlEncode));
                    sb.append(  "</tbody>");
                    sb.append("</table>");

                    return sb.toString();
                };

                this.__initialized__ = true;
            }
        };
    }
})();