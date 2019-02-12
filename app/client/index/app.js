export default class App {
  /**
   * Instantiate all components
   */
  constructor() {
  	this.displayNum = 0;
  }

  displayNewNumber() {
    this.displayNum += 1
    console.log(`Update called. New num: ${this.displayNum}`)
    console.log(`old num: ${$("#numberDisplay").innerText.val()}`)
  	$("#numberDisplay").innerText = this.displayNum;
  }
}