const Cloudflare = require("./adapters/cloudflare");
const Env = require("./env");
const Error = require("./error");
const Logger = require("./logger");
const Util = require('util');

if (!Env.CLOUDFLARE_EMAIL && !Env.CLOUDFLARE_ACCESS_KEY && !Env.CLOUDFLARE_DOMAIN){
    Logger.error(`Environment vars not configured. CLOUDFLARE_EMAIL=${Env.CLOUDFLARE_EMAIL} CLOUDFLARE_ACCESS_KEY=${Env.CLOUDFLARE_ACCESS_KEY} CLOUDFLARE_DOMAIN=${Env.CLOUDFLARE_DOMAIN}`);
    process.exit(-1);
}

const main = async () => {
    try {
        const zone = (await Cloudflare.listZones())[0];
        if (!zone) throw Error.error(10001, 'Domain name not found');
        const dnsRecords = await Cloudflare.listDnsRecords(zone.id);
        let dnsRecordId;
        for (const record of dnsRecords){
            if (record.type === 'A' && record.name === Env.CLOUDFLARE_DOMAIN){
                dnsRecordId = record.id;
            }
        }
        if (!dnsRecordId) throw Error.error(10002, `IPV4/Type A IP not found in this domain ${Env.CLOUDFLARE_DOMAIN}`);
        const result = await Cloudflare.updateDNSRecord(zone.id, dnsRecordId);
        // Print result
        Logger.info(`${Env.CLOUDFLARE_DOMAIN} domain A record has been updated. Result:${JSON.stringify(result)}`);
    } catch (err) {
        if (!err.code) Logger.warn(Util.inspect(err));
        if (err.code < 20000) {
            Logger.error(err.message);
            process.exit(-1);
        } else {
            Logger.warn(err.message);
        }
    }
};

(async () => {
    await main();
})();

setInterval(() => {
    (async () => {
        await main();
    })();
}, 300000);