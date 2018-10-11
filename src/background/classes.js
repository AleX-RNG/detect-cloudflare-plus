class misc {
	static map2obj(map) {
		const obj = {};
		map.forEach((val, key) => { obj[key] = val });
		return obj;
	}
}

class Settings {
	constructor() {
		this.patterns = {};
		this.hpatterns = {};
		this.defaults = {
			'paEnabled': true,
			'heuristics': false,
			'lazy': false,
			'sync': false,

			'AlibabaCloud': true,
			'Akamai': true,
			'AmazonCloudfront': true,
			'CDN77': true,
			'Cloudflare': true,
			'Fastly': true,
			'GoCache': true,
			'GoogleCloud': true,
			'GoogleProjectShield': true,
			'Incapsula': true,
			'Instart': true,
			'IPFS': true,
			'KeyCDN': true,
			'Kinsta': true,
			'Leaseweb': true,
			'MyraCloud': true,
			'Netlify': true,
			'Quantil': true,
			'SingularCDN': true,
			'Sucuri': true,
			'Tor2web': true,
			'VerizonEdgecast': true,
			'Zenedge': true
		};
		this.loading = (async () => {
			let saved = await browser.storage.local.get(this.defaults);
			saved = await browser.storage.sync.get(saved);
			this.all = saved;
			if (this.sync) await browser.storage.sync.set(saved);
			else await browser.storage.sync.clear();
			await browser.storage.local.set(saved);
			browser.storage.onChanged.addListener((changes, area) => {
				console.log(`True Sight: ${area} storage changed`);
				if (area === 'sync') {
					if (this.sync) {
						const obj = {};
						for (const i in changes) {
							if (changes[i].hasOwnProperty('newValue')) {
								obj[i] = changes[i].newValue;
							}
						}
						browser.storage.local.set(obj);
					}
				} else {
					const obj = {};
					for (const i in changes) {
						if (changes[i].hasOwnProperty('newValue')) obj[i] = changes[i].newValue;
					}
					this.all = obj;
				}
			});
			console.log('True Sight: settings loaded');
			delete this.loading;
		})();
	}

	get all() {
		return (async () => {
			if (this.loading) await this.loading;
			const val = {};
			for (const i in this.defaults) {
				val[i] = this[i];
			}
			return val;
		})();
	}

