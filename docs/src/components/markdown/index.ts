import type { Component } from "svelte";
import Heading from "./Heading.svelte";
import Paragraph from "./Paragraph.svelte";
import Text from "./Text.svelte";
import Image from "./Image.svelte";
import Link from "./Link.svelte";
import Em from "./Em.svelte";
import Del from "./Del.svelte";
import Codespan from "./Codespan.svelte";
import Strong from "./Strong.svelte";
import Table from "./Table.svelte";
import List from "./List.svelte";
import ListItem from "./ListItem.svelte";
import Html from "./Html.svelte";
import Blockquote from "./Blockquote.svelte";
import Code from "./Code.svelte";
import type { RootContentMap } from "mdast";

export const renderers = {
  heading: Heading,
  paragraph: Paragraph,
  text: Text,
  image: Image,
  link: Link,
  emphasis: Em,
  strong: Strong,
  inlineCode: Codespan,
  delete: Del,
  table: Table,
  list: List,
  listItem: ListItem,
  html: Html,
  blockquote: Blockquote,
  code: Code,
} satisfies Partial<Record<keyof RootContentMap, Component<any>>>;
