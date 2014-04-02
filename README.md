Monk ID PHP
===========

[![Latest Stable Version](https://poser.pugx.org/monkdev/monk-id/v/stable.png)](https://packagist.org/packages/monkdev/monk-id)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/MonkDev/monk-id-php/badges/quality-score.png?s=7bb86d012d75c7911d9d7bd1c7706cfe811e5d68)](https://scrutinizer-ci.com/g/MonkDev/monk-id-php/)

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
        "monkdev/monk-id": "*"
    }
}
```

```bash
$ composer update
```

Or:

```bash
$ composer require monkdev/monk-id:*
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

[Grunt](http://gruntjs.com) is used heavily for development, so be sure to have
Node.js, npm, and grunt-cli installed. Then install the development
dependencies:

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

This will ensure the source is linted, checked for quality, and then watched for
changes.

During development, changes must be tested manually since an automated test
suite does not yet exist. This is best done by requiring the library locally in
an app or website that integrates it already.

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

The `default` and `build` tasks include this, and `watch` (part of `default`)
automatically runs a number of them on changes to the source.

Each tool can also be run individually:

*   [php -l](http://www.php.net/manual/en/function.php-check-syntax.php)
    ```bash
    $ grunt phplint
    ```
*   [PHPLOC](https://github.com/sebastianbergmann/phploc)
    ```bash
    $ grunt phploc
    ```
*   [PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)
    ```bash
    $ grunt phpcs
    ```
*   [PHP Copy/Paste Detector](https://github.com/sebastianbergmann/phpcpd)
    ```bash
    $ grunt phpcpd
    ```
*   [PHP Mess Detector](http://phpmd.org)
    ```bash
    $ grunt phpmd
    ```
*   [PHP Dead Code Detector](https://github.com/sebastianbergmann/phpdcd)
    ```bash
    $ grunt phpdcd
    ```
*   [SensioLabs Security Checker](https://github.com/sensiolabs/security-checker)
    ```bash
    $ grunt security-checker
    ```

Deployment
----------

This library is published to [Packagist](https://packagist.org) to allow
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
