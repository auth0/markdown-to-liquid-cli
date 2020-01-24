# markdown-to-liquid

This script can be used to manually convert a markdown email template to an identical liquid email template.

## Instructions

Pre-requisites:
- Node.js 10.x+
- NPM

Setup:
- Checkout this repository
- Run `npm install`

To convert a markdown template, first save the template on your computer and run:
```shell script
$ cat my_template.md | node index.js

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
...
</html>
```

The liquid template will be output on stdout. To save to a file:
```shell script
$ cat my_template.md | node index.js > my_template.liquid
```

