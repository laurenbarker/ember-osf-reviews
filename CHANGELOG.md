# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Headless Firefox for tests
- Integration tests for
  - moderation-list-row component
  - action-feed component
  - action-feed-entry component
- Pending count on Reviews Dashboard
  - Skeleton screens for providers list

### Changed
- Remove global eslint rule and inline in router
- Update travis to use Firefox
- Update README
- Use .nvmrc file (for travis and local)
- Update yarn.lock
- Use COS ember-base image and multi-stage build
  - Notify DevOps prior to merging into master to update Jenkins
- Show moderator name (instead of creator) in the accepted/rejected records in the moderation list

### Removed
- Remove name link from action logs in the dashboard view

### Fixed
- Fix Loading indicator on Reviews dashboard which was not displaying when user clicks on see more link button.
- Add loading indicator for preprints titles on the Reviews dashboard.

## [0.1.1] - 2017-11-02
### Fixed
* Show most recent data after moderator makes a decision and looks at it immediately.
* Fix timezone issue on moderation list page.

## [0.1.0] - 2017-10-26
### Added
MVP release of Reviews!

* Allow provider admins to set up moderation, choosing a workflow and settings
* Allow moderators to view submissions by state (pending/accepted/rejected)
* Allow moderators to read submissions and accept/reject them with comment
