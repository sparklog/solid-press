import { A } from "@solidjs/router";
import Counter from "~/components/Counter";
import Test from "~/components/test";

export default function Home() {
  return (
    <main class="container mx-auto flex flex-col items-center justify-center gap-4 p-4">
      <h1 class="text-5xl font-bold">
        SolidPress
        <span class="text-4xl"> - Under construction</span>
      </h1>
      <Test />
    </main>
  );
}
