export function initConfigHub(containerId) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = `
      <div class="flex-1 max-w-6xl">
        <h2 class="text-3xl font-bold text-main" style="font-family: 'Nunito', sans-serif;">Global Configuration Hub</h2>
        <p class="text-lg mt-2 text-sub mb-8">Centralized governance for Nanbi Super App architectures, ledgers, and protocols.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Presentation Layer -->
            <a href="#/config/presentation" class="block p-6 rounded-lg transition-all" style="background: var(--card); border: 1px solid var(--border); text-decoration: none;">
                <div class="w-12 h-12 rounded flex items-center justify-center mb-4" style="background: var(--hover-bg); color: var(--brand-teal-dark); font-size: 1.5rem;">
                    <i class="fas fa-palette"></i>
                </div>
                <h3 class="text-xl font-bold text-main mb-2">Presentation Engine</h3>
                <p class="text-sm text-sub">Manage global themes, brand colors, layout dimensions, and typography.</p>
            </a>

            <!-- Regional Taxonomy (Locked/Pending) -->
            <div class="block p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border); opacity: 0.6; cursor: not-allowed;">
                <div class="w-12 h-12 rounded flex items-center justify-center mb-4" style="background: rgba(100,116,139,0.1); color: var(--muted); font-size: 1.5rem;">
                    <i class="fas fa-globe"></i>
                </div>
                <h3 class="text-xl font-bold text-main mb-2">Regional Taxonomy</h3>
                <p class="text-sm text-sub">Configure Country > State > District hierarchical ledgers. (Pending)</p>
            </div>

            <!-- RBAC & Users (Locked/Pending) -->
            <div class="block p-6 rounded-lg" style="background: var(--card); border: 1px solid var(--border); opacity: 0.6; cursor: not-allowed;">
                <div class="w-12 h-12 rounded flex items-center justify-center mb-4" style="background: rgba(100,116,139,0.1); color: var(--muted); font-size: 1.5rem;">
                    <i class="fas fa-users-cog"></i>
                </div>
                <h3 class="text-xl font-bold text-main mb-2">Access Control (RBAC)</h3>
                <p class="text-sm text-sub">Manage user roles, cryptographic permissions, and edge sync rules. (Pending)</p>
            </div>
        </div>
      </div>
    `;
}
