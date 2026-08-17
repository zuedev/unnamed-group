export default () =>
  Deno.serve(() => {
    return new Response("Hello, World!");
  });
