function LucideIcon({ name, className, size }) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (!name) return;

        const renderIcon = () => {
            if (window.lucide && ref.current) {
                // Clear existing content
                ref.current.innerHTML = '';

                // Create a temporary i element for Lucide to process
                const i = document.createElement('i');
                i.setAttribute('data-lucide', name);

                // Apply classes to the i element which will be transferred to the SVG
                if (className) i.setAttribute('class', className);
                if (size) {
                    // Try to map generic size classes or styles if needed
                    // But usually className handles it. 
                    // If size prop is explicit number:
                    i.setAttribute('width', size);
                    i.setAttribute('height', size);
                }

                ref.current.appendChild(i);

                // Process only this element
                window.lucide.createIcons({
                    root: ref.current,
                    nameAttr: 'data-lucide',
                    attrs: {
                        class: className // redundantly ensure class is passed
                    }
                });
            }
        };

        // If lucide is not loaded yet, wait for it (though it should be)
        if (window.lucide) {
            renderIcon();
        } else {
            const interval = setInterval(() => {
                if (window.lucide) {
                    renderIcon();
                    clearInterval(interval);
                }
            }, 100);
            return () => clearInterval(interval);
        }

    }, [name, className, size]);

    // Use a span wrapper that React controls exclusively
    // We suppress React updates to children by not having any children in JSX
    return React.createElement('span', {
        ref: ref,
        className: "lucide-icon-wrapper inline-flex items-center justify-center",
        style: { display: 'inline-flex' } // ensure it doesn't collapse
    });
}

// Expose to window
window.LucideIcon = LucideIcon;
