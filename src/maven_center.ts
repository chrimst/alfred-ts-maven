#! /usr/bin/env node
import axios from "axios"


// only keep the used
interface MavenSearchResult {
    response: {
        docs: {
            id: string,
            a: string,
            g: string,
            p: string,
            v: string,
            timestamp: Date,
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

// work flow item
interface AlfredItem {
    uid?: string
    type?: 'default' | 'file' | 'file:skipcheck'
    title: string
    subtitle?: string
    icon?: { type?: 'fileicon' | 'filetype' | undefined, path: string }
    valid?: boolean
    match?: string
    mods?: {}
    arg?: string
    text?: { copy?: string, largetype?: string }
    quicklookurl?: string
    autocomplete?: string
}

// R2Item 
const r2Item = (rs: MavenSearchResult): AlfredItem[] => {
    return rs?.response?.docs?.map(it => {
        const mvn = `<dependency>\n  <groupId>${it.g}</groupId>\n  <artifactId>${it.a}</artifactId>\n  <version>${it.v}</version>\n</dependency>`;
        const gradle = `compile '${it.g}:${it.a}:${it.v}'`;
        return {
            uid: it.id,
            title: `${it.id}:${it.v}`,
            subtitle: `${it.timestamp} ${it.versionCount}`,
            autocomplete: `${it.id}:${it.v}`,
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
