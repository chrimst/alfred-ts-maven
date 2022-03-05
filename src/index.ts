#! /usr/bin/env node

import commandLineArgs from 'command-line-args';
import { AliyunMaven } from './maven_aliyun';
import { CenterMaven } from './maven_center';

const optionDefinitions = [
    { name: 'src', type: String, defaultOption: true },
    { name: 'query', alias: 'q', type: String },
    { name: 'repo', alias: 'r', type: String, defaultValue: 'all' }
]

const options = commandLineArgs(optionDefinitions, { stopAtFirstUnknown: true })
const argv = options._unknown || []


const script = options.src
const keyword = options.query
const repo = options.repo

const defaultTips = {
    items: [
        {
            title: 'Wrong usage of alfred-ts-maven',
            subtitle: `please refer to the readme to check it ${JSON.stringify(options)}`
        }
    ]
}
if (argv.length != 0 || !script) {
    console.log(defaultTips)
}

if (script == 'aliyun') {
    (new AliyunMaven()).main(keyword, repo)
} else if (script == 'center') {
    (new CenterMaven().main(keyword))
} else {
    console.log(defaultTips)
}
