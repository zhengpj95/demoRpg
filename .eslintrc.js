module.exports = {
  env: {
    browser: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended", // 需放到最后，才会使用此规则替换上面的规则
  ],
  // parserOptions: {
  //     "ecmaVersion": "latest",
  //     "sourceType": "module"
  // },
  rules: {
    eqeqeq: ["warn", "smart"], // 必须使用 === 或 !==
    // quotes: ["error", "double"], // 使用双引号 【prettier中处理了】
    // semi: "error", // 禁止无分号 【prettier中处理了】
    "@typescript-eslint/no-explicit-any": "off", // 允许隐式any类型
    "@typescript-eslint/no-unused-vars": "off", // 允许声明但未使用的变量 0 = off, 1 = warn, 2 = error
    "@typescript-eslint/prefer-for-of": "warn", // 如果索引仅用于访问要迭代的数组，则优先于for循环的for-of循环
    "linebreak-style": ["error", "unix"], // ESLint中也可以增加换行符校验。 unix表示LF，windows表示CRLF
  },
};
