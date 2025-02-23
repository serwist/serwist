import Heading from "./Heading.svelte";
import Paragraph from "./Paragraph.svelte";
import Text from "./Text.svelte";
import Image from "./Image.svelte";
import Link from "./Link.svelte";
import Em from "./Em.svelte";
import Del from "./Del.svelte";
import Strong from "./Strong.svelte";
import List from "./List.svelte";
import ListItem from "./ListItem.svelte";
import Html from "./Html.svelte";
import Blockquote from "./Blockquote.svelte";
import Code from "./Code.svelte";
import type { RootContentMap } from "mdast";
import Br from "./Br.svelte";
import InlineCode from "./InlineCode.svelte";
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
