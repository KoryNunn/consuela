function getListenerMethod(emitter, methodNames){
    if(typeof methodNames === 'string'){
        methodNames = methodNames.split(' ');
    }
    for(var i = 0; i < methodNames.length; i++){
        if(methodNames[i] in emitter){
            return methodNames[i];
        }
    }
}

function Consuela(){
    this._trackedListeners = [];
}
Consuela.prototype.onNames = 'on addListener addEventListener';
Consuela.prototype.offNames = 'off removeListener removeEventListener';
Consuela.prototype._on = function(emitter, args, offName){
    this._trackedListeners.push({
        emitter: emitter,
        args: Array.prototype.slice.call(args),
        offName: offName
    });
};
function compareArgs(args1, args2){
    if(args1.length !== args2.length){
        return;
    }
    for (var i = 0; i < args1.length; i++) {
        if(args1[i] !== args2[i]){
            return;
        }
    };
    return true;
}
Consuela.prototype._off = function(emitter, args, offName){
    for (var i = 0; i < this._trackedListeners.length; i++) {
        var info = this._trackedListeners[i];

        if(emitter !== info.emitter || !compareArgs(info.args, args)){
            continue;
        }

        this._trackedListeners.splice(i, 1);
        i--;
    };
};
Consuela.prototype.on = function(emitter, args, offName){
    var method = getListenerMethod(emitter, this.onNames),
        oldOn = emitter[method];

    this._on(emitter, args, offName);
    oldOn.apply(emitter, args);
};
Consuela.prototype.cleanup = function(){
    while(this._trackedListeners.length){
        var info = this._trackedListeners.pop(),
            emitter = info.emitter,
            offNames = this.offNames;

        if(info.offName){
            offNames = [info.offName];
        }

        emitter[getListenerMethod(info.emitter, offNames)]
            .apply(emitter, info.args);
    }
};
Consuela.prototype.watch = function(emitter, onName, offName){
    var consuela = this,
        onNames = this.onNames,
        offNames = this.offNames;

    if(onName){
        onNames = [onName];
    }

    var onMethod = getListenerMethod(emitter, onNames),
        oldOn = emitter[onMethod];

    if(emitter[onMethod].__isConsuelaOverride){
        return;
    }

    emitter[onMethod] = function(){
        consuela._on(emitter, arguments, offName);
        oldOn.apply(emitter, arguments);
    };
    emitter[onMethod].__isConsuelaOverride = true;


    if(offName){
        offNames = [offName];
    }

    var offMethod = getListenerMethod(emitter, offNames),
        oldOff = emitter[offMethod];

    if(emitter[offMethod].__isConsuelaOverride){
        return;
    }

    emitter[offMethod] = function(){
        consuela._off(emitter, arguments, offName);
        oldOff.apply(emitter, arguments);
    };
    emitter[offMethod].__isConsuelaOverride = true;
};

module.exports = Consuela;