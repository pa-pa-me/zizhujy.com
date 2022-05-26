;(function () {
    if(typeof zizhujy == "undefined") return;
    if(typeof zizhujy.com == "undefined") return;
    if(typeof zizhujy.com.Collection == "undefined") {
        zizhujy.com.Collection = function () {
            this.__elements__ = [];
            for(var i = 0; i < arguments.length; i ++) {
                this.__elements__.push(arguments[i]);
            }

            this.elements = this.__elements__;

            if(!zizhujy.com.Collection.__initialized__) {
                zizhujy.com.Collection.prototype.add = function(obj){
                    this.__elements__.push(obj);
                };
                zizhujy.com.Collection.prototype.remove = function(obj) {
                    var index = this.__elements__.indexOf(obj);
                    if(index >= 0) 
                        this.__elements__.splice(index, 1);
                };
                zizhujy.com.Collection.prototype.removeAt = function( index ) {
                    this.__elements__.splice(index, 1);
                };
                zizhujy.com.Collection.prototype.clear = function() {
                    this.__elements__.clear();
                };
                zizhujy.com.Collection.prototype.count = function () {
                    return this.__elements__.length;
                };
                zizhujy.com.Collection.prototype.get = function (i) {
                    return this.__elements__[i];
                };
                zizhujy.com.Collection.__initialized__ = true;
            }
        };
    }
})();