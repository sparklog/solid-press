import { createSignal, Show, For } from "solid-js";
import { createAsync, RouteDefinition } from "@solidjs/router";
import { getArticle } from "~/lib/database";
import type { ArticleTableGet } from "~/lib/database";

// 示例数据
const SAMPLE_ARTICLES: ArticleTableGet[] = [
  {
    id: "1",
    title: "SolidJS 入门指南",
    slug: "solidjs-getting-started",
    summary: "学习如何使用SolidJS构建高性能的前端应用",
    status: "public",
    json_content: {},
    html_content: "<h1>SolidJS 入门指南</h1><p>SolidJS是一个声明式的JavaScript库，用于创建用户界面。它的特点是不使用虚拟DOM，而是编译为优化的命令式代码，直接更新DOM。</p><h2>为什么选择Solid?</h2><p>Solid提供了出色的性能和简单的心智模型，同时保持与React类似的编程范式。</p>",
    user_id: "user1",
    updated_at: "2023-03-15T12:00:00Z",
    created_at: "2023-03-10T09:00:00Z"
  },
  {
    id: "2",
    title: "构建响应式布局",
    slug: "building-responsive-layouts",
    summary: "学习如何创建在各种设备上都能良好显示的响应式布局",
    status: "private",
    json_content: {},
    html_content: "<h1>构建响应式布局</h1><p>在当今多设备的世界中，创建响应式布局是前端开发的重要部分。本文将介绍如何使用CSS和媒体查询来构建适应各种屏幕尺寸的布局。</p>",
    user_id: "user1",
    updated_at: "2023-04-05T15:30:00Z",
    created_at: "2023-04-01T10:00:00Z"
  },
  {
    id: "3",
    title: "JavaScript异步编程",
    slug: "javascript-async-programming",
    summary: "深入理解JavaScript中的异步编程模式",
    status: "public",
    json_content: {},
    html_content: "<h1>JavaScript异步编程</h1><p>异步编程是JavaScript中的一个重要概念。本文将探讨Promise、async/await以及它们如何简化异步代码的编写。</p>",
    user_id: "user1",
    updated_at: "2023-05-20T14:00:00Z",
    created_at: "2023-05-15T11:00:00Z"
  }
];

export const route: RouteDefinition = {
  // 此路由的配置
};

export default function Dashboard() {
  // 状态管理
  const [showSidebar, setShowSidebar] = createSignal(true);
  const [selectedArticle, setSelectedArticle] = createSignal<ArticleTableGet | null>(null);
  
  // 加载示例数据
  const articles = () => SAMPLE_ARTICLES;
  
  // 初始化选中第一篇文章
  if (articles().length > 0 && !selectedArticle()) {
    setSelectedArticle(articles()[0]);
  }

  // 切换侧边栏显示
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar());
  };

  return (
    <div class="flex flex-col md:flex-row h-[calc(100vh-160px)] relative">
      {/* 移动设备显示的汉堡菜单 */}
      {/* <button 
        onClick={toggleSidebar} 
        class="md:hidden fixed top-20 left-4 z-20 bg-blue-500 text-white p-2 rounded-full shadow-lg"
      >
        {showSidebar() ? '×' : '≡'}
      </button> */}
      
      {/* 左侧博客列表 */}
      <div 
        class={`${
          showSidebar() ? 'translate-x-0' : '-translate-x-full md:-translate-x-full'
        } transition-transform duration-300 ease-in-out w-full md:w-64 bg-gray-50 overflow-y-auto border-r border-gray-200 absolute md:relative z-10 h-full shadow-md`}
      >
        <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-100">
          <h2 class="text-xl font-bold">文章列表</h2>
          <button 
            onClick={toggleSidebar}
            class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
            aria-label="切换侧边栏"
          >
            {showSidebar() ? '←' : '→'}
          </button>
        </div>
        <Show when={showSidebar()}>
        <ul class="divide-y divide-gray-200">
          <For each={articles()}>
            {(article) => (
              <li 
                class={`p-4 cursor-pointer hover:bg-gray-200 ${
                  selectedArticle()?.id === article.id ? 'bg-blue-100' : ''
                }`}
                onClick={() => setSelectedArticle(article)}
              >
                <div class="font-medium">{article.title}</div>
                <div class="text-sm text-gray-500">
                  {new Date(article.updated_at).toLocaleDateString()}
                </div>
                <div class="text-xs mt-1 inline-block px-2 py-1 rounded-full bg-gray-200">
                  {article.status === 'public' ? '已发布' : '草稿'}
                </div>
              </li>
            )}
          </For>
        </ul>
        </Show>
      </div>
      
      {/* 右侧文章内容 */}
      <div 
        class={`flex-grow overflow-y-auto p-6 bg-white transition-all duration-300 ${
          showSidebar() ? 'md:ml-0' : 'mx-auto container'
        }`}
        style={{"min-width": showSidebar() ? "calc(100% - 16rem)" : "100%"}}
      >
        <Show when={selectedArticle()} fallback={<p class="text-center text-gray-500 mt-10">请选择一篇文章查看</p>}>
          {(article) => (
            <>
              <div class="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <div class="flex justify-between items-start mb-4">
                  <h1 class="text-2xl font-bold">{article().title}</h1>
                  <div class="flex gap-2">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      编辑
                    </button>
                    <button class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                      {article().status === 'public' ? '取消发布' : '发布'}
                    </button>
                  </div>
                </div>
                
                <div class="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  <div>创建于: {new Date(article().created_at).toLocaleString()}</div>
                  <div>更新于: {new Date(article().updated_at).toLocaleString()}</div>
                  <div>状态: {article().status === 'public' ? '已发布' : '草稿'}</div>
                </div>
                
                <div class="p-4 bg-gray-50 rounded-lg mb-6 border border-gray-100">
                  <h3 class="font-bold mb-2">摘要:</h3>
                  <p>{article().summary || '无摘要'}</p>
                </div>
              </div>
              
              <div class="prose max-w-none bg-white p-6 rounded-lg shadow-sm border border-gray-100" innerHTML={article().html_content} />
            </>
          )}
        </Show>
      </div>
    </div>
  );
} 