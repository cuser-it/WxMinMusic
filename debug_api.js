const https = require('https');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', (err) => {
            reject(err);
        });
    });
}

async function run() {
    try {
        console.log('Fetching Recommended Music...');
        const musicRes = await fetchUrl('https://music.flic.site/personalized/newsong');
        if (musicRes.result && musicRes.result.length > 0) {
            console.log('First recommended song image URL:', musicRes.result[0].picUrl);
        } else {
            console.log('No recommended music found.');
        }

        console.log('\nFetching Top MVs...');
        const mvRes = await fetchUrl('https://music.flic.site/top/mv?limit=1');
        if (mvRes.data && mvRes.data.length > 0) {
            console.log('First MV cover URL:', mvRes.data[0].cover);
        } else {
            console.log('No MVs found.');
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

run();
