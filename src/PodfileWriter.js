const _ = require('lodash');
const fs = require('fs');

class PodfileWriter {

    writePodFile(config) {
        let content = '';
        content += 'use_frameworks!\n\n';

        _.forEach(config.targets,
                  target => {

                      if (target.omitPodfile === true) return;

                      content += `target '${target.name}' do\n`;

                      let platform = target.platform;
                      content += `\tplatform :${platform}, '${config.platforms[platform]}'\n`;

                      if (target.dependencies) {

                          _.forEach(target.dependencies,
                                    dep => {
                                        content += `\tpod '${dep.name}'`;

                                        if (_.isString(dep.version)) {
                                            content += `, '~> ${dep.version}'`;
                                        }

                                        if (dep.git) {
                                            if (_.isString(dep.git.url)) {
                                                content += `, :git => '${dep.git.url}'`;

                                                if (_.isString(dep.git.tag)) {
                                                    content += `, :tag => '${dep.git.tag}'`;
                                                } else if (_.isString(dep.git.branch)) {
                                                    content += `, :branch => '${dep.git.branch}'`;
                                                }
                                            }
                                        }

                                        content += '\n';
                                    });
                      }
                      content += `end\n\n`;
                  });

        content += `post_install do |installer|

    installer.pods_project.build_configurations.each do |config|
        config.build_settings.delete('CODE_SIGNING_ALLOWED')
        config.build_settings.delete('CODE_SIGNING_REQUIRED')
    end
    
    installer.pods_project.targets.each do |target|
        target.build_configurations.each do |config|\n`;

        if (config.platforms.watchos) {
            content += `\t\tconfig.build_settings['WATCHOS_DEPLOYMENT_TARGET'] = '${config.platforms.watchos}'\n`;
        }

        if (config.platforms.ios) {
            content += `\t\tconfig.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${config.platforms.ios}'\n`;
        }

        content += `\t\tconfig.build_settings['ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES'] = 'NO'
            config.build_settings['EXPANDED_CODE_SIGN_IDENTITY'] = ''
            config.build_settings['CODE_SIGNING_REQUIRED'] = 'NO'
            config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
            config.build_settings['ENABLE_BITCODE'] = 'YES'
            if config.name == "Debug"
                config.build_settings['GCC_OPTIMIZATION_LEVEL'] = '0'
                config.build_settings['SWIFT_OPTIMIZATION_LEVEL'] = '-Onone'
            else
                config.build_settings['SWIFT_OPTIMIZATION_LEVEL'] = '-Owholemodule'
            end
        end
    end
end
`;

        fs.writeFileSync('Podfile',
                         content);
    }
}

module.exports = PodfileWriter;