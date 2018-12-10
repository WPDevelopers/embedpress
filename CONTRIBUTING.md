# Contributing

*Avoid sending detailed commits to the SVN Repo!* - Use the GIT repository to keep the detailed history and send to SVN only the "release" commit.

## Publishing New Releases

EmbedPress follows the [Semantic Versioning 2.0.0](http://semver.org), which means that given a version number we have `MAJOR`.`MINOR`.`PATCH`. We should increment these when:
 1. `MAJOR` version when we make incompatible API changes;
 2. `MINOR` version when we add functionality in a backwards-compatible manner;
 3. `PATCH` version when we make backwards-compatible bug fixes.


## Steps to publish a new release:
1. [Update version on some files](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#1-updating-plugin-version);
2. [Update changelog](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#2-updating-changelog);
3. [Update branches](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#3-updating-branches);
4. [Update GitHub tags/releases](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#4-updating-github-tagsreleases);
5. [Generating a ready-to-install package](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#5-generating-a-ready-to-install-package);
6. [Push changes to SVN](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#6-pushing-changes-to-svn).


### 1. Updating plugin version
- Make sure that all changes were already pushed to `development` branch;
- Define the new [plugin version](https://github.com/OSTraining/EmbedPress/blob/master/CONTRIBUTING.md#publishing-new-releases);
- Go to `/readme.txt` and look for the line/code below. Replace `x.x.x` with the new version.
    ```
    Stable tag: x.x.x
    ```
- `/includes.php` - Look for the line/code below and replace `x.x.x` with the new version.
    ```
    define('EMBEDPRESS_VERSION', "x.x.x");
    ```
- `/embedpress.php` - Look for the line/code below and replace `x.x.x` with the new version.
    ```
    * Version:     x.x.x
    ```

### 2. Updating changelog
All changelogs must follow the same format (using the Markdown syntax), which is:
```
= x.x.x =
Release Date: YYYY-m-d

* foo;
* another change/fix/enhancement;
* list of what have changed.
```
Where `x.x.x` is the newest version and `YYYY-m-d` is the release date.

There's two files where the changelog must be updated with the latest changes: `/readme.txt` (look for the changelog section) and  `/changelog.txt`.

### 3. Updating branches
The `master` branch holds all released and production packages.

Once both version and changelog changes are ready and were already pushed to `development`, create a pull request from `development` to `master` branch.

### 4. Updating GitHub tags/releases
After the pull request get approved, still on GitHub, go to Releases and [draft a new release](https://github.com/OSTraining/EmbedPress/releases/new).

- **Tag Version**: inform the version you just launched prefixed by a `v`.
I.e: Let's say that the plugin was on version `1.4.2` and we patched something, hence the new version would be `1.4.3`. In this field, then, we'll put `v1.4.3`;
- **Target**: for stable releases, this should always be `master`;
- **Release Title**: the same value of **Tag Version**;
- **Description**: The list (of changes) part of the version's changelog;
- **Attach binaries**: we'll do on the next step.

### 5. Generating a ready-to-install package
Now that everything seems to be updated:
- Copy all plugin-only files (basically the whole `src` folder) into a separate directory (without .gitignore, etc);
- Rename this "new" folder to `embedpress`. All lowercased.
- Compress the folder into a `.zip` file;
- Rename the `.zip` file to `embedpress-x.x.x.zip` - where you must replace `x.x.x` with the newest version;
- Go to GitHub into your newest tag/release page (which you created on the previous step) and attach the  `.zip` file to the form and save.

### 6. Pushing changes to SVN
First, you must have the EmbedPress svn checked out somewhere in your machine. We'll call this local-mirror directory `svnDirectory`.

- Put the ready-to-install package contents (not the zip, only its content) into `svnDirectory/tags/x.x.x` where `x.x.x` is your release version;
- Replace `svnDirectory/trunk` contents with the same files/package you just added to the tags folder;
- Commit everything with a message announcing the new version, something like:
```
Releasing version x.x.x
```
Where `x.x.x` is the release version.
