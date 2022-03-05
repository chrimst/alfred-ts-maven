# alfred-ts-maven

```sh
$ alfred-ts-maven script-name -q queryString
```

## maven_center
 the query string format can be
    
    1. keywords any
    2. fullpath: (g:a:v)org.springframework:context:
    3. the class name: c:shortClassName or fc:fullClassName
    4. use tags: tags:sclaversionAbc

## maven_aliyun
   as far as now the keyword mode is supported and the repo used to query library can be specific

```
$ alfred-ts-maven aliyun -q queryString -r central(or others.)
```