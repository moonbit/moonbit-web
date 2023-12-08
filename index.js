let memory;
const [log, flush] = (() => {
  let codes = [];
  function log2(x) {
    if (x == "\n".charCodeAt(0)) {
      flush2();
    } else if (x == "\r".charCodeAt(0)) {
      /* noop */
    } else {
      codes.push(x);
    }
  }
  function flush2() {
    if (codes.length > 0) {
      console.log(new TextDecoder().decode(new Uint8Array(codes).valueOf()));
      codes = [];
    }
  }
  return [log2, flush2];
})();
const importObject = {
  spectest: {
    print_char: log,
  },
  js_string: {
    new: (offset, length) => {
      const bytes = new Uint8Array(memory.buffer, offset, length);
      const string = new TextDecoder("utf8").decode(bytes);
      return string;
    },
    empty: () => "",
    log: (string) => console.log(string),
    append: (string1, string2) => string1 + string2,
  },
};
await WebAssembly.instantiateStreaming(
  fetch(
    new URL("./target/wasm-gc/release/build/main/main.wasm", import.meta.url),
  ),
  importObject,
).then((obj) => {
  memory = obj.instance.exports["moonbit.memory"];
  obj.instance.exports["_start"]();
  flush();
  console.log(
    "add(1, 2) =",
    obj.instance.exports["moon-web-gc/main::add"](1, 2),
  );
});
