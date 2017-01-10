Monk ID PHP
===========

[![Latest Stable Version](https://img.shields.io/packagist/v/monkdev/monk-id.svg?style=flat)](https://packagist.org/packages/monkdev/monk-id)
[![Build Status](https://img.shields.io/travis/MonkDev/monk-id-php/dev.svg?style=flat)](https://travis-ci.org/MonkDev/monk-id-php)
[![Scrutinizer Code Quality](https://img.shields.io/scrutinizer/g/MonkDev/monk-id-php/dev.svg?style=flat)](https://scrutinizer-ci.com/g/MonkDev/monk-id-php/?branch=dev)
[![Coverage Status](https://img.shields.io/coveralls/MonkDev/monk-id-php/dev.svg?style=flat)](https://coveralls.io/r/MonkDev/monk-id-php?branch=dev)
[![Dependency Status](https://img.shields.io/gemnasium/MonkDev/monk-id-php.svg?style=flat)](https://gemnasium.com/MonkDev/monk-id-php)

Integrate Monk ID authentication and single sign-on for apps and websites on the
server-side.

*   [Documentation](http://monkdev.github.io/monk-id-php/classes/Monk.Id.html)

Overview
--------

### Install

Using [Composer](http://getcomposer.org), add `monkdev/monk-id` to your
`composer.json`:

```json
{
  "require": {
    "monkdev/monk-id": "~1.0"
  }
}
```

```bash
$ composer update
```

Or:

```bash
$ composer require monkdev/monk-id:~1.0
```

### Configure

Configuration is done in an external INI file. There's a sample file in this
repository: `config/monkId.sample.yml`. Copy this file to your codebase, then
load the config in your code during initialization:

```php
Monk\Id::loadConfig('/path/to/monkId.ini', 'development');
```

Remember, replace the sample values with your own, and keep the file safe as it
contains your app secret.

### Access

If you have Monk ID JS configured to store the payload automatically in a cookie
(the default), you can skip the next part as the cookie is also loaded
automatically.

If not, the encoded payload can be passed directly, which is useful if you're
sending it in a GET/POST request instead:

```php
Monk\Id::loadPayload($monkIdPayload);
```

Loading the payload must be done before trying to access any values stored in
the payload. In an MVC framework, this usually means placing it in a method in
your `ApplicationController` that's executed before the specific action is
processed.

Once the payload is loaded, you can ask whether the user is signed in:

```php
Monk\Id::signedIn()
```

Or for their ID and email:

```php
Monk\Id::userId()
Monk\Id::userEmail()
```

`null` is returned if the user isn't signed in or the payload can't be decoded
and verified.

Development
-----------

[Grunt](http://gruntjs.com) is used heavily for development and requires the
following prerequisites:

*   [Node.js](http://nodejs.org)
*   [Grunt](http://gruntjs.com) CLI

Once those are installed and working, install the development dependencies:

```bash
$ npm install
```

[Composer](http://getcomposer.org) is used for PHP development dependencies,
which need to be installed as well:

```bash
$ composer install
```

### Workflow

Start by running the default Grunt task:

```bash
$ grunt
```

This will ensure the source is linted, tested, checked for quality, and then
watched for changes.

### Tests

Testing is done with [PHPUnit](http://phpunit.de). To run the tests:

```bash
$ grunt test
```

Grunt is setup to run the tests on changes to the source/tests. A code coverage
report is output after the test results.

Continuous integration is setup through [Travis CI](https://travis-ci.org/MonkDev/monk-id-php)
to run the tests against PHP v5.3, v5.4, and v5.5.
([Circle CI](https://circleci.com/gh/MonkDev/monk-id-php) is also setup to run
the tests against PHP v5.3, but is backup for now until multiple versions can
easily be specified.) The code coverage results are sent to [Coveralls](https://coveralls.io/r/MonkDev/monk-id-php)
during CI for tracking over time. Badges for both are dispayed at the top of
this README.

While the test suite is complete, it's not a bad idea to also test changes
manually in real-world integrations.

### Documentation

[phpDocumentor](http://phpdoc.org) is used for code documentation. To build:

```bash
$ grunt phpdoc
```

This creates a `doc` directory (that is ignored by git). The contents are
automatically published to the `gh-pages` branch when deploying.

### Quality

A number of code quality tools are configured to aid in development. To run them
all at once:

```bash
$ grunt quality
```

Grunt is setup to run them on changes to the source. Each tool can also be run
individually:

*   [php -l](http://www.php.net/manual/en/function.php-check-syntax.php):
    `$ grunt phplint`
*   [PHPLOC](https://github.com/sebastianbergmann/phploc): `$ grunt phploc`
*   [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer):
    `$ grunt phpcs`
*   [PHP Copy/Paste Detector](https://github.com/sebastianbergmann/phpcpd):
    `$ grunt phpcpd`
*   [PHP Mess Detector](http://phpmd.org): `$ grunt phpmd`
*   [SensioLabs Security Checker](https://github.com/sensiolabs/security-checker):
    `$ grunt security-checker`

[Scrutinizer](https://scrutinizer-ci.com/g/MonkDev/monk-id-php) is setup to
perform continuous code quality inspection. The quality badge is displayed at
the top of this README.

Deployment
----------

`monkdev/monk-id` is published to [Packagist](https://packagist.org) to allow
installation with Composer. Bumping the version, committing, tagging, pushing,
and updating the generated documentation (in the `gh-pages` branch) can be done
with a single command:

```bash
$ grunt deploy [--increment=<increment>]
```

`--increment` can be `build`, `git`, `patch`, `minor`, or `major` (anything
supported by [grunt-bump](https://github.com/vojtajina/grunt-bump)). If the
option is excluded, a prompt will provide a list of choices. Be sure to choose
the correct version by following [Semantic Versioning](http://semver.org).
