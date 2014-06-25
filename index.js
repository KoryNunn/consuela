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
    if(getListenerMethod(this, this._onNames)){
        this._watch(this);
    }
}
Consuela.init = function(instance){
    // If passed a constructor
    if(typeof instance === 'function'){
        var Constructor = new Function("instance", "Consuela", "return function " + instance.name + "(){Consuela.call(this);return instance.apply(this, arguments);}")(instance, Consuela);

        Constructor.prototype = Object.create(instance.prototype);
        Constructor.prototype.constructor = Constructor;
        Constructor.name = instance.name;
        console.log(Constructor.name);
        for(var key in Consuela.prototype){
            Constructor.prototype[key] = Consuela.prototype[key];
        }
        return Constructor;
    }

    // Otherwise, if passed an instance
    for(var key in Consuela.prototype){
        instance[key] = Consuela.prototype[key];
    }
    Consuela.call(instance);
};
Consuela.prototype._onNames = 'on addListener addEventListener';
Consuela.prototype._offNames = 'off removeListener removeEventListener';
Consuela.prototype._on = function(emitter, args, offName){
    this._trackedListeners.push({
        emitter: emitter,
        args: Array.prototype.slice.call(args),
        offName: offName
    });
};
Consuela.prototype._cleanup = function(){
    while(this._trackedListeners.length){
        var info = this._trackedListeners.pop(),
            emitter = info.emitter,
            offNames = this._offNames;

        if(info.offName){
            offNames = [info.offName];
        }

        emitter[getListenerMethod(info.emitter, offNames)]
            .apply(emitter, info.args);
    }
};
Consuela.prototype._watch = function(emitter, onName, offName){
    var consuela = this,
        onNames = this._onNames;

    if(onName){
        onNames = [onName];
    }

    var method = getListenerMethod(emitter, onNames),
        oldOn = emitter[method];

    emitter[method] = function(){
        consuela._on(emitter, arguments, offName);
        oldOn.apply(emitter, arguments);
    };
};

module.exports = Consuela;