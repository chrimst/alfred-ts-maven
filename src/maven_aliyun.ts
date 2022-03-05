import axios from "axios"
import { version } from "os";
import { AlfredItem } from "./AlfredItem";



interface AliyunMavenResult {
    object: {
        id: number,
        artifactId: string,
        groupId: string,
        packaging: string,
        version: string,
        repositoryId: string
    }[],
    errorMsg: string,
    successful: boolean
}



export class AliyunMaven {
    public async main(key: string, repo: string) {
        const res = axios.get('https://developer.aliyun.com/artifact/aliyunMaven/searchArtifactByWords', {
            params: {
                queryTerm: key,
                repoId: repo
            }
        }).then(res => res.data)
            .then(rs => r2Item(rs))
            .catch(err => {
                console.log("hee")
                return [{
                    title: 'Error',
                    subtitle: err instanceof Error ? err.message : JSON.stringify(err)
                }]
            });

        console.log(JSON.stringify({
            items: await res
        }))
    }
}

const r2Item = (rs: AliyunMavenResult): AlfredItem[] => {
    if (!rs.successful) {
        return [{
            title: 'Wrong when querying',
            subtitle: rs.errorMsg
        }]
    }
    return rs?.object?.map(it => {
        const title = `${it.groupId}:${it.artifactId}:${it.version}`
        const mvn = `<dependency>\n  <groupId>${it.groupId}</groupId>\n  <artifactId>${it.artifactId}</artifactId>\n  <version>${it.version}</version>\n</dependency>`;
        const gradle = `compile '${it.groupId}:${it.artifactId}:${it.version}'`;

        return {
            uid: `${it.id}`,
            title: title,
            subtitle: `repository: ${it.repositoryId}   type: ${it.packaging}`,
            autocomplete: title,
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
