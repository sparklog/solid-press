import { SolidMarkdown } from "solid-markdown";
import remarkGfm from "remark-gfm";

const markdown = `
### English
SolidPress is a content editing and publishing tool built on SolidJS, integrated with AI to provide intelligent assistance. It empowers users to create blogs, develop web content, and more with ease. Leveraging the lightweight and reactive nature of SolidJS, SolidPress offers a fast and efficient editing experience, while its AI features enhance productivity by assisting with tasks such as content generation, optimization, and formatting. Whether you're a blogger, developer, or content creator, SolidPress is designed to streamline your workflow and bring your ideas to life.

### 正體中文
SolidPress 是一個基於 SolidJS 開發的內容編輯與發布工具，結合 AI 技術提供智慧輔助功能。它可用於創建博客、製作網頁內容等。SolidPress 利用 SolidJS 的輕量與反應式特性，為使用者提供快速且高效的編輯體驗，而其 AI 功能則通過協助內容生成、最佳化及格式調整等任務，提升生產力。無論您是部落客、開發者還是內容創作者，SolidPress 都能簡化您的工作流程，幫助您實現創意。

### 简体中文
SolidPress 是一个基于 SolidJS 开发的内容编辑与发布工具，结合 AI 技术提供智能辅助功能。它可用于创建博客、制作网页内容等。SolidPress 利用 SolidJS 的轻量与反应式特性，为用户提供快速且高效的编辑体验，而其 AI 功能则通过协助内容生成、最优化及格式调整等任务，提升生产力。无论您是博主、开发者还是内容创作者，SolidPress 都能简化您的工作流程，助力您实现创意。

`;

export default function Test() {
  return (
    <article class="prose lg:prose-xl">
    <SolidMarkdown
      renderingStrategy="reconcile"
      children={markdown}
      remarkPlugins={[remarkGfm]}
    />
    </article>
  );
}
