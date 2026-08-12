/*

Halaman ini tidak digunakan
Jika user mengunjungi '/', mereka akan diarahkan ke '/dashboard'

*/

import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    throw redirect({
      to: "/admin/dashboard",
    });
  },
});
// function App() {
//   return (<div>Hello, Worlds!</div>)
// }
