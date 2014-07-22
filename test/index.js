var test = require('grape'),
    Consuela = require('../'),
    EventEmitter = require('events').EventEmitter;

test('watch', function(t){

    t.plan(3);

    var cleaner = new Consuela();
    var emitter = new EventEmitter();
    var handler = function(event){
        t.pass('recieved event');
    };

    // watch an emitter
    cleaner.watch(emitter);

    // add a listener
    emitter.on('things', handler);

    // trigger an event
    emitter.emit('things');

    // cleanup the emitter
    cleaner.cleanup();

    t.equal(cleaner._trackedListeners.length, 0, 'tracked listener removed');
    t.equal(emitter._events.things, undefined, 'emitter event removed');

    // trigger an event that should no longer have any listeners
    emitter.emit('things');
});

test('removal', function(t){

    t.plan(3);

    var cleaner = new Consuela();
    var emitter = new EventEmitter();
    var handler = function(event){
        t.pass('received event');
    };

    // watch an emitter
    cleaner.watch(emitter);

    // add a listener
    emitter.on('things', handler);

    // trigger an event
    emitter.emit('things');

    // rmove the listener
    emitter.removeListener('things', handler);

    t.equal(cleaner._trackedListeners.length, 0, 'tracked listener removed');
    t.equal(emitter._events.things, undefined, 'emitter event removed');

    // trigger an event that should no longer have any listeners
    emitter.emit('things');
});

test('custom on', function(t){

    t.plan(3);

    var cleaner = new Consuela();
    var emitter = new EventEmitter();
    var handler = function(event){
        t.pass('recieved event');
    };

    // watch an emitter
    cleaner.on(emitter, ['things', handler]);

    // trigger an event
    emitter.emit('things');

    // cleanup the emitter
    cleaner.cleanup();

    t.equal(cleaner._trackedListeners.length, 0, 'tracked listener removed');
    t.equal(emitter._events.things, undefined, 'emitter event removed');

    // trigger an event that should no longer have any listeners
    emitter.emit('things');
});
