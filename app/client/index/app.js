export default class App {
  /**
   * Instantiate all components
   */
  constructor() {
  	this.displayNum = 0;
  }

  displayNewNumber() {
  	this.displayNum += 1;

  	$("#numberDisplay").innerText(this.displayNum);
  }
}