#! /usr/bin/env node
import axios from "axios"
import { AlfredItem } from "./AlfredItem"


// only keep the used
interface MavenSearchResult {
    response: {
        docs: {
            id: string,
            a: string,
            g: string,
            p: string,
            latestVersion: string,
            timestamp: number,
            versionCount: number
        }[],
        numFound: number,
        start: number
    }
}

// request params
interface Q {
    a: string
    q: string,
    v: string
}


const qQ = (args: string) => {
    const argsV = args.split(":")
    const argsL = argsV.length

    if (argsL == 1) {
        return args;
    }

    // the c:abcf or cf:abcsf 
    if ((argsV.indexOf("c") != -1 || argsV.indexOf("cf") != -1)
        && argsL == 2) {
        return args;
    }

    if (argsV.indexOf("tags") != -1 && argsL == 2) {
        return args
    }

    if (argsV.indexOf("a") != -1 && argsL == 2) {
        return args;
    }

    const argsK = ['g', 'a', 'v']

    if (argsV.length > argsK.length) {
        throw Error('q must like this aa:bb:cc and no more than two : spliter')
    }
    let r = []
    for (let v in argsV) {
        r.push(`${argsK[v]}:${argsV[v]}`)
    }
    return r.join(' AND ')
}

// R2Item 
const r2Item = (rs: MavenSearchResult): AlfredItem[] => {
    return rs?.response?.docs?.map(it => {
        const date = new Date(it.timestamp).toDateString()
        const mvn = `<dependency>\n  <groupId>${it.g}</groupId>\n  <artifactId>${it.a}</artifactId>\n  <version>${it.latestVersion}</version>\n</dependency>`;
        const gradle = `compile '${it.g}:${it.a}:${it.latestVersion}'`;
        return {
            uid: it.id,
            title: `${it.id}:${it.latestVersion}`,
            subtitle: `update:${date} ${it.versionCount}`,
            autocomplete: `${it.id}:${it.latestVersion}`,
            arg: mvn,
            mods: {
                cmd: {
                    arg: mvn,
                    subtitle: 'Copy maven pom dependency into clipboard'
                },
                alt: {
                    arg: gradle,
                    subtitle: 'Copy gradle pom dependency into clipboard'
                }
            }
        }
    })
}
export class CenterMaven {

    public async main(key: string) {
        const res = axios.get('https://search.maven.org/solrsearch/select', {
            params: {
                q: qQ(key),
                rows: 20,
                wt: 'json'
            }
        }).then(res => res.data)
            .then(rs => r2Item(rs))
            .catch(err => [{
                title: 'Error',
                subtitle: err instanceof Error ? err.message : JSON.stringify(err)
            }]
            );

        console.log(JSON.stringify({
            items: await res
        }))
    }
}
