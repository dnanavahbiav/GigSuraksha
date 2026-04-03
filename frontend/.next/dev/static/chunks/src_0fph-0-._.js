(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAll",
    ()=>clearAll,
    "getEvent",
    ()=>getEvent,
    "getPolicy",
    ()=>getPolicy,
    "getQuote",
    ()=>getQuote,
    "getWorker",
    ()=>getWorker,
    "saveEvent",
    ()=>saveEvent,
    "savePolicy",
    ()=>savePolicy,
    "saveQuote",
    ()=>saveQuote,
    "saveWorker",
    ()=>saveWorker
]);
// ─── Local State Persistence ─────────────────────────────────
// Simple localStorage wrappers for demo-safe state management.
// No auth exists — all user state is persisted client-side.
const KEYS = {
    worker: 'gigsuraksha_worker',
    quote: 'gigsuraksha_quote',
    policy: 'gigsuraksha_policy',
    event: 'gigsuraksha_event'
};
// ─── Generic helpers ─────────────────────────────────────────
function save(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch  {
    // localStorage full or unavailable
    }
}
function load(key) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch  {
        return null;
    }
}
function remove(key) {
    try {
        localStorage.removeItem(key);
    } catch  {
    // ignore
    }
}
function saveWorker(worker) {
    save(KEYS.worker, worker);
}
function getWorker() {
    return load(KEYS.worker);
}
function saveQuote(quote) {
    save(KEYS.quote, quote);
}
function getQuote() {
    return load(KEYS.quote);
}
function savePolicy(policy) {
    save(KEYS.policy, policy);
}
function getPolicy() {
    return load(KEYS.policy);
}
function saveEvent(event) {
    save(KEYS.event, event);
}
function getEvent() {
    return load(KEYS.event);
}
function clearAll() {
    Object.values(KEYS).forEach(remove);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.js [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.js [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.js [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const navLinks = [
    {
        href: '/',
        label: 'Home'
    },
    {
        href: '/onboarding',
        label: 'Get Started'
    },
    {
        href: '/dashboard',
        label: 'Dashboard'
    },
    {
        href: '/simulate',
        label: 'Simulate'
    },
    {
        href: '/admin',
        label: 'Admin'
    }
];
function Header() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    function handleReset() {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clearAll"])();
        router.push('/');
        setOpen(false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-surface border-b border-border sticky top-0 z-50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-4 h-14 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-2 font-semibold text-text-primary",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                className: "w-5 h-5 text-primary"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 32,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[15px] tracking-tight",
                                children: "GigSuraksha"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 33,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 31,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden md:flex items-center gap-1",
                        children: [
                            navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: link.href,
                                    className: `px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${pathname === link.href ? 'bg-primary-light text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-border-light'}`,
                                    children: link.label
                                }, link.href, false, {
                                    fileName: "[project]/src/components/Header.tsx",
                                    lineNumber: 39,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleReset,
                                title: "Reset demo — clears all local state",
                                className: "ml-2 flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium text-text-muted hover:text-text-secondary transition-colors rounded-md hover:bg-border-light",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                        className: "w-3.5 h-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header.tsx",
                                        lineNumber: 56,
                                        columnNumber: 13
                                    }, this),
                                    "Reset Demo"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 51,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 37,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setOpen(!open),
                        className: "md:hidden p-1.5 rounded-md text-text-secondary hover:bg-border-light",
                        "aria-label": "Toggle menu",
                        children: open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 67,
                            columnNumber: 19
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 67,
                            columnNumber: 47
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "md:hidden border-t border-border bg-surface px-4 py-2",
                children: [
                    navLinks.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: link.href,
                            onClick: ()=>setOpen(false),
                            className: `block px-3 py-2.5 text-[14px] font-medium rounded-md ${pathname === link.href ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-border-light'}`,
                            children: link.label
                        }, link.href, false, {
                            fileName: "[project]/src/components/Header.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleReset,
                        className: "flex items-center gap-1.5 w-full px-3 py-2.5 text-[13px] font-medium text-text-muted hover:bg-border-light rounded-md",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                className: "w-3.5 h-3.5"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header.tsx",
                                lineNumber: 92,
                                columnNumber: 13
                            }, this),
                            "Reset Demo"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Header.tsx",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Header.tsx",
                lineNumber: 73,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Header.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
_s(Header, "nU/8fhDfJ8wkCdtUQCkxLghXJ0g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CardHeader",
    ()=>CardHeader,
    "default",
    ()=>Card
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const paddingMap = {
    sm: 'p-3',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6'
};
function Card({ children, className = '', padding = 'md' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `bg-surface border border-border rounded-lg ${paddingMap[padding]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Card.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ title, subtitle, action }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-start justify-between mb-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-[15px] font-semibold text-text-primary",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/src/components/Card.tsx",
                        lineNumber: 35,
                        columnNumber: 9
                    }, this),
                    subtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[13px] text-text-secondary mt-0.5",
                        children: subtitle
                    }, void 0, false, {
                        fileName: "[project]/src/components/Card.tsx",
                        lineNumber: 37,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Card.tsx",
                lineNumber: 34,
                columnNumber: 7
            }, this),
            action && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: action
            }, void 0, false, {
                fileName: "[project]/src/components/Card.tsx",
                lineNumber: 40,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
var _c, _c1;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-sm',
    secondary: 'bg-primary-light text-primary hover:bg-blue-100 active:bg-blue-200',
    outline: 'bg-surface border border-border text-text-primary hover:bg-border-light active:bg-border',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-border-light',
    danger: 'bg-danger text-white hover:bg-red-700 active:bg-red-800'
};
const sizeClasses = {
    sm: 'px-3 py-1.5 text-[13px]',
    md: 'px-4 py-2 text-[14px]',
    lg: 'px-5 py-2.5 text-[15px]'
};
function Button({ children, variant = 'primary', size = 'md', className = '', disabled = false, onClick, type = 'button', fullWidth = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: type,
        onClick: onClick,
        disabled: disabled,
        className: `
        inline-flex items-center justify-center gap-2 
        font-medium rounded-lg transition-colors cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Button.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Badge.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Badge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
const variantClasses = {
    default: 'bg-primary-light text-primary',
    success: 'bg-success-light text-success',
    warning: 'bg-warning-light text-warning',
    danger: 'bg-danger-light text-danger',
    info: 'bg-blue-50 text-blue-700',
    muted: 'bg-border-light text-text-secondary'
};
function Badge({ children, variant = 'default', className = '' }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-full uppercase tracking-wide ${variantClasses[variant]} ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Badge.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_c = Badge;
var _c;
__turbopack_context__.k.register(_c, "Badge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/constants.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CITIES",
    ()=>CITIES,
    "COVERAGE_TIERS",
    ()=>COVERAGE_TIERS,
    "DISRUPTION_TYPE_INFO",
    ()=>DISRUPTION_TYPE_INFO,
    "EVENT_TYPE_MAP",
    ()=>EVENT_TYPE_MAP,
    "PLATFORMS",
    ()=>PLATFORMS,
    "SEVERITY_CONFIG",
    ()=>SEVERITY_CONFIG,
    "SHIFT_RISK_LOADINGS",
    ()=>SHIFT_RISK_LOADINGS,
    "SHIFT_TYPE_MAP",
    ()=>SHIFT_TYPE_MAP,
    "SHIFT_WINDOWS",
    ()=>SHIFT_WINDOWS,
    "ZONES",
    ()=>ZONES,
    "ZONE_RISK_LOADINGS",
    ()=>ZONE_RISK_LOADINGS
]);
const PLATFORMS = [
    'Blinkit',
    'Zepto',
    'Instamart',
    'BigBasket Now'
];
const CITIES = [
    'Bengaluru',
    'Mumbai',
    'Delhi NCR',
    'Hyderabad',
    'Pune',
    'Chennai'
];
const SHIFT_WINDOWS = [
    {
        id: 'morning',
        label: 'Morning Rush (7 AM – 11 AM)',
        startHour: 7,
        endHour: 11
    },
    {
        id: 'afternoon',
        label: 'Afternoon (12 PM – 4 PM)',
        startHour: 12,
        endHour: 16
    },
    {
        id: 'evening',
        label: 'Evening Rush (6 PM – 10 PM)',
        startHour: 18,
        endHour: 22
    },
    {
        id: 'night',
        label: 'Late Night (10 PM – 1 AM)',
        startHour: 22,
        endHour: 1
    }
];
const ZONES = [
    // -- Bengaluru
    {
        id: 'blr-kora',
        name: 'Koramangala',
        city: 'Bengaluru',
        riskLevel: 'medium',
        darkStores: [
            'DS-K1',
            'DS-K2',
            'DS-K3'
        ]
    },
    {
        id: 'blr-indira',
        name: 'Indiranagar',
        city: 'Bengaluru',
        riskLevel: 'low',
        darkStores: [
            'DS-I1',
            'DS-I2'
        ]
    },
    {
        id: 'blr-hsr',
        name: 'HSR Layout',
        city: 'Bengaluru',
        riskLevel: 'medium',
        darkStores: [
            'DS-H1',
            'DS-H2'
        ]
    },
    {
        id: 'blr-whitefield',
        name: 'Whitefield',
        city: 'Bengaluru',
        riskLevel: 'high',
        darkStores: [
            'DS-W1',
            'DS-W2',
            'DS-W3'
        ]
    },
    {
        id: 'blr-jp',
        name: 'JP Nagar',
        city: 'Bengaluru',
        riskLevel: 'low',
        darkStores: [
            'DS-JP1'
        ]
    },
    // -- Mumbai
    {
        id: 'mum-andheri',
        name: 'Andheri East',
        city: 'Mumbai',
        riskLevel: 'high',
        darkStores: [
            'DS-A1',
            'DS-A2'
        ]
    },
    {
        id: 'mum-bandra',
        name: 'Bandra West',
        city: 'Mumbai',
        riskLevel: 'medium',
        darkStores: [
            'DS-B1',
            'DS-B2'
        ]
    },
    {
        id: 'mum-powai',
        name: 'Powai',
        city: 'Mumbai',
        riskLevel: 'medium',
        darkStores: [
            'DS-P1'
        ]
    },
    // -- Delhi NCR
    {
        id: 'del-gurgaon',
        name: 'Gurgaon Sec 49',
        city: 'Delhi NCR',
        riskLevel: 'high',
        darkStores: [
            'DS-G1',
            'DS-G2'
        ]
    },
    {
        id: 'del-noida',
        name: 'Noida Sec 18',
        city: 'Delhi NCR',
        riskLevel: 'high',
        darkStores: [
            'DS-N1',
            'DS-N2'
        ]
    },
    {
        id: 'del-dwarka',
        name: 'Dwarka',
        city: 'Delhi NCR',
        riskLevel: 'medium',
        darkStores: [
            'DS-D1'
        ]
    },
    // -- Hyderabad
    {
        id: 'hyd-madhapur',
        name: 'Madhapur',
        city: 'Hyderabad',
        riskLevel: 'medium',
        darkStores: [
            'DS-M1',
            'DS-M2'
        ]
    },
    {
        id: 'hyd-gachi',
        name: 'Gachibowli',
        city: 'Hyderabad',
        riskLevel: 'low',
        darkStores: [
            'DS-GA1'
        ]
    },
    // -- Pune
    {
        id: 'pun-koregaon',
        name: 'Koregaon Park',
        city: 'Pune',
        riskLevel: 'medium',
        darkStores: [
            'DS-KP1',
            'DS-KP2'
        ]
    },
    {
        id: 'pun-hinjewadi',
        name: 'Hinjewadi',
        city: 'Pune',
        riskLevel: 'low',
        darkStores: [
            'DS-HJ1'
        ]
    },
    // -- Chennai
    {
        id: 'chn-anna',
        name: 'Anna Nagar',
        city: 'Chennai',
        riskLevel: 'medium',
        darkStores: [
            'DS-AN1',
            'DS-AN2'
        ]
    },
    {
        id: 'chn-adyar',
        name: 'Adyar',
        city: 'Chennai',
        riskLevel: 'high',
        darkStores: [
            'DS-AD1'
        ]
    }
];
const DISRUPTION_TYPE_INFO = {
    RAIN_EVENT: {
        label: 'Heavy Rainfall',
        category: 'WEATHER',
        isPayoutTrigger: true,
        description: 'Rainfall exceeding 64mm/hr as per IMD classification',
        icon: 'CloudRain'
    },
    WATERLOGGING_EVENT: {
        label: 'Waterlogging',
        category: 'WEATHER',
        isPayoutTrigger: true,
        description: 'Road inundation preventing last-mile delivery operations',
        icon: 'Waves'
    },
    HEAT_STRESS_EVENT: {
        label: 'Extreme Heat',
        category: 'WEATHER',
        isPayoutTrigger: true,
        description: 'Temperature exceeding safe operational threshold (>42°C)',
        icon: 'Thermometer'
    },
    AIR_QUALITY_EVENT: {
        label: 'Severe AQI',
        category: 'WEATHER',
        isPayoutTrigger: true,
        description: 'AQI exceeding 400 (Severe category)',
        icon: 'Wind'
    },
    ZONE_ACCESS_RESTRICTION: {
        label: 'Zone Access Restricted',
        category: 'ACCESS',
        isPayoutTrigger: true,
        description: 'Municipal or police-imposed access restriction in operating zone',
        icon: 'ShieldOff'
    },
    DARK_STORE_UNAVAILABLE: {
        label: 'Dark Store Down',
        category: 'INFRASTRUCTURE',
        isPayoutTrigger: true,
        description: 'Dark store closure due to infrastructure failure or forced shutdown',
        icon: 'Store'
    },
    PLATFORM_OUTAGE: {
        label: 'Platform Outage',
        category: 'PLATFORM',
        isPayoutTrigger: true,
        description: 'Platform-wide or regional delivery app service unavailability',
        icon: 'WifiOff'
    }
};
const SEVERITY_CONFIG = {
    low: {
        label: 'Low',
        multiplier: 0.4,
        color: '#059669'
    },
    moderate: {
        label: 'Moderate',
        multiplier: 0.65,
        color: '#D97706'
    },
    high: {
        label: 'High',
        multiplier: 0.85,
        color: '#EA580C'
    },
    severe: {
        label: 'Severe',
        multiplier: 1.0,
        color: '#DC2626'
    }
};
const COVERAGE_TIERS = [
    {
        id: 'basic',
        name: 'Basic',
        maxWeeklyPayout: 2000,
        coveragePercent: 50,
        eligibleDisruptions: [
            'RAIN_EVENT',
            'WATERLOGGING_EVENT',
            'PLATFORM_OUTAGE'
        ]
    },
    {
        id: 'standard',
        name: 'Standard',
        maxWeeklyPayout: 3500,
        coveragePercent: 70,
        eligibleDisruptions: [
            'RAIN_EVENT',
            'WATERLOGGING_EVENT',
            'HEAT_STRESS_EVENT',
            'AIR_QUALITY_EVENT',
            'PLATFORM_OUTAGE',
            'DARK_STORE_UNAVAILABLE'
        ]
    },
    {
        id: 'comprehensive',
        name: 'Comprehensive',
        maxWeeklyPayout: 5000,
        coveragePercent: 90,
        eligibleDisruptions: [
            'RAIN_EVENT',
            'WATERLOGGING_EVENT',
            'HEAT_STRESS_EVENT',
            'AIR_QUALITY_EVENT',
            'ZONE_ACCESS_RESTRICTION',
            'DARK_STORE_UNAVAILABLE',
            'PLATFORM_OUTAGE'
        ]
    }
];
const ZONE_RISK_LOADINGS = {
    low: 3,
    medium: 8,
    high: 14
};
const SHIFT_RISK_LOADINGS = {
    morning: 3,
    afternoon: 2,
    evening: 5,
    night: 7
};
const SHIFT_TYPE_MAP = {
    morning: 'morning_rush',
    afternoon: 'afternoon',
    evening: 'evening_rush',
    night: 'late_night'
};
const EVENT_TYPE_MAP = {
    RAIN_EVENT: 'heavy_rainfall',
    WATERLOGGING_EVENT: 'waterlogging',
    HEAT_STRESS_EVENT: null,
    AIR_QUALITY_EVENT: 'severe_aqi',
    PLATFORM_OUTAGE: 'platform_outage',
    DARK_STORE_UNAVAILABLE: 'dark_store_unavailable',
    ZONE_ACCESS_RESTRICTION: 'zone_access_restriction'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkHealth",
    ()=>checkHealth,
    "createPolicy",
    ()=>createPolicy,
    "generateQuote",
    ()=>generateQuote,
    "getAdminSummary",
    ()=>getAdminSummary,
    "getAllClaims",
    ()=>getAllClaims,
    "getClaim",
    ()=>getClaim,
    "getPolicy",
    ()=>getPolicy,
    "getWorker",
    ()=>getWorker,
    "getWorkerClaims",
    ()=>getWorkerClaims,
    "getWorkerPolicies",
    ()=>getWorkerPolicies,
    "registerWorker",
    ()=>registerWorker,
    "simulateEvent",
    ()=>simulateEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
// ─── API Client ──────────────────────────────────────────────
// Centralised fetch wrapper for the GigSuraksha backend.
// Base URL is read from NEXT_PUBLIC_API_BASE_URL with a safe default.
const BASE_URL = (("TURBOPACK compile-time truthy", 1) ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE_URL : "TURBOPACK unreachable") || 'https://gigsuraksha-backend.fly.dev';
// ─── Generic helpers ─────────────────────────────────────────
async function request(path, options) {
    const res = await fetch(`${BASE_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        },
        ...options
    });
    if (!res.ok) {
        let detail = res.statusText;
        try {
            const body = await res.json();
            detail = body.detail || body.message || JSON.stringify(body);
        } catch  {
        // ignore JSON parse errors
        }
        throw new Error(`API ${res.status}: ${detail}`);
    }
    return res.json();
}
function get(path) {
    return request(path, {
        method: 'GET'
    });
}
function post(path, body) {
    return request(path, {
        method: 'POST',
        body: JSON.stringify(body)
    });
}
function checkHealth() {
    return get('/health');
}
function registerWorker(data) {
    return post('/api/workers/register', data);
}
function getWorker(workerId) {
    return get(`/api/workers/${workerId}`);
}
function generateQuote(payload) {
    return post('/api/quote/generate', payload);
}
function createPolicy(payload) {
    return post('/api/policies/create', payload);
}
function getPolicy(policyId) {
    return get(`/api/policies/${policyId}`);
}
function getWorkerPolicies(workerId) {
    return get(`/api/policies/worker/${workerId}`);
}
function simulateEvent(payload) {
    return post('/api/events/simulate', payload);
}
function getClaim(claimId) {
    return get(`/api/claims/${claimId}`);
}
function getWorkerClaims(workerId) {
    return get(`/api/claims/worker/${workerId}`);
}
function getAllClaims() {
    return get('/api/claims');
}
function getAdminSummary() {
    return get('/api/admin/summary');
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/onboarding/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OnboardingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Header.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/constants.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/briefcase.js [app-client] (ecmascript) <export default as Briefcase>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/indian-rupee.js [app-client] (ecmascript) <export default as IndianRupee>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.js [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
const STEPS = [
    {
        id: 0,
        label: 'Personal',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"]
    },
    {
        id: 1,
        label: 'Work Profile',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$briefcase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Briefcase$3e$__["Briefcase"]
    },
    {
        id: 2,
        label: 'Zone & Shifts',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"]
    },
    {
        id: 3,
        label: 'Earnings',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$indian$2d$rupee$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__IndianRupee$3e$__["IndianRupee"]
    },
    {
        id: 4,
        label: 'Review',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle$3e$__["CheckCircle"]
    }
];
const initial = {
    name: '',
    mobile: '',
    city: '',
    platform: '',
    zoneId: '',
    shifts: [],
    weeklyEarnings: 0,
    weeklyActiveHours: 0,
    upiId: ''
};
function OnboardingPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initial);
    const [otpSent, setOtpSent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const cityZones = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZONES"].filter((z)=>z.city === data.city);
    const selectedZone = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZONES"].find((z)=>z.id === data.zoneId);
    function update(partial) {
        setData((prev)=>({
                ...prev,
                ...partial
            }));
    }
    function toggleShift(shiftId) {
        setData((prev)=>({
                ...prev,
                shifts: prev.shifts.includes(shiftId) ? prev.shifts.filter((s)=>s !== shiftId) : [
                    ...prev.shifts,
                    shiftId
                ]
            }));
    }
    function canProceed() {
        switch(step){
            case 0:
                return data.name.length >= 2 && data.mobile.length >= 10;
            case 1:
                return !!data.city && !!data.platform;
            case 2:
                return !!data.zoneId && data.shifts.length > 0;
            case 3:
                return data.weeklyEarnings > 0 && data.weeklyActiveHours > 0 && data.upiId.length > 0;
            default:
                return true;
        }
    }
    async function handleSubmit() {
        setLoading(true);
        setError(null);
        try {
            // Map first selected shift to backend canonical value
            const primaryShift = data.shifts[0] || 'morning';
            const shiftType = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIFT_TYPE_MAP"][primaryShift] || 'morning_rush';
            const payload = {
                name: data.name,
                phone: data.mobile,
                city: data.city,
                platform: data.platform,
                zone: selectedZone?.name || data.zoneId,
                shift_type: shiftType,
                weekly_earnings: data.weeklyEarnings,
                weekly_active_hours: data.weeklyActiveHours,
                upi_id: data.upiId
            };
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerWorker"])(payload);
            // Save worker with worker_id to localStorage
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveWorker"])({
                worker_id: result.worker_id || '',
                name: data.name,
                phone: data.mobile,
                city: data.city,
                platform: data.platform,
                zone: selectedZone?.name || data.zoneId,
                shift_type: shiftType,
                weekly_earnings: data.weeklyEarnings,
                weekly_active_hours: data.weeklyActiveHours,
                upi_id: data.upiId,
                ...result
            });
            router.push('/quote');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "jsx-85a133392ffa00c7" + " " + "flex-1 max-w-2xl mx-auto px-4 py-6 sm:py-10 w-full",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-85a133392ffa00c7" + " " + "flex items-center gap-1 mb-8 overflow-x-auto pb-2",
                        children: STEPS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "flex items-center gap-1 flex-shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>s.id < step && setStep(s.id),
                                        className: "jsx-85a133392ffa00c7" + " " + `flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors ${s.id === step ? 'bg-primary text-white' : s.id < step ? 'bg-primary-light text-primary cursor-pointer' : 'bg-border-light text-text-muted'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(s.icon, {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-85a133392ffa00c7" + " " + "hidden sm:inline",
                                                children: s.label
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 127,
                                        columnNumber: 15
                                    }, this),
                                    s.id < STEPS.length - 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7" + " " + `w-4 h-px ${s.id < step ? 'bg-primary' : 'bg-border'}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, s.id, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 124,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        padding: "lg",
                        children: [
                            step === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[18px] font-semibold text-text-primary",
                                                children: "Personal Information"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 152,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-text-secondary mt-1",
                                                children: "We need basic details to set up your protection profile."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 153,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 151,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Full Name",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: data.name,
                                            onChange: (e)=>update({
                                                    name: e.target.value
                                                }),
                                            placeholder: "Enter your full name",
                                            className: "jsx-85a133392ffa00c7" + " " + "form-input"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 158,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Mobile Number",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-85a133392ffa00c7" + " " + "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "tel",
                                                        value: data.mobile,
                                                        onChange: (e)=>update({
                                                                mobile: e.target.value
                                                            }),
                                                        placeholder: "+91 98765 43210",
                                                        className: "jsx-85a133392ffa00c7" + " " + "form-input flex-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                                        lineNumber: 168,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        variant: "secondary",
                                                        size: "sm",
                                                        onClick: ()=>setOtpSent(true),
                                                        disabled: data.mobile.length < 10,
                                                        children: otpSent ? 'OTP Sent' : 'Send OTP'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                                        lineNumber: 175,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 167,
                                                columnNumber: 17
                                            }, this),
                                            otpSent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[12px] text-success mt-1",
                                                children: "Demo: OTP verification simulated successfully"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 185,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 150,
                                columnNumber: 13
                            }, this),
                            step === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[18px] font-semibold text-text-primary",
                                                children: "Work Profile"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 196,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-text-secondary mt-1",
                                                children: "Tell us which city and platform you operate on."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 197,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "City",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: data.city,
                                            onChange: (e)=>update({
                                                    city: e.target.value,
                                                    zoneId: ''
                                                }),
                                            className: "jsx-85a133392ffa00c7" + " " + "form-input",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    className: "jsx-85a133392ffa00c7",
                                                    children: "Select city"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                    lineNumber: 207,
                                                    columnNumber: 19
                                                }, this),
                                                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CITIES"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: c,
                                                        className: "jsx-85a133392ffa00c7",
                                                        children: c
                                                    }, c, false, {
                                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                                        lineNumber: 209,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 202,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 201,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Platform",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a133392ffa00c7" + " " + "grid grid-cols-2 gap-2",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PLATFORMS"].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>update({
                                                            platform: p
                                                        }),
                                                    className: "jsx-85a133392ffa00c7" + " " + `px-3 py-2.5 rounded-lg border text-[13px] font-medium transition-colors cursor-pointer ${data.platform === p ? 'border-primary bg-primary-light text-primary' : 'border-border bg-surface text-text-secondary hover:border-primary/40'}`,
                                                    children: p
                                                }, p, false, {
                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 213,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 194,
                                columnNumber: 13
                            }, this),
                            step === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[18px] font-semibold text-text-primary",
                                                children: "Zone & Shift Selection"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 237,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-text-secondary mt-1",
                                                children: "Select your operating zone and the shift windows you typically work."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 236,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Operating Zone",
                                        children: cityZones.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-text-muted",
                                            children: "Select a city first"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 244,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a133392ffa00c7" + " " + "space-y-2",
                                            children: cityZones.map((z)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>update({
                                                            zoneId: z.id
                                                        }),
                                                    className: "jsx-85a133392ffa00c7" + " " + `w-full text-left px-3 py-2.5 rounded-lg border text-[13px] transition-colors cursor-pointer ${data.zoneId === z.id ? 'border-primary bg-primary-light' : 'border-border bg-surface hover:border-primary/40'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-85a133392ffa00c7" + " " + "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-85a133392ffa00c7" + " " + "font-medium text-text-primary",
                                                                    children: z.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    variant: z.riskLevel === 'high' ? 'danger' : z.riskLevel === 'medium' ? 'warning' : 'success',
                                                                    children: [
                                                                        z.riskLevel,
                                                                        " risk"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "jsx-85a133392ffa00c7" + " " + "text-[12px] text-text-muted",
                                                            children: [
                                                                z.darkStores.length,
                                                                " dark stores"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                                            lineNumber: 272,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, z.id, true, {
                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 246,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Shift Windows",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a133392ffa00c7" + " " + "space-y-2",
                                            children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIFT_WINDOWS"].map((sw)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>toggleShift(sw.id),
                                                    className: "jsx-85a133392ffa00c7" + " " + `w-full text-left px-3 py-2.5 rounded-lg border text-[13px] transition-colors cursor-pointer ${data.shifts.includes(sw.id) ? 'border-primary bg-primary-light text-primary font-medium' : 'border-border bg-surface text-text-secondary hover:border-primary/40'}`,
                                                    children: sw.label
                                                }, sw.id, false, {
                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 281,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 280,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 235,
                                columnNumber: 13
                            }, this),
                            step === 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[18px] font-semibold text-text-primary",
                                                children: "Earnings & Payout"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 304,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-text-secondary mt-1",
                                                children: "Enter your average weekly earnings and payout details."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 305,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 303,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Average Weekly Earnings (₹)",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                value: data.weeklyEarnings || '',
                                                onChange: (e)=>update({
                                                        weeklyEarnings: Number(e.target.value)
                                                    }),
                                                placeholder: "e.g. 6000",
                                                className: "jsx-85a133392ffa00c7" + " " + "form-input"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 310,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[12px] text-text-muted mt-1",
                                                children: "Your total earnings across all shifts in a typical week"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 309,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "Weekly Active Hours",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "number",
                                            value: data.weeklyActiveHours || '',
                                            onChange: (e)=>update({
                                                    weeklyActiveHours: Number(e.target.value)
                                                }),
                                            placeholder: "e.g. 40",
                                            className: "jsx-85a133392ffa00c7" + " " + "form-input"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 322,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FieldGroup, {
                                        label: "UPI ID",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: data.upiId,
                                                onChange: (e)=>update({
                                                        upiId: e.target.value
                                                    }),
                                                placeholder: "yourname@upi",
                                                className: "jsx-85a133392ffa00c7" + " " + "form-input"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 331,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[12px] text-text-muted mt-1",
                                                children: "Payouts will be sent to this UPI handle"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 330,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 302,
                                columnNumber: 13
                            }, this),
                            step === 4 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[18px] font-semibold text-text-primary",
                                                children: "Review Your Profile"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-text-secondary mt-1",
                                                children: "Confirm your details before proceeding to your risk assessment and quote."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 349,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 347,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7" + " " + "bg-background border border-border rounded-lg divide-y divide-border",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Name",
                                                value: data.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 354,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Mobile",
                                                value: data.mobile
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 355,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "City",
                                                value: data.city
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 356,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Platform",
                                                value: data.platform
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 357,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Zone",
                                                value: selectedZone?.name || '-'
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 358,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Shifts",
                                                value: data.shifts.map((s)=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$constants$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIFT_WINDOWS"].find((sw)=>sw.id === s)?.label || s).join(', ')
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Weekly Earnings",
                                                value: `₹${data.weeklyEarnings.toLocaleString('en-IN')}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "Weekly Hours",
                                                value: `${data.weeklyActiveHours} hrs`
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 366,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewRow, {
                                                label: "UPI ID",
                                                value: data.upiId
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 367,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 353,
                                        columnNumber: 15
                                    }, this),
                                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7" + " " + "px-3 py-2.5 rounded-lg bg-danger-light border border-danger/20",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "jsx-85a133392ffa00c7" + " " + "text-[13px] text-danger",
                                            children: error
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/onboarding/page.tsx",
                                            lineNumber: 371,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 370,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 346,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-85a133392ffa00c7" + " " + "flex items-center justify-between mt-8 pt-5 border-t border-border",
                                children: [
                                    step > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "ghost",
                                        onClick: ()=>setStep(step - 1),
                                        disabled: loading,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 381,
                                                columnNumber: 17
                                            }, this),
                                            "Back"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 380,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a133392ffa00c7"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 385,
                                        columnNumber: 15
                                    }, this),
                                    step < 4 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onClick: ()=>setStep(step + 1),
                                        disabled: !canProceed(),
                                        children: [
                                            "Continue",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "w-4 h-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/onboarding/page.tsx",
                                                lineNumber: 390,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 388,
                                        columnNumber: 15
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        onClick: handleSubmit,
                                        disabled: loading,
                                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                                    className: "w-4 h-4 animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                    lineNumber: 396,
                                                    columnNumber: 21
                                                }, this),
                                                "Registering..."
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                            children: [
                                                "View My Quote",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/onboarding/page.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/onboarding/page.tsx",
                                        lineNumber: 393,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/onboarding/page.tsx",
                                lineNumber: 378,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/onboarding/page.tsx",
                        lineNumber: 148,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        id: "85a133392ffa00c7",
                        children: ".form-input{color:#0f172a;background:#fff;border:1px solid #e2e8f0;border-radius:.5rem;outline:none;width:100%;padding:.5rem .75rem;font-size:14px;transition:border-color .15s}.form-input:focus{border-color:#2563eb;box-shadow:0 0 0 2px #2563eb1a}.form-input::placeholder{color:#94a3b8}"
                    }, void 0, false, void 0, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 122,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(OnboardingPage, "2Rl9nQplGhopaPJqlesUBJNq1A4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = OnboardingPage;
function FieldGroup({ label, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "block text-[13px] font-medium text-text-primary mb-1.5",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 438,
                columnNumber: 7
            }, this),
            children
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 437,
        columnNumber: 5
    }, this);
}
_c1 = FieldGroup;
function ReviewRow({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "px-4 py-3 flex justify-between items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[13px] text-text-secondary",
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 447,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[13px] font-medium text-text-primary text-right max-w-[60%]",
                children: value
            }, void 0, false, {
                fileName: "[project]/src/app/onboarding/page.tsx",
                lineNumber: 448,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/onboarding/page.tsx",
        lineNumber: 446,
        columnNumber: 5
    }, this);
}
_c2 = ReviewRow;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "OnboardingPage");
__turbopack_context__.k.register(_c1, "FieldGroup");
__turbopack_context__.k.register(_c2, "ReviewRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0fph-0-._.js.map