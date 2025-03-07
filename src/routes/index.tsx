import { A, createAsync, RouteDefinition } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { authenticateUser } from "~/lib/auth";

export const route: RouteDefinition = {
  preload() {
    authenticateUser();
  },
};

export default function Home() {
  const user = createAsync(() => authenticateUser(), { deferStream: true });

  return (
    <main class="flex items-center justify-center min-h-screen p-4">
      <div class="w-full max-w-md">
        <Show
          when={user()}
          fallback={<>
            <h1 class="text-4xl font-bold text-center">SolidPress - under construction</h1>
            <A class="mt-4 text-center" href="/signIn">
              Sign In
            </A>
            </>
          }
        >
          <h1 class="text-4xl font-bold text-center">
            Welcome {user()?.email} 
          </h1>
        </Show>
      </div>
    </main>
  );
}
