import js from "@eslint/js";

export default [
    {
        ignores: [
            "coverage/**",
            "dist/**",
            "node_modules/**",
            "**/*.min.js"
        ]
    },
    js.configs.recommended,
    {
        files: ["lib/**/*.js", "example/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                console: "readonly",
                document: "readonly",
                setTimeout: "readonly",
                window: "readonly"
            }
        }
    },
    {
        files: ["scripts/**/*.mjs"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                console: "readonly",
                process: "readonly"
            }
        }
    },
    {
        files: ["test/**/*.js"],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: "module",
            globals: {
                afterEach: "readonly",
                describe: "readonly",
                global: "readonly",
                it: "readonly"
            }
        }
    }
];
