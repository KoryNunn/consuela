# Consuela

No no.. I clean.

Consuela tracks bound events, and can be told to clean up when it is time to dispose an object.

## Usage

Create an instance:

    var cleaner = new Consuela();

Watch an emitter:

    cleaner._watch(someEmitter);

Any events bound to the emitter after _watch will be tracked by Conseula.

At a later point, when you want to despose of all events bound to all watched emitters:

    cleaner._cleanup();

Now, all previoudly bound events will no longer be bound.

By default consuela knows to look for .on, .addEvent, .addEventListener and their respective 'off' methods
But you can tell it a different set of on and off method names if you need to:

    cleaner._watch(someWeirdEmitter, 'totesAddEvent', , 'totesUnAddEvent');

There are a few ways to inherit from Consuela:

# 1

    var MyCoolConstructor(){
        // Put consuela methods onto this instance each time one is made.
        Consuela.init(this);

        ...
        other ctor code
        ...
    }
    MyCoolConstructor.prototype = Object.create(EventEmitter.prototype);

# 2

Create a new constructor from one you've created previously, that sets up methods once.

    var MyCoolConstructor(){
        ...
        ctor code
        ...
    }
    MyCoolConstructor.prototype = Object.create(EventEmitter.prototype);
    // Override MyCoolConstructor with a new function that does everything from both MyCoolConstructor and Conseula
    MyCoolConstructor = Consuela.init(MyCoolConstructor);

Both work pretty much the same, instances of the first will perform slightly better during usage, but instances of the second should be faster to create.
