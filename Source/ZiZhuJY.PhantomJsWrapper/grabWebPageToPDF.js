var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat;orientation;margin] [zoom]');
    console.log('       margin: {left: "0.8cm", top: "0.8cm", right: "0.8cm", bottom: "0.8cm"}');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];
    
    page.viewportSize = { width: 1123, height: 794 };
    page.paperSize = { format: "A4", orientation: "landscape", width: "29.7cm", height: "21cm", margin: "0" };
    if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        format = system.args[3].split(';');

        var margin = '1cm';
        try {
            margin = eval('margin = ' + format[2]);
        } catch (ex) {
            console.log('Unable to parse the margin object: "' + format[2] + '".');
            console.log(ex);
            phantom.exit();
        }

        page.paperSize = size.length === 2
            ? { width: size[0], height: size[1], margin: '0px' }
            : {
                format: format[0],
                orientation: format[1] || "landscape",
                margin: margin
            };
    }
    page.zoomFactor = 1.6;
    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address "' + address + '"! Status = ' + status);
            phantom.exit();
        } else {
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 1000);
        }
    });
}
