"use strict";

// Elements
const searchInput = document.getElementById("searchInput");
const toolsGrid = document.getElementById("toolsGrid");
const toolCards = [...document.querySelectorAll(".tool-card")];
const categoryButtons = [...document.querySelectorAll(".category-button")];
const emptyState = document.getElementById("emptyState");

const themeButton = document.getElementById("themeButton");
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

let activeCategory = "all";

// Search and category filtering
function filterTools() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    toolCards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const description = card.querySelector("p").textContent.toLowerCase();
        const keywords = (card.dataset.search || "").toLowerCase();
        const category = card.dataset.category;

        const matchesSearch =
            title.includes(query) ||
            description.includes(query) ||
            keywords.includes(query);

        const matchesCategory =
            activeCategory === "all" ||
            category === activeCategory;

        const visible = matchesSearch && matchesCategory;

        card.hidden = !visible;

        if (visible) {
            visibleCount++;
        }
    });

    emptyState.hidden = visibleCount !== 0;
    toolsGrid.hidden = visibleCount === 0;
}

// Search input
searchInput.addEventListener("input", filterTools);

// Category buttons
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.category;

        categoryButtons.forEach((item) => {
            const selected = item === button;

            item.classList.toggle("selected", selected);
            item.setAttribute("aria-pressed", String(selected));
        });

        filterTools();
    });

    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("selected"))
    );
});

// Search shortcut
document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping =
        target instanceof HTMLElement &&
        (
            target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
        );

    if (
        event.key === "/" &&
        !isTyping &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
    ) {
        event.preventDefault();
        searchInput.focus();
    }

    if (event.key === "Escape") {
        searchInput.blur();
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
    }
});

// Theme settings
function applyTheme(theme) {
    const isLight = theme === "light";

    document.body.classList.toggle("light-theme", isLight);

    themeButton.textContent = isLight ? "☀" : "◐";

    themeButton.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme"
    );

    try {
        localStorage.setItem("trivexora-theme", theme);
    } catch (error) {
        // The site still works if browser storage is unavailable.
    }
}

try {
    const savedTheme = localStorage.getItem("trivexora-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
        applyTheme(savedTheme);
    }
} catch (error) {
    // Use the default dark theme.
}

themeButton.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");

    applyTheme(isLight ? "dark" : "light");
});

// Mobile navigation
menuButton.setAttribute("aria-expanded", "false");

menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "✕" : "☰";
});

// Close mobile navigation after selecting a link
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
    });
});

// Highlight navigation based on the current section
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navLinks.querySelectorAll("a").forEach((link) => {
                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);
                });
            });
        },
        {
            rootMargin: "-25% 0px -60% 0px",
            threshold: 0
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));
}

// Current year
document.getElementById("currentYear").textContent =
    new Date().getFullYear();

// Initial filtering
filterTools();

console.log("TRIVEXORA initialized successfully.");

