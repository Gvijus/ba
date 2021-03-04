const {Builder, By, Key, until} = require('selenium-webdriver');
var webdriver = require('selenium-webdriver')
const assert = require('assert');
const AssertionError = require('assert').AssertionError;
const pattern = /([0-9])+/g;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function example() {
  let driver = await new Builder().forBrowser('chrome').build();
  const actions = driver.actions({async: true});
  try {
    await driver.get('http://automationpractice.com/index.php/');
	//await sleep(2000);
	var items = 0;
	await driver.findElement(By.id("search_query_top")).sendKeys("Printed Summer Dres");
	await driver.findElement(By.name("submit_search")).click();
	
	var searchResult = await driver.findElement(By.css(".heading-counter")).getText();
	var searchItem = await driver.findElement(By.css(".first-in-line .product-name")).getText();
	await driver.findElements(By.css(".product-container")).then(elements => items = elements.length);
	searchResult = searchResult.match(pattern);
	console.log("Search items:");
	assertStrictEquality(searchItem, "Printed Summer Dress");
	console.log("Search result:");
	assertStrictEquality(parseInt(searchResult), items);
	
	let moveElement = await driver.findElement(By.xpath("//div[@id='center_column']/ul/li[1]/div/div[2]/span/span"));
	await actions.move({origin:moveElement}).perform();                                                                 // Šitoj vietoj reiktu palyte nustumpti į kampa, kadangi su JS neišeina fiziškai palytęs pustumti.
	await driver.findElement(By.xpath("//div[@id='center_column']/ul/li[1]/div/div[2]/div[2]/a/span")).click();			// Atsiranda klaida, jei  testavimo metu pelyte bus ant to elemento išmes klaida. Su java butu galima padaryti.
	await sleep(1000);
	await driver.findElement(By.css(".cross")).click();
	var cart = await driver.findElement(By.css(".ajax_cart_quantity:nth-child(2)")).getText();
	
	if (cart > 0){
		console.log("++++++++++++++++++++++++++++++");
		console.log("product is visible in a shopping cart");
		console.log("++++++++++++++++++++++++++++++");
	}
	else{
		console.log("++++++++++++++++++++++++++++++");
		console.log("product is not visible in a shopping cart");
	}
	moveElement = await driver.findElement(By.css(".ajax_cart_quantity:nth-child(2)"));
	await actions.move({origin:moveElement}).perform();
	await sleep(1000);
	await driver.findElement(By.css("#button_order_cart > span")).click();
	await driver.findElement(By.css(".standard-checkout > span")).click();
	await driver.findElement(By.id("email")).sendKeys("test@test.lt");
	await driver.findElement(By.id("passwd")).sendKeys("Testas123");
	await driver.findElement(By.css("#SubmitLogin > span")).click();
	await driver.findElement(By.css(".button:nth-child(4) > span")).click();
	await driver.findElement(By.id("cgv")).click();
	await driver.findElement(By.css(".standard-checkout > span")).click();
	await driver.findElement(By.css(".bankwire > span")).click();
	await driver.findElement(By.css("#cart_navigation span")).click();
	var orderComplete = await driver.findElement(By.css(".cheque-indent > .dark")).getText();
	console.log("Order complete:");
	assertStrictEquality(orderComplete, "Your order on My Store is complete.");
	await sleep(2000);
	
	console.log("++++++++++++++++++++++++++++++");

  } finally {
    await driver.quit();
  }
}
example();

function assertStrictEquality (a, b, message = null) {
  try {
    // Output test.
    console.log(`----- ASSERTING: ${a} === ${b} -----`);
    // Assert equality of a and b parameters.
    assert.strictEqual(a, b, message);
    // Output confirmation of successful assertion.
    console.log(`----- CONFIRMED: ${a} === ${b} -----`);
  } catch (e) {
    if (e instanceof AssertionError) {
      // Output expected AssertionErrors.
      console.log(e);
    } else {
      // Output unexpected Errors.
      console.log(e);
    }
  }
}
