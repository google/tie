# Development Manual

This document is meant to help serve as a guide for developers to TIE.

## File Organization

Right now, TIE's code is broken up into a series of folders:

* `assets`: This folder holds the information about our questions.

* `client`: This folder holds the majority of our code - including all of the components, code processors, evaluators, etc.

* `hooks`: This folder currently just houses the `pre-push` script.

* `karma_coverage_reports`: This folder is where the coverage reports are stored and updated.

* `protractor_tests`: This folder houses our End-to-End (e2e) tests and configurations.

* `scripts`: This folder has all of our scripts - mainly used for testing purposes.

* `third_party`: This folder houses all of our approved third party code.

## Testing

All of our unit tests are created in our `*Spec.js`-named files. The `*` represents the file name
for the component(s) that the sister `Spec` file is testing.

It is highly encouraged that you write tests for as much code coverage as possible. In order to test
 for coverage, you can run:

`bash scripts/run_karma_tests.sh --enable-coverage`

to run Karma tests in addition to generating coverage reports in the `karma_coverage_reports`
folder. In order to see the report itself, simply open `karma_coverage_reports/index.html` in your
browser. There, you'll be able to see the lines that have been hit or missed from your tests.

## Style

We want to make sure that our code keeps a fairly consistent coding style, and in order to make it easy for you, we have a linter that you can run to double check that your code is aligned with our guidelines.
To run the linter, simply run:

`bash scripts/run_linter.sh`

## Dev workflow

All code that gets merged with our `master` branch must be reviewed and approved.
Thus, for each change you want to add to the repo, make sure to create a separate branch. Then, once
 you're satisfied with the changes, you can push up your code and submit a Pull Request (PR).
In the PR description, simply and concisely state what you've changed in that branch.
Once you've submitted a PR, at least one other developer will have to review and approve your code
before it can then be finally merged. If your reviewer requests any changes, you must address them
before you can get a "LGTM" (Looks good to me!).
