// 2配列の準備
export type ZT = { readonly type: "zero" };
export type RAT_t = { readonly type: "plus", readonly add: RPT_t[] };
export type RPT_t = { readonly type: "psi", readonly sub: number, readonly arg: RT_t };
export type RT_t = ZT | RAT_t | RPT_t;

export const Z: ZT = { type: "zero" };
export const ONE_t: RPT_t = { type: "psi", sub: 0, arg: Z };

// オブジェクトの相等判定
export function equal(s: RT_t, t: RT_t): boolean {
    if (s.type === "zero") {
        return t.type === "zero";
    } else if (s.type === "plus") {
        if (t.type !== "plus") return false;
        if (t.add.length !== s.add.length) return false;
        for (let i = 0; i < t.add.length; i++) {
            if (!equal(s.add[i], t.add[i])) return false;
        }
        return true;
    } else {
        if (t.type !== "psi") return false;
        return (s.sub === t.sub) && equal(s.arg, t.arg);
    }
}

export function psi_t(sub: number, arg: RT_t): RPT_t {
    return { type: "psi", sub: sub, arg: arg };
}

// a+b を適切に整形して返す
export function plus(a: RT_t, b: RT_t): RT_t {
    if (a.type === "zero") {
        return b;
    } else if (a.type === "plus") {
        if (b.type === "zero") {
            return a;
        } else if (b.type === "plus") {
            return { type: "plus", add: a.add.concat(b.add) };
        } else {
            return { type: "plus", add: [...a.add, b] };
        }
    } else {
        if (b.type === "zero") {
            return a;
        } else if (b.type === "plus") {
            return { type: "plus", add: [a, ...b.add] };
        } else {
            return { type: "plus", add: [a, b] };
        }
    }
}

// 要素が1個の配列は潰してから返す
export function sanitize_plus_term_t(add: RPT_t[]): RPT_t | RAT_t {
    if (add.length === 1) {
        return add[0];
    } else {
        return { type: "plus", add: add };
    }
}

// s < t を判定
export function less_than(s: RT_t, t: RT_t): boolean {
    if (s.type === "zero") {
        return t.type !== "zero";
    } else if (s.type === "psi") {
        if (t.type === "zero") {
            return false;
        } else if (t.type === "psi") {
            return (s.sub < t.sub) ||
                ((s.sub === t.sub) && less_than(s.arg, t.arg));
        } else {
            return equal(s, t.add[0]) || less_than(s, t.add[0]);
        }
    } else {
        if (t.type === "zero") {
            return false;
        } else if (t.type === "psi") {
            return less_than(s.add[0], t)
        } else {
            const s2 = sanitize_plus_term_t(s.add.slice(1));
            const t2 = sanitize_plus_term_t(t.add.slice(1));
            return less_than(s.add[0], t.add[0]) ||
                (equal(s.add[0], t.add[0]) && less_than(s2, t2));
        }
    }
}

// nより大きい方
export function replace(n: number, s: RT_t): RT_t {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        const a = s.add[0];
        const b = sanitize_plus_term_t(s.add.slice(1));
        return plus(replace(n, a), replace(n, b));
    } else {
        return psi_t(n, s.arg);
    }
}

// 多変数配列の準備
// ===========================================

export type AT_m = { readonly type: "plus", readonly add: PT_m[] };
export type PT_m = { readonly type: "sub", readonly arr: T_m[] };
export type T_m = ZT | AT_m | PT_m;

export const ONE_m: PT_m = { type: "sub", arr: [Z] };
export const OMEGA_m: PT_m = { type: "sub", arr: [ONE_m] };
export const LOMEGA_m: PT_m = { type: "sub", arr: [Z, ONE_m] };
export const IOTA_m: PT_m = { type: "sub", arr: [Z, Z, ONE_m] };

export function psi_m(arr: T_m[]): PT_m {
    return { type: "sub", arr: arr };
}

// 要素が1個の配列は潰してから返す
export function sanitize_plus_term_m(add: PT_m[]): PT_m | AT_m {
    if (add.length === 1) {
        return add[0];
    } else {
        return { type: "plus", add: add };
    }
}

// 本編
// ===========================================

export function nG(s: T_m): RT_t {
    if (s.type === "zero") {
        return Z;
    } else if (s.type === "plus") {
        return plus(nG(s.add[0]), nG(sanitize_plus_term_m(s.add.slice(1))));
    } else {
        const a = s.arr;
        let k_max = a.length-1;
        while (k_max > -1) {
            if (!(a[k_max].type === "zero")) break;
            k_max--;
        }
        if (k_max === -1) return ONE_t;
        const tarmList = [];
        for (let i = k_max; i > -1; i--) {
            tarmList.push(replace(i, nG(a[i])));
        }
        return psi_t(0, tarmList.reduce((accumulator, currentValue) => plus(accumulator, currentValue)));
    }
}

// 翻訳
// ===========================================

export type Options = {
    checkOnOffo: boolean;
    checkOnOffO: boolean;
    checkOnOffA: boolean;
    checkOnOffB: boolean;
    checkOnOffT: boolean;
};

// オブジェクトから文字列へ
function term_to_string(t: RT_t, options: Options): string {
    if (t.type === "zero") {
        return "0";
    } else if (t.type === "psi") {
        if (!(options.checkOnOffB && t.sub === 0)) {
            if (options.checkOnOffA) {
                return "ψ(" + t.sub + "," + term_to_string(t.arg, options) + ")";
            }
            if (options.checkOnOffT)
                return "ψ_{" + t.sub + "}(" + term_to_string(t.arg, options) + ")";
            return "ψ_" + t.sub + "(" + term_to_string(t.arg, options) + ")";
        }
        return "ψ(" + term_to_string(t.arg, options) + ")";
    } else {
        return t.add.map((x) => term_to_string(x, options)).join("+");
    }
}

function to_TeX(str: string): string {
    str = str.replace(RegExp("ψ", "g"), "\\psi");
    str = str.replace(/ω/g, "\\omega");
    str = str.replace(/Ω/g, "\\Omega");
    return str;
}

function abbrviate(str: string, options: Options): string {
    str = str.replace(RegExp("ψ\\(0\\)", "g"), "1");
    str = str.replace(RegExp("ψ_\\{0\\}\\(0\\)", "g"), "1");
    str = str.replace(RegExp("ψ_0\\(0\\)", "g"), "1");
    str = str.replace(RegExp("ψ\\(0,0\\)", "g"), "1");
    if (options.checkOnOffo) {
        str = str.replace(RegExp("ψ\\(1\\)", "g"), "ω");
        str = str.replace(RegExp("ψ_\\{0\\}\\(1\\)", "g"), "ω");
        str = str.replace(RegExp("ψ_0\\(1\\)", "g"), "ω");
        str = str.replace(RegExp("ψ\\(0,1\\)", "g"), "ω");
    }
    if (options.checkOnOffO) {
        str = str.replace(RegExp("ψ_\\{1\\}\\(0\\)", "g"), "Ω");
        str = str.replace(RegExp("ψ_1\\(0\\)", "g"), "Ω");
        str = str.replace(RegExp("ψ\\(1,0\\)", "g"), "Ω");
    }
    if (options.checkOnOffT) str = to_TeX(str);
    while (true) {
        const numterm = str.match(/1(\+1)+/);
        if (!numterm) break;
        const matches = numterm[0].match(/1/g);
        if (!matches) throw Error("そんなことある？");
        const count = matches.length;
        str = str.replace(numterm[0], count.toString());
    }
    return str;
}

export function termToString(t: RT_t, options: Options): string {
    return abbrviate(term_to_string(t, options), options);
}