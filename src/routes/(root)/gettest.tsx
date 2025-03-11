import { createAsync, RouteDefinition } from "@solidjs/router";
import { Show } from "solid-js";
import { getArticle } from "~/lib/database";

export const route: RouteDefinition = {
  preload() {
    // 预加载用户信息
    getArticle("there-is-a-test-title");
  },
} ;

export default function GetTest() {
  const article = createAsync(() => getArticle("there-is-a-test-title"), {
    deferStream: true,
  });

  return (
    <Show when ={article()} fallback={<div>Loading...</div>}>
        <div class="prose lg:prose-xl" innerHTML={article()?.html_content} />
    </Show>


  )
}
