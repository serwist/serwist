// import { existsSync, readFileSync } from "fs";
// import { writeFile } from "fs/promises";
// import { glob } from "glob";
// import path from "path";
// import prettier from "prettier";

// const files = await glob("docs/src/routes/(vertical)/docs/**/+page.server.ts", {
//   absolute: true,
//   nodir: true,
// });

// await Promise.all(
//   files.map(async (serverFile) => {
//     if (!existsSync(serverFile)) return;

//     const server = readFileSync(serverFile, "utf-8");

//     await writeFile(
//       serverFile,
//       await prettier.format(
//         server
//           .replace('import { highlightCode } from "$lib/highlightCode";', "")
//           .replace("{ locals }", "")
//           .replace(/code: \{[\s\S]+\},\n/, "")
//           .replace(/toc: \[[\s\S]+\],\n/, ""),
//         {
//           parser: "typescript",
//           tabWidth: 2,
//           printWidth: 150,
//           useTabs: false,
//           singleQuote: false,
//           semi: true,
//           trailingComma: "es5",
//           endOfLine: "auto",
//         },
//       ),
//     );

//     //     const codes = [
//     //       ...server.matchAll(
//     //         // /highlightCode\([ \t\n]+locals.highlighter,[ \t\n]+\{[ \t\n]+"(.*?)": \{[ \t\n]+code: \`([\s\S]*?)\`,[ \t\n]+lang: "(.*?)",[ \t\n]+},[ \t\n]+},[ \t\n]+\{ idPrefix: "(.*?)"(, useTwoslash: false)? \},[ \t\n]+\)/g,
//     //         // /highlightCode\([ \t\n]+locals.highlighter,[ \t\n]+\{(([ \t\n]+".*?": {[ \t\n]+code: \`[\s\S]*?\`,[ \t\n]+lang: ".*?",[ \t\n]+},)+?)[ \t\n]+},[ \t\n]+{ idPrefix: "(.*?)"(, useTwoslash: false)? },[ \t\n]+\)/g
//     //         /highlightCode\([ \t\n]+locals.highlighter,[ \t\n]+\{([\s\S]+?)[ \t\n]+},[ \t\n]+{[ \t\n]+idPrefix: "(.*?)"[,]?([ \t\n]+useTwoslash: false)?[ \t\n]+},[ \t\n]+\)/g,
//     //       ),
//     //     ];

//     //     // console.log(codes);

//     //     let idx = 0;

//     // const content = await prettier.format(original, {
//     //   parser: "markdown",
//     //   tabWidth: 2,
//     //   printWidth: 150,
//     //   useTabs: false,
//     //   singleQuote: false,
//     //   semi: true,
//     //   trailingComma: "es5",
//     //   endOfLine: "auto",
//     // });

//     //     let useTab = false;

//     //     const updated = content
//     //       .replace(/(.+)\n\n\`\`\`([\s\S]*?)\`\`\`/g, (sub, list) => {
//     //         if (idx >= codes.length) {
//     //           throw new Error(`unexpected ${file} ${codes} ${sub} ${list}`);
//     //         }
//     //         const code = codes[idx++];
//     //         const tabs = list.split(" ").filter((x) => !!x);
//     //         const codeContent = [...code[1].matchAll(/[ \t\n]+["]?(.*?)["]?: {[ \t\n]+code: [`"]([\s\S]*?)[`"],[ \t\n]+lang: "(.*?)",[ \t\n]+}/g)];
//     //         if (tabs.length !== codeContent.length) {
//     //           throw new Error(`unexpected diff ${file} ${codes} ${sub} ${list} ${tabs} ${codeContent}`);
//     //         }

//     //         const useTwoslash = !code[3]?.includes("useTwoslash");

//     //         useTab = true;

//     //         return `<Tabs id="${code[2]}" tabs={[${codeContent.map((t) => `["${t[1]}", "${t[1].replace(/[ ()\.]/gm, "-")}"]`).join(", ")}]}>
//     // ${codeContent
//     //   .map(
//     //     (cd) => `  <Tab id="${cd[1].replace(/[ ()\.]/gm, "-")}">

//     // \`\`\`${cd[3]}${
//     //       (cd[3] === "ts" || cd[3] === "typescript" || cd[3] === "javascript" || cd[3] === "js" || cd[3] === "tsx" || cd[3] === "jsx") && useTwoslash
//     //         ? " twoslash"
//     //         : ""
//     //     }
//     // ${cd[2]}
//     // \`\`\`

//     //   </Tab>`,
//     //   )
//     //   .join("\n")}
//     // </Tabs>`;
//     //       })
//     //       .replace("---\nlayout: docs\n---", (sub) => {
//     //         if (useTab) {
//     //           return `${sub}\n<script>\n  import Tabs from "$components/Tabs.svelte";\n  import Tab from "$components/Tab.svelte";\n</script>`;
//     //         }
//     //         return sub;
//     //       });

//     //     writeFile(file, updated);
//   }),
// );

import markdown from "node-html-markdown";

const md = new markdown.NodeHtmlMarkdown();