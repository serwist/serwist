import type { RootContentMap } from "mdast";
import Blockquote from "./Blockquote.svelte";
import Br from "./Br.svelte";
import Code from "./Code.svelte";
import Del from "./Del.svelte";
import Em from "./Em.svelte";
import Heading from "./Heading.svelte";
import Html from "./Html.svelte";
import Image from "./Image.svelte";
import InlineCode from "./InlineCode.svelte";
import Link from "./Link.svelte";
import List from "./List.svelte";
import ListItem from "./ListItem.svelte";
import Paragraph from "./Paragraph.svelte";
import Strong from "./Strong.svelte";
import Text from "./Text.svelte";
import { TocLink, TocParagraph } from "./toc";

export type RendererFor = "content" | "toc";

export const getRenderer = (type: keyof RootContentMap, renderFor: RendererFor = "content") => {
  const isForToc = renderFor === "toc";
  switch (type) {
    case "blockquote":
      return Blockquote;
    case "break":
      return Br;
    case "code":
      return Code;
    case "delete":
      return Del;
    case "emphasis":
      return Em;
    case "heading":
      return Heading;
    case "html":
      return Html;
    case "image":
      return Image;
    case "inlineCode":
      return InlineCode;
    case "link":
      return isForToc ? TocLink : Link;
    case "list":
      return List;
    case "listItem":
      return ListItem;
    case "paragraph":
      return isForToc ? TocParagraph : Paragraph;
    case "strong":
      return Strong;
    case "text":
      return Text;
    default:
      return null;
  }
};
