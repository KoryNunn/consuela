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
    cleaner.watch(emitter);

    // add a listener
    emitter.on('things', handler);

    // trigger an event
    emitter.emit('things');

    // cleanup the emitter
    cleaner.cleanup();

    // trigger an event that should no longer have any listeners
    emitter.emit('things');
});