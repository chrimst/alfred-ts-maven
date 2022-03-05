# alfred-ts-maven

alfred-ts-maven is typescript based alfred plugin that can used to query the java library from
repo hosted by maven center or aliyun.
only three steps that you can use this plugin

1. downlod the Gmvn.alfredworkflows and import the plugin into your Alfred. Auto upgrade is not supported yet and may works in later
2. install this node cli globally by
   ```node
      npm install -g alfred-ts-maven
   ```

   may this lib is not uploaded to npm yet
   you can clone this repo to your locally and install it by mannual
   ```
      cd `.../path/repo`
      npm install -g .
   ```
3. use it

# Customizition
## basic command
```sh
$ alfred-ts-maven script-name -q queryString
```

## maven_center
[CENTRAL_API_GUIDE](https://central.sonatype.org/search/rest-api-guide/)

the query string format can be
    
    1. keywords any
    2. fullpath: (g:a:v)org.springframework:context:
    3. the class name: c:shortClassName or fc:fullClassName
    4. use tags: tags:sclaversionAbc

## maven_aliyun
[ALIYUN_REPO_SITE](https://developer.aliyun.com/mvn/search)

as far as now the keyword mode is supported and the repo used to query library can be specific

```
$ alfred-ts-maven aliyun -q queryString -r central(or others.)
```