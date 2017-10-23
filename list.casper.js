/**
 * Created by avet.sargsyan@gmail.com on 9/9/17.
 */
// Այս կոդը browser-ի ավտոմատացման օրինակ է, որը իրականացնում է հայտարարության ավտոմատացված ավելացում list.am կայքում
// Ամեն էջում կատարած գործողություններից հետո արվում է screenshot, որը պահվում է list.am դիրեկտորիայում
var casper      = require('casper').create({
        verbose: false,
        logLevel: 'debug',
        userAgent: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0',
        pageSettings: {}
    }),
    email       = require('./config').email,
    password    = require('./config').password, // your password
    yourName    = require('./config').yourName, // your name
    annTitle    = require('./config').annTitle, // title of announcement
    annDesc     = require('./config').annDesc, // description of announcement
    annPhone1   = require('./config').annPhone1, // contact phones
    annPhone2   = require('./config').annPhone2,
    annPhone3   = require('./config').annPhone3,
    login       = 'https://www.list.am/login',
    my          = 'https://www.list.am/my',
    startTime   = Date.now();

casper.start(login, function() { // entering Login page
    this.echo('login page opened');
    casper.capture('list.am/login.png'); // screenshot the Login page
});

casper.then(function() {
    this.sendKeys('input[name="your_email"]', email); // fill in input with name 'your_email'
    this.sendKeys('input[name="password"]', password); // fill in input with name 'password'
    this.click('input[name="_form_action0"]'); // click on "send" button
    this.echo("logging in..."); // this.echo = console.log
});

casper.then(function() {
    this.waitForSelector("a[href='/add']", // wait for a href=/add link to appear a[href='/add']
        function pass () {
            casper.click("a[href='/add']");
            this.echo("adding announcement...");
        },
        function fail(){
            this.echo("Something went wrong");
            this.exit();
        },
        20000 // timeout limit in milliseconds
    );
    casper.capture('list.am/myPage.png');
});

casper.thenOpen('https://www.list.am/add/162', function(){
    this.echo("announcement page opened");
    casper.capture('list.am/announcementDetails.png');
    this.waitForSelector('input#_idtitle',
        function pass () {
            this.evaluate(function() {
                var form = document.querySelector('select#_idlocation'); // select select option index 7
                form.selectedIndex = 7;
                $(form).change();
            });
            this.sendKeys('input#_idtitle', annTitle);
            this.sendKeys('textarea#_iddescription', annDesc);
            if(casper.exists('input#_idyour_name')){
                this.sendKeys('input#_idyour_name', yourName);
            }
            this.sendKeys('input#_idphone_1', annPhone1);
            this.sendKeys('input#_idphone_2', annPhone2);
            this.sendKeys('input#_idphone_3', annPhone3);
            casper.capture('list.am/announcementFilled.png');
            casper.click('input#postaction__form_action0');
        },
        function fail(){
            this.echo("Something went wrong");
            this.exit();
        },
        10000
    );
});

casper.then(function() {
    this.echo("waiting for errors..");
    this.waitForSelector('div.error',
        function pass () {
            this.echo("Error On Publish...");
            var errors = casper.getElementInfo('div.error td').text;
            this.echo(errors);
            console.log('errors -> ',errors);
            this.echo('Exiting with errors : '+ errors + ', Time elapsed = '+ (Date.now() - startTime)+'ms');
        },
        function fail () {
            this.echo("Published with no errors :)")
        },
        20000
    );
    casper.capture('list.am/waitingForErrors.png');
});

casper.then(function() {
    this.echo("publish page opened");
    this.waitForSelector('input[name="_form_action1"]',
        function pass () {
            this.echo('Success!!! Time elapsed = '+ (Date.now() - startTime)+' ms');
            casper.click('input[name="_form_action1"]');
        },
        function fail(){
            this.echo("Something went wrong");
            this.exit();
        },
        20000
    );
    casper.capture('list.am/PublishReview.png');
});

casper.run(function() {

});
