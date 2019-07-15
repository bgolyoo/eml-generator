const faker = require("faker");
const cuid = require("cuid");
const hostname = require("os").hostname();
const fs = require("fs");
const cli = require("cli");

const mail = (config) => {
    return `Date: ${config.fullDate}
From: ${config.fromEmail}
To: ${config.toEmail}
Message-ID: <${config.messageId}>
MIME-Version: 1.0
Content-Type: text/plain; charset=us-ascii
Content-Transfer-Encoding: 7bit
    
Dear ${config.toFullName},
    
Please find below my signature!
    
Best regards,
    
${config.fromFullName}
${config.jobTitle}
${config.companyName}
${config.street}
${config.city}
${config.phone}
Email: ${config.fromEmail}
Web: ${config.website}`;
}

const generate = (num, callback) => {
    if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output');
    }
    for (let i = 1; i <= num; i++) {
        const randomA = faker.helpers.contextualCard();
        const randomB = faker.helpers.contextualCard();
        config ={
            fullDate: Date(),
            fromEmail: randomA.email,
            toEmail: randomB.email,
            toFullName: `${randomB.name} ${faker.name.lastName()}`,
            fromFullName: `${randomA.name} ${faker.name.lastName()}`,
            jobTitle: faker.name.jobTitle(),
            companyName: randomA.company.name,
            street: `${randomA.address.suite} ${randomA.address.street}`,
            city: randomA.address.city,
            phone: randomA.phone,
            website: randomA.website,
            messageId: `${cuid()}.${Date.now()}@${hostname}`
        };
        const data = mail(config);
        fs.writeFile(`./output/${config.fromEmail.replace('@', '_').replace('.', '_').toLowerCase()}_${config.toEmail.replace('@', '_').replace('.', '_').toLowerCase()}.eml`, data, (err) => {
            if (err) {
                console.error(err);
            }
            callback(i);
        });
    }
};

cli.parse({
    generate: ['g', 'Generate fake eml files.', 'int']
});

cli.main((args, options) => {
    if (options.generate) {
        generate(options.generate, (index) => {
            cli.progress(++index / 100);
            if (index === options.generate) {
                cli.ok('Finished!');
            }
        });
    }
});