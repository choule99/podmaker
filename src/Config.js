const _ = require('lodash');

class Git {

    constructor(json) {
        this._url = json.url;
        this._branch = json.branch;
        this._tag = json.tag;
    }

    get url() {
        return this._url;
    }

    get branch() {
        return this._branch;
    }

    get tag() {
        return this._tag;
    }
}

class Framework {
    constructor(name, json) {
        this._name = name;
        this._ios = json.ios || null;
        this._osx = json.osx || null;
        this._watchos = json.watchos || null;

        if (!_.isBoolean(this._ios) && !_.isBoolean(this._osx) && !_.isBoolean(this._watchos)) {
            this._ios = true;
            this._osx = true;
            this._watchos = true;
        }
    }

    get name() {
        return this._name;
    }

    get ios() {
        return this._ios;
    }

    get osx() {
        return this._osx;
    }

    get watchos() {
        return this._watchos;
    }

    supports(platform) {
        if (platform === 'ios') return this._ios === true;
        if (platform === 'osx') return this._osx === true;
        if (platform === 'watchos') return this._watchos === true;
        return false;
    }
}

class Dependency {
    constructor(name, json) {
        this._name = name;
        this._version = json.version;
        this._ios = json.ios;
        this._osx = json.osx;
        this._watchos = json.watchos;

        if (!_.isBoolean(this._ios) && !_.isBoolean(this._osx) && !_.isBoolean(this._watchos)) {
            this._ios = true;
            this._osx = true;
            this._watchos = true;
        }

        this._git = json.git != null ? new Git(json.git) : null;
    }

    get name() {
        return this._name;
    }

    get version() {
        return this._version;
    }

    get ios() {
        return this._ios;
    }

    get osx() {
        return this._osx;
    }

    get watchos() {
        return this._watchos;
    }

    get git() {
        return this._git;
    }

    supports(platform) {
        if (platform === 'ios') return this._ios === true;
        if (platform === 'osx') return this._osx === true;
        if (platform === 'watchos') return this._watchos === true;
        return false;
    }
}

class Target {

    constructor(json) {
        this._name = json.name;
        this._suffix = json.podspec_suffix;
        this._platform = json.platform || 'ios';
        this._omitPodspec = json.omit_podspec || false;
        this._omitPodfile = json.omit_podfile || false;
        this._deployment = json.deployment;
        this._sources = json.sources;
        this._resources = json.resources;
        if (json.frameworks) this._frameworks = _.map(Object.keys(json.frameworks),
                                                      name => {
                                                          return new Framework(name,
                                                                               json.frameworks[name] || {});
                                                      });
        if (json.deps) this._dependencies = _.map(Object.keys(json.deps),
                                                  name => {
                                                      return new Dependency(name,
                                                                            json.deps[name] || {});
                                                  });
        this._siblings = json.siblings;
    }

    get siblings(){
        return this._siblings;
    }

    get platform() {
        return this._platform;
    }

    get omitPodspec() {
        return this._omitPodspec;
    }

    get omitPodfile() {
        return this._omitPodfile;
    }

    get name() {
        return this._name;
    }

    get suffix() {
        return this._suffix;
    }

    get deployment() {
        return this._deployment;
    }

    get sources() {
        return this._sources;
    }

    get resources() {
        return this._resources;
    }

    get frameworks() {
        return this._frameworks;
    }

    get dependencies() {
        return this._dependencies;
    }
}

class Config {
    constructor(json) {
        this._prefix = json.podspec_prefix;
        this._platforms = json.platforms;
        this._author = json.author;
        this._summary = json.summary;
        this._homepage = json.homepage;
        this._version = json.version;
        this._license = json.license;
        this._git = new Git(json.git);
        this._swiftVersions = json.swift_versions;
        this._targets = _.map(json.targets,
                              json => {
                                  return new Target(json);
                              });
    }

    get prefix() {
        return this._prefix;
    }

    get author() {
        return this._author;
    }

    get summary() {
        return this._summary;
    }

    get homepage() {
        return this._homepage;
    }

    get version() {
        return this._version;
    }

    get license() {
        return this._license;
    }

    get git() {
        return this._git;
    }

    get platforms() {
        return this._platforms;
    }

    get swiftVersions() {
        return this._swiftVersions;
    }

    get targets() {
        return this._targets;
    }
}

module.exports = Config;