const fs = require('fs');
const _ = require('lodash');

class PodspecWriter {

    generateGit(config) {
        let content = '';
        let gitArray = [];
        if (_.isString(config.git.url)) {
            gitArray.push(`:git => '${config.git.url}'`);

            if (_.isString(config.git.tag)) {
                gitArray.push(`:tag => '${config.git.tag}'`);
            } else if (_.isString(config.git.branch)) {
                gitArray.push(`:branch => '${config.git.branch}'`);
            }
        }
        if (gitArray.length > 0) content += `\ts.source = { ${gitArray.join(', ')} }\n`;
        return content;
    }

    generateFrameworks(target, platform) {
        let content = '';
        let validFrameworks = _.filter(target.frameworks,
                                       framework => {
                                           return framework.supports(platform);
                                       });

        let targetFrameworks = _.map(validFrameworks,
                                     v => {
                                         return `\'${v.name}\'`;
                                     }).join(', ');
        if (targetFrameworks.length > 0) content += `\ts.${platform}.frameworks = ${targetFrameworks}\n`;
        return content;
    }

    generateSources(target) {
        let content = '';
        let targetSources = _.map(target.sources,
                                  v => {
                                      return `\'${v}\'`;
                                  }).join(', ');
        if (targetSources.length > 0) content += `\ts.source_files = ${targetSources}\n`;
        return content;
    }

    generateBundles(target) {
        let content = '';
        let targetResources = _.map(target.resources,
                                    v => {
                                        return `\'${v}\'`;
                                    }).join(', ');
        if (targetResources.length > 0) content += `\ts.resource_bundle = { 'bundle_${target.suffix}' => [${targetResources}] }\n`;
        return content;
    }

    generateDependencies(target, platform) {
        let content = '';
        if (target.dependencies) {
            let validDependencies = _.filter(target.dependencies,
                                             dependency => {
                                                 return dependency.supports(platform);
                                             });

            _.each(validDependencies,
                   dep => {

                       content += `\ts.${platform}.dependency '${dep.name}'`;

                       if (_.isString(dep.version)) {
                           content += `, '~> ${dep.version}'`;
                       }

                       content += '\n';
                   });
        }
        return content;
    }

    generateSwiftVersions(config) {
        let content = '';
        let swiftVersions = _.map(config.swiftVersions,
                                  v => {
                                      return `\'${v}\'`;
                                  }).join(', ');
        content += `\ts.swift_version = [${swiftVersions}]\n`;
        return content;
    }

    generateAuthors(config) {
        let content = '';
        if (_.isString(config.author)) {
            content += `\ts.authors = '${config.author}'\n`;
        }
        return content;
    }

    generateLicense(config) {
        let content = '';
        if (_.isString(config.license)) {
            content += `\ts.license = { :type => '${config.license}' }\n`;
        }
        return content;
    }

    generateHomepage(config, target) {
        let content = '';
        if (_.isString(config.homepage) || _.isString(target.homepage)) {
            content += `\ts.homepage = '${config.homepage || target.homepage}'\n`;
        }
        return content;
    }

    generateSummary(config, target) {
        let content = '';
        if (_.isString(config.summary) || _.isString(target.summary)) {
            content += `\ts.summary = '${config.summary || target.summary}'\n`;
        }
        return content;
    }

    generateVersion(config) {
        let content = '';
        if (_.isString(config.version)) {
            content += `\ts.version = '${config.version}'\n`;
        }
        return content;
    }

    generateDeploymentTarget(platform, config) {
        return `\ts.${platform}.deployment_target = '${config.platforms[platform]}'\n`;
    }

    generateSiblings(target, config, platform, targetBySuffix) {
        let content = '';
        _.each(target.siblings,
               dep => {
                   content += '\n';

                   let siblingTarget = targetBySuffix[dep];
                   if (siblingTarget) {
                       this.generateSiblings(siblingTarget,
                                             config,
                                             platform,
                                             targetBySuffix);
                   }

                   content += `\ts.${platform}.dependency '${config.prefix[platform]}_${dep}'`;
                   content += '\n';

                   if (siblingTarget) {
                       content += this.generateDependencies(siblingTarget,
                                                            platform);
                   }
               });
        return content;
    }

    writePodspec(config) {

        let platforms = Object.keys(config.prefix);

        let targetBySuffix = {};
        _.map(config.targets,
              target => {
                  targetBySuffix[target.suffix] = target;
              });

        _.forEach(config.targets,
                  target => {
                      if (target.omitPodspec === true) return;
                      _.each(platforms,
                             platform => {

                                 let indexOfPlatform = _.indexOf(target.deployment,
                                                                 platform);
                                 if (indexOfPlatform === -1) return;

                                 let podspecName = `${config.prefix[platform]}_${target.suffix}`;

                                 let content = `Pod::Spec.new do |s|\n\ts.name = '${podspecName}'\n`;

                                 content += this.generateVersion(config);
                                 content += this.generateAuthors(config);
                                 content += this.generateLicense(config);
                                 content += this.generateSummary(config,
                                                                 target);
                                 content += this.generateHomepage(config,
                                                                  target);
                                 content += this.generateGit(config);
                                 content += this.generateSwiftVersions(config);
                                 content += this.generateDeploymentTarget(platform,
                                                                          config);
                                 content += this.generateSources(target);
                                 content += this.generateFrameworks(target,
                                                                    platform);
                                 content += this.generateSiblings(target,
                                                                  config,
                                                                  platform,
                                                                  targetBySuffix);

                                 content += this.generateDependencies(target,
                                                                      platform);
                                 content += this.generateBundles(target);
                                 content += `end`;
                                 fs.writeFileSync(`${podspecName}.podspec`,
                                                  content);

                             });
                  });
    }

}

module.exports = PodspecWriter;