/**
 * Created by avet.sargsyan@gmail.com on 9/9/17.
 */
// Այս կոդը browser-ի ավտոմատացման օրինակ է, որը իրականացնում է հայտարարության ավտոմատացված ավելացում list.am կայքում
// Ամեն էջում կատարած գործողություններից հետո արվում է screenshot, որը պահվում է list.am դիրեկտորիայում
var casper      = require('casper').create(),
    login       = 'https://www.list.am/login',
    my          = 'https://www.list.am/my',
    email       = 'your_email@gmail.com', // your email address (registration email)
    password    = 'your_password', // your password
    yourName    = 'your_name', // your name
    annTitle    = 'your_announcement_title', // title of announcement
    annDesc     = 'your_announcement_description', // description of announcement
    annPhone1   = 'your_contact_phone', // contact phones
    annPhone2   = '',
    annPhone3   = '',
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
    casper.capture('list.am/myPage.png');
    this.waitForSelector("a[href='/add']", // wait for a href=/add link to appear
        function pass () {
            casper.click("a[href='/add']");
            this.echo("adding announcement...");
        },
        10000 // timeout limit in milliseconds
    );
});

casper.then(function(){
    this.echo("announcement page opened");
    casper.capture('list.am/announcement.png');
    this.waitForSelector('a[onclick="return padc.show(this,1,\'Services\')"]',
        function pass () {
            this.echo('waiting for service button');
            casper.click('a[onclick="return padc.show(this,1,\'Services\')"]');
            casper.capture('list.am/announcementType.png');
            casper.click("a[href='/add/162']");
        },
        10000
    );
    this.echo("link to services appeared...");
    casper.capture('list.am/addAnnFinished.png');
});

casper.then(function(){
    this.echo("announcement page opened");
    casper.capture('list.am/announcementDetails.png');
    this.waitForSelector('select#_idlocation',
        function pass () {
            this.evaluate(function() {
                var form = document.querySelector('select#_idlocation'); // select select option index 7
                form.selectedIndex = 7;
                $(form).change();
            });
            this.sendKeys('input[name="title"]', annTitle);
            this.sendKeys('textarea[name="description"]', annDesc);
            if(casper.exists('input[name="your_name"]')){
                this.sendKeys('input[name="your_name"]', yourName);
            }
            this.sendKeys('input[name="phone_1"]', annPhone1);
            this.sendKeys('input[name="phone_2"]', annPhone2);
            this.sendKeys('input[name="phone_3"]', annPhone3);
            casper.capture('list.am/announcementFilled.png');
            casper.click('input[name="_form_action0"]');
        },
        10000
    );
});

casper.then(function() {
    this.echo("waiting for errors..");
    casper.capture('list.am/waitingForErrors.png');
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
        5000
    );
});

casper.then(function() {
    this.echo("publish page opened");
    casper.capture('list.am/PublishReview.png');
    this.waitForSelector('input[name="_form_action1"]',
        function pass () {
            this.echo('Success!!! Time elapsed = '+ (Date.now() - startTime)+' ms');
            casper.click('input[name="_form_action1"]');
        },
        function fail () {
            this.echo("Failed...");
            this.exit();
        },
        3000
    );
});

casper.run(function() {

});
