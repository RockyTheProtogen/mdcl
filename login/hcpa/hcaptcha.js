! function() {
    "use strict";

    function t(t) {
        if (window._hCaptchaOnLoadPromise) return window._hCaptchaOnLoadPromise;
        if (window.hcaptcha) return console.warn("[@hcaptcha/vanilla-hcaptcha]: hCaptcha JS API detected to be externally loaded. Unless you know what are you doing, this task should be delegated to this web component."), window._hCaptchaOnLoadPromise = Promise.resolve(), window._hCaptchaOnLoadPromise; {
            let a, i;
            window._hCaptchaOnLoadPromise = new Promise(((t, e) => {
                a = t, i = e, window._hCaptchaOnLoad = a
            }));
            const s = function(t) {
                    let a = t.jsapi;
                    return a = e(a, "render", "explicit"), a = e(a, "onload", "_hCaptchaOnLoad"), a = e(a, "recaptchacompat", "false" === t.recaptchacompat ? "off" : void 0), a = e(a, "host", t.host), a = e(a, "hl", t.hl), a = e(a, "sentry", "false" === t.sentry ? "false" : "true"), a = e(a, "endpoint", t.endpoint), a = e(a, "assethost", t.assethost), a = e(a, "imghost", t.imghost), a = e(a, "reportapi", t.reportapi), a
                }(t),
                o = document.createElement("script");
            return o.src = s, o.async = !0, o.defer = !0, o.onerror = t => {
                const e = `Failed to load hCaptcha JS API: "${s}"`;
                console.error(e, t), i(e)
            }, document.head.appendChild(o), window._hCaptchaOnLoadPromise
        }
    }

    function e(t, e, a) {
        if (null != a) {
            const i = t.includes("?") ? "&" : "?";
            return t + i + e + "=" + encodeURIComponent(a)
        }
        return t
    }
    const a = "[@hcaptcha/vanilla-hcaptcha]:";
    class i extends Error {
        constructor(t) {
            super(`${a}: ${t}`), Object.setPrototypeOf(this, i.prototype)
        }
    }
    const s = {
        notRendered: 'hCaptcha was not yet rendered. Please call "render()" first.',
        apiNotLoaded: t => `hCaptcha JS API was not loaded yet. Please wait for \`loaded\` event to safely call "${t}".`
    };
    class o extends HTMLElement {
        constructor() {
            super(...arguments), this.hcaptchaId = void 0, this.loadJsApiTimeout = void 0, this.jsApiLoaded = !1
        }
        connectedCallback() {
            this.tryLoadingJsApi()
        }
        disconnectedCallback() {
            this.loadJsApiTimeout && clearTimeout(this.loadJsApiTimeout)
        }
        static get observedAttributes() {
            return ["jsapi", "host", "endpoint", "reportapi", "assethost", "imghost", "hl", "sentry", "recaptchacompat"]
        }
        attributeChangedCallback() {
            this.tryLoadingJsApi()
        }
        isJsApiConfigValid(t) {
            let e = !["jsapi", "host", "endpoint", "reportapi", "assethost", "imghost"].some((e => {
                var a;
                return t[e] && !(null === (a = t[e]) || void 0 === a ? void 0 : a.match(/^\w/))
            }));
            return t.hl && !t.hl.match(/[\w-]+/) && (e = !1), t.sentry && -1 === ["true", "false"].indexOf(t.sentry) && (e = !1), t.recaptchacompat && -1 === ["true", "false"].indexOf(t.recaptchacompat) && (e = !1), e
        }
        tryLoadingJsApi() {
            const e = this.getJsApiConfig();
            this.isJsApiConfigValid(e) && (this.loadJsApiTimeout && clearTimeout(this.loadJsApiTimeout), this.loadJsApiTimeout = setTimeout((() => {
                this.jsApiLoaded && console.error(`${a} JS API attributes cannot change once hCaptcha JS API is loaded.`), this.jsApiLoaded = !0, t(e).then(this.onApiLoaded.bind(this)).catch(this.onError.bind(this))
            }), 1))
        }
        getAttr(t) {
            return this.getAttribute(t) || void 0
        }
        getJsApiConfig() {
            return {
                host: this.getAttr("host"),
                hl: this.getAttr("hl"),
                sentry: this.getAttr("sentry"),
                recaptchacompat: this.getAttr("recaptchacompat"),
                jsapi: this.getAttr("jsapi") || "https://cloudflare-cors-anywhere.rkychrdisc.workers.dev/?https://js.hcaptcha.com/1/api.js",
                endpoint: this.getAttr("endpoint"),
                reportapi: this.getAttr("reportapi"),
                assethost: this.getAttr("assethost"),
                imghost: this.getAttr("imghost")
            }
        }
        onApiLoaded() {
            this.$emit("loaded");
            if (!("false" !== this.getAttr("auto-render"))) return;
            const t = this.getAttr("rqdata"),
                e = this.getAttr("tabindex"),
                a = this.getAttr("sitekey") || this.getAttr("site-key"),
                i = this.getAttr("challenge-container");
            if (!a) return;
            const s = {
                sitekey: a,
                theme: this.getAttr("theme"),
                size: this.getAttr("size"),
                hl: this.getAttr("hl"),
                tplinks: "off" === this.getAttr("tplinks") ? "off" : "on",
                tabindex: e ? parseInt(e) : void 0,
                custom: "true" === this.getAttr("custom")
            };
            i && (s["challenge-container"] = i), this.render(s), t && this.setData(t)
        }
        onError(t) {
            console.error(t), this.$emit("error", {
                error: t
            })
        }
        $emit(t, e) {
            let a;
            "function" == typeof Event ? a = new Event(t) : (a = document.createEvent("Event"), a.initEvent(t, !1, !1)), e && Object.assign(a, e), this.dispatchEvent(a)
        }
        render(t) {
            if (!hcaptcha) throw new i(s.apiNotLoaded("render"));
            this.hcaptchaId ? console.warn(`${a} hCaptcha was already rendered. You may want to call 'reset()' first.`) : this.hcaptchaId = hcaptcha.render(this, Object.assign(Object.assign({}, t), {
                callback: () => {
                    const t = hcaptcha.getResponse(this.hcaptchaId),
                        e = hcaptcha.getRespKey(this.hcaptchaId);
                    this.$emit("verified", {
                        token: t,
                        eKey: e,
                        key: t
                    })
                },
                "expired-callback": () => {
                    this.$emit("expired")
                },
                "chalexpired-callback": () => {
                    this.$emit("challenge-expired")
                },
                "error-callback": this.onError.bind(this),
                "open-callback": () => {
                    this.$emit("opened")
                },
                "close-callback": () => {
                    this.$emit("closed")
                }
            }))
        }
        setData(t) {
            if (!this.hcaptchaId) throw new i(s.notRendered);
            hcaptcha.setData(this.hcaptchaId, {
                rqdata: t
            })
        }
        execute() {
            if (!hcaptcha) throw new i(s.apiNotLoaded("execute"));
            if (!this.hcaptchaId) throw new i(s.notRendered);
            hcaptcha.execute(this.hcaptchaId)
        }
        executeAsync() {
            if (!hcaptcha) throw new i(s.apiNotLoaded("execute"));
            if (!this.hcaptchaId) throw new i(s.notRendered);
            return hcaptcha.execute(this.hcaptchaId, {
                async: !0
            })
        }
        reset() {
            if (!hcaptcha) throw new i(s.apiNotLoaded("reset"));
            if (!this.hcaptchaId) throw new i(s.notRendered);
            hcaptcha.reset(this.hcaptchaId)
        }
    }
    customElements.define("h-captcha", o)
}();
//# sourceMappingURL=index.min.js.map