	set all(obj) {
		for (const i in obj) {
			this[i] = obj[i];
		}

		this.patterns = {};
		this.hpatterns = {};
		const reg = (h, func) => {
			if (!this.patterns[h]) this.patterns[h] = [];
			this.patterns[h].push(func);
		};

		if (this.AlibabaCloud) {
			const n = 'Alibaba Cloud';
			const simple = () => {return n};
			reg('ali-swift-global-savetime', simple);
			reg('eagleeye-traceid', simple);
			reg('eagleid', simple);
			// reg('server', v => {if (!v.indexOf('tengine')) return n});
			reg('vary', v => {if (~v.indexOf('ali-detector-type') || ~v.indexOf('ali-hng')) return n});
			reg('x-swift-cachetime', simple);
			reg('x-swift-savetime', simple);
		}
		if (this.Akamai) {
			const n = 'Akamai';
			const simple = () => {return n};
			reg('server', v => {if (~v.indexOf('akamai')) return n});
			reg('set-cookie', v => {if (!v.indexOf('akacd_') || !v.indexOf('aka_a2')) return n});
			reg('x-akamai-session-info', simple);
			reg('x-akamai-ssl-client-sid', simple);
			reg('x-akamai-transformed', simple);
			reg('x-cache-key', v => {if (v) return n});
			reg('x-check-cacheable', v => {if (v == 'yes' || v == 'no') return n});
		}
		if (this.AmazonCloudfront) {
			const n = 'Amazon Cloudfront';
			const simple = () => {return n};
			reg('x-amz-cf-id', simple);
			reg('x-amz-id-2', simple);
			reg('x-amz-replication-status', simple);
			reg('x-amz-request-id', simple);
			reg('x-amz-version-id', simple);
			reg('x-cache', v => {if (~v.indexOf('cloudfront')) return n});
			reg('set-cookie', v => {if (!v.indexOf('awsalb')) return n});
			reg('via', v => {if (~v.indexOf('cloudfront')) return n});
		}
		if (this.Cloudflare) {
			const n = 'Cloudflare';
			const simple = () => {return n};
			reg('cf-bgj', simple);
			reg('cf-cache-status', simple);
			reg('cf-polished', simple);
			reg('cf-ray', simple);
			reg('expect-ct', v => {if (~v.indexOf('report-uri.cloudflare.com')) return n});
			reg('server', v => {if (~v.indexOf('cloudflare')) return n});
			reg('set-cookie', v => {if (!v.indexOf('__cfduid') || !v.indexOf('__cflib')) return n});
		}
		if (this.CDN77) {
			const n = 'CDN77';
			reg('server', v => {if (v === 'cdn77-turbo') return n});
		}
		if (this.Fastly) {
			const n = 'Fastly';
			const simple = () => {return n};
			const rx = /^s\d+\.\d+,vs0,ve\d+$/;
			reg('fastly-stats', simple);
			reg('fastly-io-info', simple);
			reg('fastly-restarts', simple);
			reg('server', v => {if (v === 'artisanal bits') return n});
			reg('vary', v => {if (~v.indexOf('fastly-ssl')) return n});
			reg('x-timer', v => {if (rx.test(v)) return n});
		}
		if (this.GoCache) {
			const n = 'GoCache';
			reg('server', v => {if (v === 'gocache') return n});
			reg('x-gocache-cachestatus', () => {return n});
		}
		if (this.GoogleCloud) {
			const n = 'Google Cloud';
			const simple = () => {return n};
			reg('server', v => {if (v === 'google frontend') return n});
			reg('via', v => {if (~v.indexOf('google')) return n});
			reg('x-cloud-trace-context', simple);
			reg('x-goog-component-count', simple);
			reg('x-goog-encryption-algorithm', simple);
			reg('x-goog-encryption-key-sha256', simple);
			reg('x-goog-expiration', simple);
			reg('x-goog-generation', simple);
			reg('x-goog-hash', simple);
			reg('x-goog-metageneration', simple);
			reg('x-goog-storage-class', simple);
			reg('x-goog-stored-content-encoding', simple);
			reg('x-goog-stored-content-length', simple);
			reg('x-guploader-uploadid', simple);
		}
		if (this.GoogleProjectShield) {
			reg('server', v => {if (v === 'shield') return 'Google Project Shield'});
			reg('x-shield-request-id', () => {return 'Google Project Shield'});
		}
		if (this.Incapsula) {
			const n = 'Incapsula';
			reg('set-cookie', v => {if (!v.indexOf('visid_incap_')) return n});
			reg('x-cdn', v => {if (~v.indexOf('incapsula')) return n});
			reg('x-iinfo', () => {return n});
		}
		if (this.Instart) {
			const n = 'Instart';
			const simple = () => {return 'Instart'};
			reg('x-instart-streaming', simple);
			reg('x-instart-cache-id', simple);
			reg('x-instart-ip-classification', simple);
			reg('x-instart-ip-score', simple);
			reg('x-instart-network-lists', simple);
			reg('x-instart-request-id', simple);
		}
		if (this.IPFS) {
			const simple = () => {return 'IPFS'};
			reg('x-ipfs-path', simple);
			reg('x-ipfs-pop', simple);
		}
		if (this.KeyCDN) {
			reg('server', v => {if (!v.indexOf('keycdn')) return 'KeyCDN'});
		}
		if (this.Kinsta) {
			const n = 'Kinsta';
			reg('server', (v, obj) => {
				if (!v.indexOf('kinsta')) {
					if (obj.hasOwnProperty(n)) return n;
					obj[n] = 1;
				}
			});
			reg('x-cache', (v, obj) => {
				if (obj[n]) return n;
				obj[n] = 0;
			});
			reg('x-edge-location', (v, obj) => {
				if (obj[n]) return n;
				obj[n] = 0;
			});
			reg('x-kinsta-cache', () => {return n});
		}
		if (this.Leaseweb) {
			const n = 'Leaseweb';
			const simple = () => {return n};
			const rx = /^web\d+/;
			reg('server', v => {if (!v.indexOf('leasewebcdn')) return n});
			reg('lswcdn-country-code', simple);
			reg('x-served-by', v => {if (rx.test(v)) return n});
		}
		if (this.MyraCloud) {
			reg('server', v => {if (~v.indexOf('myracloud')) return 'MyraCloud'});
		}
		if (this.Netlify) {
			reg('server', v => {if (!v.indexOf('netlify')) return 'Netlify'});
			reg('x-nf-request-id', () => { return 'Netlify'});
		}
		if (this.Quantil) {
			const rx = /^\d\.\d\s+[^:]+:\d+\s+\(cdn cache server v\d\.\d\)/;
			reg('x-via', v => {if (rx.test(v)) return 'Quantil'});
		}
		if (this.SingularCDN) {
			reg('server', v => {if (!v.indexOf('singularcdn')) return 'SingularCDN'});
		}
		if (this.Sucuri) {
			const n = 'Sucuri';
			const simple = () => {return n};
			reg('set-cookie', v => {if (!v.indexOf('sucuri-')) return n});
			reg('server', v => {if (~v.indexOf('sucuri')) return n});
			reg('x-sucuri-cache', simple);
			reg('x-sucuri-id', simple);
		}
		if (this.Tor2web) {
			reg('x-check-tor', () => {return 'Tor2web'});
		}
		if (this.VerizonEdgecast) {
			const rx = /^ec[sd] \([^\/]+\/[^\/]+\)/;
			reg('server', v => {if (rx.test(v)) return 'Verizon Edgecast'});
		}
		if (this.Zenedge) {
			const n = 'Zenedge';
			const simple = () => {return n};
			reg('server', v => {if (v === 'zenedge') return n});
			reg('x-cdn', v => {if (v === 'served-by-zenedge') return n});
			reg('x-zen-fury', simple);
		}

		if (this.heuristics) {
			const simple = () => {return true};
			this.hpatterns = {
				'age': simple,
				'cache': simple,
				'cache-control': v => {
						return (
							~v.indexOf('s-maxage') || ~v.indexOf('proxy-revalidate')
						);
					},
				'cache-tag': simple,
				'cdn-cache': simple,
				'cdn-cache-hit': simple,
				'cdn-node': simple,
				'edge-control': simple,
				'via': simple,
				'x-age': simple,
				'x-cache': simple,
				'x-cache-hits': simple,
				'x-cache-status': simple,
				'x-cached-since': simple,
				'x-cached-until': simple,
				'x-cdn': simple,
				'x-edge-ip': simple,
				'x-edge-location': simple,
				'x-geo-city': simple,
				'x-geo-country': simple,
				'x-geo-ipaddr': simple,
				'x-geo-ip': simple,
				'x-geo-lat': simple,
				'x-geo-lon': simple,
				'x-proxy-cache': simple,
				'x-served-by': simple,
				'x-storage': simple,
				'x-varnish': simple,
				'x-varnish-backend': simple,
				'x-varnish-cache': simple,
				'x-varnish-cache-hits': simple,
				'x-varnish-cacheable': simple,
				'x-varnish-host': simple,
				'x-via': simple
			};
		}

		tabs.togglePageActions(this.paEnabled);
	}
}

