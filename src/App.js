const fs = require('fs');
const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const yaml = require('yaml');
const _ = require('lodash');

const Config = require('./Config');
const PodfileWriter = require('./PodfileWriter');
const PodspecWriter = require('./PodspecWriter');

const optionDefinitions = [
    {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Display this usage guide.'
    }, {
        name: 'config',
        alias: 'c',
        type: String,
        description: 'Use the YAML configuration file found in the current work directory. Defaults to null'
    }
];

const usageSection = [
    {
        header: 'PodMaker Tool',
        content: 'A simple tool that translates a YAML file into multiple podspec & podfile'
    }, {
        header: 'Options',
        optionList: optionDefinitions
    }
];


module.exports = {

    execute: async function () {
        try {

            const options = commandLineArgs(optionDefinitions,
                                            {
                                                stopAtFirstUnknown: true,
                                                camelCase: true
                                            });

            if (options.help) {
                const usage = commandLineUsage(usageSection);
                console.log(usage);
                return;
            }

            if (options.config) {
                let configFile = path.resolve(options.config);
                if (fs.existsSync(configFile)) {
                    let yamlContent = fs.readFileSync(configFile).toString();
                    let configObject = yaml.parse(yamlContent);
                    fs.writeFileSync('podmaker.json',
                                     JSON.stringify(configObject,
                                                    null,
                                                    4));


                    let config = new Config(configObject);
                    let podfileWriter = new PodfileWriter();
                    podfileWriter.writePodFile(config);

                    let podspecWriter = new PodspecWriter();
                    podspecWriter.writePodspec(config);

                }
            }

        } catch (e) {
            console.error(e);
        }
    }
};



