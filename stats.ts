// stats.js - http://github.com/mrdoob/stats.js
export default class Stats {
    c;
    l;
    REVISION;
    dom;
    addPanel;
    showPanel;
    begin;
    end;
    update;
    domElement;
    setMode;
    static Panel;

    h(a) {
        this.c.appendChild(a.dom);
        return a
    }
    k(a) {
        for (var d = 0; d < this.c.children.length; d++)
            this.c.children[d].style.display = d === a ? "block" : "none";
        this.l = a
    }
    constructor() {
        this.l = 0;
        this.c = document.createElement("div");
        this.c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
        this.c.addEventListener("click", function (a) {
            a.preventDefault();
            this.k(++this.l % this.c.children.length)
        }, !1);
        var g = (performance || Date).now(),
            e = g,
            a = 0,
            r = this.h(new Stats.Panel("FPS", "#0ff", "#002")),
            f = this.h(new Stats.Panel("MS", "#0f0", "#020"));
        if (self.performance && (self.performance as any).memory)
            var t = this.h(new Stats.Panel("MB", "#f08", "#201"));
        this.k(0);

        this.REVISION = 16;
        this.dom = this.c;
        this.addPanel = this.h;
        this.showPanel = this.k;
        this.begin = function () {
            g = (performance || Date).now()
        };
        this.end = function () {
            a++;
            var c = (performance || Date).now();
            f.update(c - g, 200);
            if (c > e + 1E3 && (r.update(1E3 * a / (c - e), 100), e = c, a = 0, t)) {
                var d = (performance as any).memory;
                t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576)
            }
            return c
        };
        this.update = function () {
            g = this.end()
        };
        this.domElement = this.c;
        this.setMode = this.k;
    }
}

Stats.Panel = function (h, k, l) {
    var c = Infinity,
        g = 0,
        e = Math.round,
        a = e(window.devicePixelRatio || 1),
        r = 80 * a,
        f = 48 * a,
        t = 3 * a,
        u = 2 * a,
        d = 3 * a,
        m = 15 * a,
        n = 74 * a,
        p = 30 * a,
        q = document.createElement("canvas");
    q.width = r;
    q.height = f;
    q.style.cssText = "width:80px;height:48px";
    var b = q.getContext("2d");
    b.font = "bold " + 9 * a + "px Helvetica,Arial,sans-serif";
    b.textBaseline = "top";
    b.fillStyle = l;
    b.fillRect(0, 0, r, f);
    b.fillStyle = k;
    b.fillText(h, t, u);
    b.fillRect(d, m, n, p);
    b.fillStyle = l;
    b.globalAlpha = .9;
    b.fillRect(d, m, n, p);
    return {
        dom: q,
        update: function (f,
            v) {
            c = Math.min(c, f);
            g = Math.max(g, f);
            b.fillStyle = l;
            b.globalAlpha = 1;
            b.fillRect(0, 0, r, m);
            b.fillStyle = k;
            b.fillText(e(f) + " " + h + " (" + e(c) + "-" + e(g) + ")", t, u);
            b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
            b.fillRect(d + n - a, m, a, p);
            b.fillStyle = l;
            b.globalAlpha = .9;
            b.fillRect(d + n - a, m, a, e((1 - f / v) * p))
        }
    }
}