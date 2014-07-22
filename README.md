# Consuela

No no.. I clean.

Consuela tracks bound events, and can be told to clean up when it is time to dispose of an object.

## Usage

Create an instance:

    var cleaner = new Consuela();

Watch an emitter:

    cleaner.watch(someEmitter);

Any events bound to the emitter after watch will be tracked by Conseula.

At a later point, when you want to despose of all events bound to all watched emitters:

    cleaner.cleanup();

Now, all previoudly bound events will no longer be bound.

Warning: all events bound to the emitter after this call will be cleaned up even if they were added by a third party!

You can be more specific, if your emitter is used elsewhere:

    cleaner.on(emitter, ['click', function(){...}]);

By default consuela knows to look for .on, .addEvent, .addEventListener and their respective 'off' methods
But you can tell it a different set of on and off method names if you need to:

    cleaner.watch(someWeirdEmitter, 'totesAddEvent', , 'totesUnAddEvent');