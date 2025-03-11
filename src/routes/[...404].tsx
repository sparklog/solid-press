import { A } from "@solidjs/router";
import { onMount, createSignal } from "solid-js";

export default function NotFound() {
  const [isVisible, setIsVisible] = createSignal(false);
  
  onMount(() => {
    // 添加小延迟使动画效果更加明显
    setTimeout(() => setIsVisible(true), 10);
  });

  return (
    <main class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div 
        class={`max-w-2xl w-full px-6 py-12 transform transition-all duration-500 ease-out ${
          isVisible() ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div class="bg-indigo-600 p-6 text-center">
            <h1 class="text-7xl md:text-9xl font-bold text-white opacity-80">404</h1>
          </div>
          
          <div class="p-8 md:p-12 text-center">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-4">页面未找到</h2>
            <p class="text-gray-600 mb-8">
              您尝试访问的页面不存在或已被移除。
              <br />
              请检查网址是否正确，或返回主页继续浏览。
            </p>
            
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <A 
                href="/"
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                返回首页
              </A>
              
              <button
                onClick={() => window.history.back()}
                class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                返回上一页
              </button>
            </div>
          </div>
          
          <div class="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
            <p class="text-sm text-gray-500">
              如需帮助，请 <A href="/contact" class="text-indigo-600 hover:underline">联系我们</A> 或访问 <A href="/help" class="text-indigo-600 hover:underline">帮助中心</A>
            </p>
          </div>
        </div>
      </div>
      
      <footer class={`mt-12 text-center text-gray-500 text-sm transition-opacity duration-700 ${
        isVisible() ? "opacity-100" : "opacity-0"
      }`}>
        <p>© {new Date().getFullYear()} SolidPress. 保留所有权利。</p>
      </footer>
    </main>
  );
}
