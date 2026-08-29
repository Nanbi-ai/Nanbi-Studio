export function initConfigHub(containerId) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
      <div class="flex-1 max-w-6xl">
        <h2 class="text-3xl font-bold" style="color: var(--text);">Global Configuration Hub</h2>
        <p class="text-lg mt-2 mb-8" style="color: var(--muted);">Centralized governance for Nanbi Super App architectures, ledgers, and protocols.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="#/config/presentation" class="block p-8 transition-all" style="background: var(--bg); border: 1px solid var(--border); border-radius: 0px; text-decoration: none;">
                <div class="w-12 h-12 flex items-center justify-center mb-4" style="background: var(--hover-bg); color: var(--brand-teal-dark); font-size: 1.5rem;">
                    <i class="fas fa-palette"></i>
                </div>
                <h3 class="text-xl font-bold mb-2" style="color: var(--text);">Presentation Engine</h3>
                <p class="text-sm" style="color: var(--muted);">Manage global themes, brand colors, layout dimensions, and typography.</p>
            </a>

            <div class="block p-8" style="background: var(--bg); border: 1px solid var(--border); border-radius: 0px; opacity: 0.6; cursor: not-allowed;">
                <div class="w-12 h-12 flex items-center justify-center mb-4" style="background: rgba(100,116,139,0.1); color: var(--muted); font-size: 1.5rem;">
                    <i class="fas fa-globe"></i>
                </div>
                <h3 class="text-xl font-bold mb-2" style="color: var(--text);">Regional Taxonomy</h3>
                <p class="text-sm" style="color: var(--muted);">Configure Country > State > District hierarchical ledgers. (Pending)</p>
            </div>
        </div>
      </div>
    `;
}
