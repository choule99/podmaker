# Introduction

CocoaPods is a wonderful tool, but it has 1 major flaw: _The PodSpec & the Podfile, are not sharing any information_

Hence, the Podmaker. A simple tool for people that generates a lot of pods, and lots of podspec, and hate to repeat themselves.

# Requirements

- NodeJS (10.12.0 or upwards)
- YARN (we use Yarn)

# Installing

### Using Yarn
`yarn add git+ssh://git@github.com:choule99/podmaker.git#master`

# Using

To use the `podmaker`, it very simple:

`./node_modules/.bin/podmaker --config podmaker.yaml`

## Configuration File Format

Here is an example with most :

```yaml

name:
  ios: ios
  watchos: watchos
  osx: osx
summary: blah blah blah
author: me
homepage: http://some.url.io/
platforms:
  ios: '12.4'
  watchos: '5.0'
  osx: '10.15'
version: '5.0.0'
license: MIT
git:
  url: git@bitbucket.org:some/url.git
  # optional
  # tag: 'v1.0.0' 
  # or branch: 'develop'
swift_versions:
  - '5.0'
  - '5.1'
targets:
  - name: target_1
    omit_podspec: false
    omit_podfile: false
    podspec_suffix: foundation
    deployment:
      - ios
      - watchos
      - osx
    sources:
      - src/**/*.{h,m,swift}
    resources:
      - src/**/*.{strings,stringsdict}
    frameworks:
      - Foundation
    deps:
      - name: SwifterSwift/Foundation
        version: 5.1.0
      - name: SwifterSwift/SwiftStdlib
        version: 5.1.0
      - name: SomePrivatePod
        git: git@bitbucket.org:some/url.git#master
      - name: SwiftLocation
        version: 4.2.0
        ios: true
        watchos: false
        osx: false
  - name: target_2
    omit_podspec: false
    omit_podfile: false
    podspec_suffix: foundation
    deployment:
      - ios
      - watchos
      - osx
    sources:
      - src/**/*.{h,m,swift}
    resources:
      - src/**/*.{strings,stringsdict}
    frameworks:
      - Foundation
    deps:
      - name: SwifterSwift/Foundation
        version: 5.1.0
      - name: SwifterSwift/SwiftStdlib
        version: 5.1.0
      - name: SomePrivatePod
        git: git@bitbucket.org:some/url.git#master
      - name: SwiftLocation
        version: 4.2.0
        ios: true
        watchos: false
        osx: false  
```