////////////////////// INFO classes //////////////////////////////

class CDNInfo {
	constructor(dom, count) {
		this.counters = new Map();
	}
	inc(url) {
		const domain = (new URL(url)).hostname;
		if (!this.counters.has(domain)) this.counters.set(domain, 1);
		else this.counters.set(domain, (this.counters.get(domain) + 1));
	}
}

class TabInfo {
	constructor(id) {
		this.badgeNum = 0;
		this.cdns = {};
		this.changed = false;
		this.docs = {};
		this.hmatch = 0;
		this.id = id;
		this.status = 0;
		this.total = 0;
	}
	set result(val) {
		if (this.status < val) {
			this.changed = true;
			return this.status = val;
		}
	}
	get result() { return this.status }
	cdn(str) {
		if (!this.cdns[str]) {
			this.cdns[str] = new CDNInfo();
			if (Object.keys(this.cdns).length > 1 + this.hmatch) this.result = 3;
		}
		return this.cdns[str];
	}
	updatePageAction() {
		if (!settings.paEnabled) return;
		browser.pageAction.show(this.id);
		browser.pageAction.setTitle({
			tabId: this.id,
			title: iconData[this.result].desc
		});
		browser.pageAction.setIcon({
			tabId: this.id,
			path: iconData[this.result].path
		});
	}
	updateUI() {
		if (this.changed) {
			this.changed = false;
			this.updatePageAction();
			browser.browserAction.setBadgeBackgroundColor({
				color: iconData[this.result].color,
				tabId: this.id
			});
			browser.browserAction.setTitle({
				tabId: this.id,
				title: iconData[this.result].desc
			});
		}
		browser.browserAction.setBadgeText({
			text: this.badgeNum.toString(),
			tabId: this.id
		});
	}
}

class Tabs {
	getInfo(id) {
		if (!this[id]) this[id] = new TabInfo(id);
		return this[id];
	}
	togglePageActions(bool) {
		for (const i in this) {
			bool ? this[i].updatePageAction() : browser.pageAction.hide(+i);
		}
	}
	getTabCounters(id) {
		// get all individual counters for a given tab
		if (!this[id]) return;
		const result = {};
		for (const i in this[id].cdns) {
			result[i] = misc.map2obj(this[id].cdns[i].counters);
		}
		return result;
	}
}
