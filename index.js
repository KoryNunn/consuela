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
        onNames = this.onNames;

    if(onName){
        onNames = [onName];
    }

    var method = getListenerMethod(emitter, onNames),
        oldOn = emitter[method];

    if(emitter[method].__isConsuelaOverride){
        return;
    }

    emitter[method] = function(){
        consuela._on(emitter, arguments, offName);
        oldOn.apply(emitter, arguments);
    };
    emitter[method].__isConsuelaOverride = true;
};

module.exports = Consuela;