var test = require('grape'),
    Consuela = require('../'),
    EventEmitter = require('events').EventEmitter;

test('watch', function(t){

    t.plan(1);

    var cleaner = new Consuela();
    var emitter = new EventEmitter();
    var handler = function(event){
        t.pass('recieved event');
    };

    // watch an emitter
    cleaner._watch(emitter);

    // add a listener
    emitter.on('things', handler);

    // trigger an event
    emitter.emit('things');

    // cleanup the emitter
    cleaner._cleanup();

    // trigger an event that should no longer have any listeners
    emitter.emit('things');
});

test('"inheritance" 1', function(t){

    t.plan(5);

    function Descendant(){
        this.stuff = 'things';
    }
    Descendant.prototype = Object.create(EventEmitter.prototype);
    Descendant.prototype.constructor = Descendant;
    Descendant = Consuela.init(Descendant);

    var descendant = new Descendant(),
        handler = function(event){
            t.pass('recieved event');
        };

    t.equal(descendant.stuff, 'things', 'inherited Descendant\'s methods');
    t.ok(descendant instanceof Descendant);
    t.ok(descendant instanceof EventEmitter);
    t.equal(descendant.constructor.name, 'Descendant');

    // add a listener
    descendant.on('things', handler);

    // trigger an event
    descendant.emit('things');

    // cleanup the descendant
    descendant._cleanup();

    // trigger an event that should no longer have any listeners
    descendant.emit('things');
});

test('"inheritance" 2', function(t){

    t.plan(5);

    function Descendant(){
        // "inherit"
        Consuela.init(this);
        this.stuff = 'things';
    }
    Descendant.prototype = Object.create(EventEmitter.prototype);
    Descendant.prototype.constructor = Descendant;

    var descendant = new Descendant(),
        handler = function(event){
            t.pass('recieved event');
        };

    t.equal(descendant.stuff, 'things', 'inherited Descendant\'s methods');
    t.ok(descendant instanceof Descendant);
    t.ok(descendant instanceof EventEmitter);
    t.equal(descendant.constructor.name, 'Descendant');

    // add a listener
    descendant.on('things', handler);

    // trigger an event
    descendant.emit('things');

    // cleanup the descendant
    descendant._cleanup();

    // trigger an event that should no longer have any listeners
    descendant.emit('things');
});