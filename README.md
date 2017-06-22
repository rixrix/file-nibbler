# Nibbler

> /nɪb(ə)lə/ is a tool for cutting sheet metal with minimal distortion.

If you're like me you've probably encountered this error message:

> Error: EMFILE, too many open files

There are dime dozen solutions online but I find some of them a bit hard to fit into my workflow. A library/module should be easy enough to drop in and re-use my existing logic, IMHO.

This module uses the queue function from [Async](https://caolan.github.io/async/) to process each file bit by bit at your disposal.

Rather than poking around your file systems file descriptor limit - let's get rid of that route and instead do the less severe way by using queue at the user-space level. This is not perfect - I must say but somehow it helped me.

## Install

From a technical point of view the code is pretty small, just copy/paste and you are done however do the steps below if you want to proceed.

### NPM

```bash
$> npm install file-nibbler
```

### Yarn
```bash
$> yarn add file-nibbler
```

## Usage

```javascript
var fileNibbler = require('file-nibbler').nibbler;
var MILLION_FILES_DIR = 'full/path/to/my/files/';

// This is your callback method for processing each file.
// Note that it should return a Promise so that `file-nibbler` knows
// when to call or process the next task from the queue
function myFileProcessor(pathToFile) {
    return new Promise(function(resolve, reject) {
        // do some work on the file, and resolve it once done
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

## API

### nibbler(path, [opts], callback(string))
Returns a Promise.

`path`

String, path to files folder

opts - Object, optional flags for various flags

`opts.filterBy` is a string, for filtering out specific file(s) from the path. It only accepts regex-based string eg: `^((?!flash.exe).)*$`, which returns all the files except flash.exe.

Default: all files

`opts.concurrencyLevel` is a number for setting up the concurrency level.

Default 5

`callback`

Object, required callback method wrapped in Promise. Nibbler calls this function once the item is in queue and passes the full path of the file as the first argument.


## Note

The module at its core is pretty basic but I'm using on production for munching thousands and gigabytes of data on low end EC2 machine.

## Todo

* ~~better handling of async and sync processing of file/queue. Current use-case is sync-mode for my callback~~
* Webpack
* Test
* Hook with TravisCI
* Auto-publish to NPM, NuGet, Bower
* ES6-ify
* TypeScript definition file

## References
* [Async#queue](https://caolan.github.io/async/docs.html#queue)

## License

MIT
