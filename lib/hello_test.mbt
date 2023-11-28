fn init {
  if (hello() != "Hello, world!") {
    abort("Test Failed")
  }
}