import { createSignal, Show, For, onMount } from "solid-js";
import { createAsync, RouteDefinition } from "@solidjs/router";
import { getArticle } from "~/lib/database";
import type { ArticleTableGet } from "~/lib/database";
import { 
  Menu, X, ChevronLeft, ChevronRight, Edit, Eye, EyeOff, 
  Clock, CalendarDays, Tag, FileText, Plus
} from "lucide-solid";

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

  // 初始化时检测屏幕尺寸并设置侧边栏状态
  onMount(() => {
    // 检测是否为移动设备
    const isMobileView = window.matchMedia("(max-width: 768px)").matches;
    if (isMobileView) {
      setShowSidebar(false);
    }
  });

  // 文章选择时滚动到顶部
  const handleArticleSelect = (article: ArticleTableGet) => {
    setSelectedArticle(article);
    
    // 平滑滚动到顶部
    document.querySelector('main')?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 在移动设备上点击文章后自动隐藏侧边栏
    if (window.matchMedia("(max-width: 768px)").matches) {
      setShowSidebar(false);
    }
  };

  return (
    <div class="flex h-screen bg-gray-50 overflow-hidden">
      {/* 移动端顶部导航栏 */}
      <div class="md:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-sm border-b border-gray-200">
        <div class="flex items-center justify-between px-4 py-3">
          <button 
            onClick={toggleSidebar}
            class="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 transition-colors duration-200"
            aria-label="菜单"
          >
            <Menu size={24} />
          </button>
          <h1 class="text-lg font-semibold text-gray-900">文章管理</h1>
          <button class="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 transition-colors duration-200">
            <Plus size={24} />
          </button>
        </div>
      </div>
      
      {/* 侧边栏遮罩层（移动端） */}
      <div 
        class={`fixed inset-0 bg-black/30 z-20 md:hidden backdrop-blur-sm ${showSidebar() ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
      />
      
      {/* 左侧文章列表侧边栏 */}
      <aside 
        class={`
          fixed md:static z-30 md:z-auto
          h-full
          bg-white border-r border-gray-200
          transition-all duration-300 ease-in-out
          flex flex-col
          
          ${showSidebar() 
            ? 'w-[280px] md:w-[320px] translate-x-0 shadow-lg md:shadow-none' 
            : 'w-[280px] -translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:opacity-0 md:invisible md:border-r-0'
          }
        `}
      >
        {/* 侧边栏头部 */}
        <div class="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 class="text-xl font-semibold text-gray-900">文章列表</h2>
          <div class="flex space-x-2">
            <button 
              class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="新建文章"
            >
              <Plus size={20} />
            </button>
            <button 
              onClick={toggleSidebar}
              class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 hidden md:block"
              aria-label="折叠侧边栏"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={toggleSidebar}
              class="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 md:hidden"
              aria-label="关闭侧边栏"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* 搜索框 */}
        <div class="p-4 border-b border-gray-200">
          <div class="relative">
            <input
              type="text"
              placeholder="搜索文章..."
              class="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <svg
              class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </div>
        
        {/* 文章列表 */}
        <div class="flex-1 overflow-y-auto">
          <ul class="divide-y divide-gray-200">
            <For each={articles()}>
              {(article) => (
                <li 
                  class={`
                    p-4 cursor-pointer hover:bg-gray-50 transition-all duration-200
                    ${selectedArticle()?.id === article.id 
                      ? 'bg-blue-50 border-l-4 border-blue-500 pl-3' 
                      : 'border-l-4 border-transparent'}
                  `}
                  onClick={() => handleArticleSelect(article)}
                >
                  <div class="flex items-center justify-between">
                    <h3 class="font-medium text-gray-900 truncate">{article.title}</h3>
                    <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${
                      article.status === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {article.status === 'public' ? '已发布' : '草稿'}
                    </span>
                  </div>
                  <p class="mt-1 text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                  <div class="flex items-center mt-2 text-xs text-gray-500">
                    <CalendarDays size={14} class="mr-1" />
                    {new Date(article.updated_at).toLocaleDateString()}
                  </div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </aside>
      
      {/* 右侧内容区域 */}
      <main 
        class={`
          flex-1 overflow-y-auto 
          pt-0 md:pt-6 pb-6 px-4 md:px-6
          transition-all duration-300 ease-in-out
          mt-16 md:mt-0
          bg-gradient-to-b from-gray-50 to-white
          ${showSidebar() ? '' : 'md:ml-0'}
        `}
      >
        {/* 展开侧边栏按钮（当侧边栏隐藏时显示） */}
        <button 
          onClick={toggleSidebar}
          class={`hidden md:flex fixed top-6 left-4 z-10 text-gray-700 hover:text-blue-600 items-center justify-center h-8 w-8 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-50 transition-all duration-200 hover:scale-110 ${showSidebar() ? 'invisible' : 'visible'}`}
          aria-label="展开侧边栏"
        >
          <ChevronRight size={18} />
        </button>
        
        <div class={`
          max-w-4xl mx-auto 
          transition-all duration-500
        `}>
          <Show 
            when={selectedArticle()} 
            fallback={
              <div class="flex flex-col items-center justify-center h-[80vh] text-center text-gray-500 animate-fadeIn">
                <FileText size={48} class="text-gray-400 mb-4" />
                <p class="text-xl font-medium">请选择一篇文章查看</p>
                <p class="mt-2">或者创建一篇新文章开始写作</p>
                <button class="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                  <Plus size={16} class="mr-2" />
                  新建文章
                </button>
              </div>
            }
          >
            {(article) => (
              <div class="animate-fadeIn">
                {/* 文章操作栏 */}
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 hover:shadow-md transition-shadow duration-200">
                  <div class="flex flex-col md:flex-row md:items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">{article().title}</h1>
                    <div class="flex flex-wrap gap-2">
                      <button class="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200">
                        <Edit size={16} class="mr-1.5" />
                        编辑
                      </button>
                      <button class={`
                        inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200
                        ${article().status === 'public' 
                          ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500 hover:text-red-600' 
                          : 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'}
                      `}>
                        {article().status === 'public' 
                          ? <><EyeOff size={16} class="mr-1.5" />取消发布</> 
                          : <><Eye size={16} class="mr-1.5" />发布</>
                        }
                      </button>
                    </div>
                  </div>
                  
                  <div class="px-6 py-4">
                    <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                      <div class="flex items-center">
                        <CalendarDays size={16} class="mr-1.5" />
                        <span>创建于: {new Date(article().created_at).toLocaleString()}</span>
                      </div>
                      <div class="flex items-center">
                        <Clock size={16} class="mr-1.5" />
                        <span>更新于: {new Date(article().updated_at).toLocaleString()}</span>
                      </div>
                      <div class="flex items-center">
                        <Tag size={16} class="mr-1.5" />
                        <span>状态: {article().status === 'public' ? '已发布' : '草稿'}</span>
                      </div>
                    </div>
                    
                    <div class="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <h3 class="font-semibold text-gray-900 mb-2">摘要:</h3>
                      <p class="text-gray-700">{article().summary || '无摘要'}</p>
                    </div>
                  </div>
                </div>
                
                {/* 文章内容 */}
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div class="px-6 py-2 bg-gradient-to-r from-blue-50 to-white border-b border-gray-200">
                    <h2 class="font-medium text-gray-900">文章内容</h2>
                  </div>
                  <div class="prose max-w-none p-6" innerHTML={article().html_content} />
                </div>
              </div>
            )}
          </Show>
        </div>
      </main>
    </div>
  );
} 