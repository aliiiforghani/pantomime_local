module.exports = {
    MongoIDPattern : /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i ,
    ROLES : Object.freeze({
        USER : "USER",
        ADMIN : "ADMIN",
        WRITER : "WRITER",
        TEACHER : "TEACHER",
        SUPPLIER : "SUPPLIER"
    }),
    PERMISSIONS : Object.freeze({
        USER : ["profile"],
        ADMIN : ["all"]
    }),
    ACCESS_TOKEN_SECRET_KEY: "fcf4437f97e1ac122801a0546107f58e298da6de0a62f79ddb063bc207873f0b",
    REFRESH_TOKEN_SECRET_KEY: "e9407ba9c05acb21f7b8df1586e8213fbe8bcb267e20871d9cdd339f63f57887",
    COOKIE_PARSER_SECRET_KET : "921b0a9dfc504df397f873987c655d81c8a7abf943c277ac26e9db52f7fcb154",
}
