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
Consuela.prototype.on = function(emitter, args, offName){
    this._trackedListeners.push({
        emitter: emitter,
        args: Array.prototype.slice.call(args),
        offName: offName
    });
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

    emitter[method] = function(){
        consuela.on(emitter, arguments, offName);
        oldOn.apply(emitter, arguments);
    };
};

module.exports = Consuela;