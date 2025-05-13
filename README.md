# Modernize

This exercise was done using html, css and typescript.

## Pre-requisites

This project uses:

* [bun](https://bun.sh/): Toolkit used to bundle the project
* [http-server](https://www.npmjs.com/package/http-server): npm package used to create a quck local server to serve the build.

## How to run the project?

In order to run the project, you have the following options:

1. `npm start`: This command is used when developing, it starts the watch mode and reloads the page so you can see the changes.
2. `npm build`: This command will create the build bundle.
3. `npm run serve`: This command will run `npm build` and create a local server to test the bundle, this uses `http-server` to create the local server.

## How much time took to complete this?

The whole project took around 6 hours, working during the weekend and some final touches on May 12th.

## What was the trickiest part / took the longest?

### The trickiest part

Validating the form using all the built-in validators was tricky, instead of adding custom properties to the inputs, I went with using the built-in ones and using javascript to verify and show the feedback to the users when needed.

### What took the longest?

The phone masking required me to think on a way to achieve that, and while testing it, found that I also needed to add support to edition in the middle of the field without losing the cursor position, so it extended the time to complete the functionality the way I wanted.

## Trivia

* The phone mask allows editing the value from the middle of the content without loosing the cursor position.
* If a mixed value between chars and digits is pasted into the phone field, it will remove all chars and preserve the digits while it applies the mask.
* All form validations work with the built-in validators, meaning, no need for extra markup, if we want a required field, we use `required` property and so on.
* Form submission and validation also works with form properties, it uses the method and action set in the form to do the ajax request.
* Form validation works on blur for inputs, and also when trying to submit the form.
* Added a small animation to let the user know when the form is being submitted, and added a small tweak to also let the user know that th button is inactive once the form is submitted.