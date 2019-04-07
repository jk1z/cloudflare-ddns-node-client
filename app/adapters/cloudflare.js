const Env = require("../env");
const Request = require("../helpers/request");
const QueryString = require("querystring");
const Ip = require("public-ip");

exports.listZones = async (options) => {
    const headers = {...exports._generateAuthHeader(Env.CLOUDFLARE_EMAIL, Env.CLOUDFLARE_ACCESS_KEY)};
    const queryString = QueryString.stringify({name: Env.CLOUDFLARE_DOMAIN, status: 'active', match: 'all'});
    const res = await Request.getPromise({
        url: Env.CLOUDFLARE_API_ENDPOINT + `/zones?${queryString}`,
        headers, ...options
    });
    return JSON.parse(res.body).result;
};

exports.listDnsRecords = async (zoneId, options) => {
    const headers = {...exports._generateAuthHeader(Env.CLOUDFLARE_EMAIL, Env.CLOUDFLARE_ACCESS_KEY)};
    const res = await Request.getPromise({
        url: Env.CLOUDFLARE_API_ENDPOINT + `zones/${zoneId}/dns_records`,
        headers, ...options
    });
    return JSON.parse(res.body).result;
};

exports.updateDNSRecord = async (zoneId, dnsRecord, options) => {
    const headers = {...exports._generateAuthHeader(Env.CLOUDFLARE_EMAIL, Env.CLOUDFLARE_ACCESS_KEY)};
    const payload = {type: "A", name: Env.CLOUDFLARE_DOMAIN, content: await Ip.v4()};
    const res = await Request.putPromise({
        url: Env.CLOUDFLARE_API_ENDPOINT + `zones/${zoneId}/dns_records/${dnsRecord}`,
        headers,
        body: JSON.stringify(payload), ...options
    });
    return JSON.parse(res.body).result;
};

exports._generateAuthHeader = (email, accessKey) => {
    return {"X-Auth-Key": accessKey, "X-Auth-Email": email};
};

