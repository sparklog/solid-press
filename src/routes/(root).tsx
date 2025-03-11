import { createAsync, RouteDefinition, RouteSectionProps } from "@solidjs/router";
import { authenticateUser } from "~/lib/auth";
import { Show } from "solid-js";

export const route: RouteDefinition = {
  preload() {
    return authenticateUser();
  },
};

export default function Layout(props: RouteSectionProps) {
  const user = createAsync(() => authenticateUser(), { deferStream: true });
  return (
    <div class="min-h-screen flex flex-col">
      <header class="flex justify-between items-center p-4 border-b">
        <div class="brand">
          <h1 class="text-xl font-bold">solidpress</h1>
        </div>
        <nav class="mx-auto">
          <ul class="flex space-x-4">
            <li>gettest</li>
          </ul>
        </nav>
        <div class="auth">
          <Show when={user()} fallback={<button class="px-4 py-2 bg-blue-500 text-white rounded">Login</button>}>
            {(user) => <div>{user().email}</div>}
          </Show>
        </div>
      </header>
      <main class="flex-grow container mx-auto">
        {props.children}
      </main>
      <footer class="border-t p-4 text-center text-gray-500">
        <p>© {new Date().getFullYear()} SolidPress. All rights reserved.</p>
      </footer>
    </div>
  );
}