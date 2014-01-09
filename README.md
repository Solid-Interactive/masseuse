# masseuse [![Build Status](https://travis-ci.org/Solid-Interactive/masseuse.png?branch=master)](https://travis-ci.org/Solid-Interactive/masseuse)

Version: _0.1.1_

https://github.com/Solid-Interactive/masseuse

## Docs & Tests

* [JSDocs](http://solid-interactive.github.io/masseuse/docs/)
* [Tests - unoptimized for readability](http://solid-interactive.github.io/masseuse/tests/)
* See the [README directory](https://github.com/Solid-Interactive/masseuse/tree/master/README) for more detailed explanations.

## Installation

```shell
bower install masseuse
```

After getting masseuse, include it as a package in your requirejs config:

```javascript
require.config({
    ...
    packages : [
        {
            name : 'masseuse',
            location : 'components/masseuse/app'
        }
    ]
    ...
});
```

## Description

Masseuse is a Backbone helper library that uses RequireJS AMDs.

Masseuse is functional, and documentation and tests are being fleshed out.

Masseuse does five main things:

1. Adds lifecycle methods to Views that are optionally async using jQuery promises.
1. Allows easier separation of Views into a config and functionality sections by providing several shortcut configs.
1. Adds support for adding child Views.
1. Provides Proxy and Computed Properties for Masseuse Models
1. Provides a Masseuse Router extension of the Backbone Router with a before routing callback.

Additionally there is support for append or replacing the `el` of views, optional plugin methods on view initialization,
and a channels singleton for use as an event bus.

## Usage

Look at the tests for example usage. More documentation coming soon.

## Contributing

Fork git repo, then:

```shell
bower install
```

For use in the browser:

```shell
npm install -g grunt-cli
```

To setup headless browse testing:

``shell
npm install -g mocha-phantomjs phantomjs
```

`grunt test` runs, opens, and watches the tests in the browser. Pull requests welcomed!
`grunt test-cli` runs tests headless.

## Release Notes

* 0.1.1 - 2014-01-09 - bug fix:
    * ensuring that masseuse view configs can pass view specific formatters and binders
* 0.1.0 - 2014-01-08 - new feature:
    * added plugin that allows the use of rivets with models, collections, views
* 0.0.3 - 2014-01-07 - bug fix:
    * docs updates
* 0.0.2 - 2014-01-07 - bug fix:
    * lifecycle now waits for child views
* 0.0.1-alpha - 2014-01-03:
    * initial release

## Contributors (`git shortlog -s -n`)

* Peter Ajtai
* Greg Larrenaga
* Cooper Hilscher
* Jonathan Waltner
* Jesse McCabe
* Travis McHattie
