# File Nibbler

Uses [Async](https://caolan.github.io/async/) library called queue in processing hundreds, or thousands files and avoids the "Too Many Open Files" limit from your OS.

Rather than poking around your file systems file descriptor limit - let's get rid of that route and instead do the less severe way by using queue at the user-space level. This is not perfect - I must say but somehow it helped me.

## Install

From a technical point of view the code is pretty small, just copy/paste and you are done however if you will
trust me that I'm going to update and add more functionality at some stage, then do this.

```npm install file-nibbler```

```yarn add file-nibbler```

## How To Use

```javascript
var fileNibbler = require('file-nibbler').nibbler;
var MILLION_FILES_DIR = 'full/path/to/my/files/';

// This is your callback method for processing each file.
// Note that it should return a Promise so that `file-nibbler` knows
// when to call or process the next task from the queue
function myFileProcessor(pathToFile) {
    return new Promise(function(resolve, reject) {
        // do some work on the file, and resolve it once done
        //
        resolve();
    });
}

fileNibbler(MILLION_FILES_DIR, myFileProcessor)
.then(function() {
    // done, do your post processing
})
.catch(function(error) {
    // when an error occurs
});

```

## Done

* For the meantime, the main shit is done - it works and usable and I'm happy - you too hopefully

## Todo

* ~~better handling of async and sync processing of file/queue. Current use-case is sync-mode for my callback~~
* Add fancy transpiler
* Add automated test - get the best and the sexiest
* CI w/ Travis
* Auto-publish to NPM, NuGet, Bower - whatever code registry available
* ES6-ify
* TypeScript definition file
* Test on ARMv7 (not sure why)

## License

MIT
