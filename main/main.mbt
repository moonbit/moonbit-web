fn init {
  println(@lib.hello())
  @lib.hello().to_js_string().log()
}

pub fn add(i: Int, j: Int) -> Int {
  i + j
}