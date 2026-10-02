const originalOrder = new WeakMap();
let narrowScreen;

export function updateNavigationOrder() {
    if (!narrowScreen) {
        narrowScreen = window.matchMedia("(max-width: 768px)");
        narrowScreen.addEventListener("change", updateNavigationOrder);
    }
    document.querySelectorAll("[data-responsive-navigation]").forEach(region => {
        if (!originalOrder.has(region)) originalOrder.set(region, [...region.children]);
        const children = originalOrder.get(region);
        const forward = children.filter(child => child.matches('[data-action="next"], #guidedNext, #storyNext'));
        const skip = children.filter(child => child.matches('[data-action="skip"], #guidedSkip'));
        const ordered = narrowScreen.matches
            ? [...forward, ...skip, ...children.filter(child => !forward.includes(child) && !skip.includes(child))]
            : children;
        const focused = region.contains(document.activeElement) ? document.activeElement : null;
        ordered.forEach(child => region.appendChild(child));
        if (focused && document.activeElement !== focused) focused.focus({ preventScroll: true });
    });
}
