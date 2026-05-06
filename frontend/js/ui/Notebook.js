const API_BASE = 'http://localhost:8080/api';

export class NotebookUI {
    constructor() {
        this.overlay = document.getElementById('notebook-overlay');
        this.listEl = document.getElementById('notebook-list');
        document.getElementById('notebook-close').addEventListener('click', () => this.hide());
    }

    async show() {
        const playerName = window.playerName || 'player';
        try {
            const res = await fetch(`${API_BASE}/notebook?player=${encodeURIComponent(playerName)}`);
            if (res.ok) {
                const items = await res.json();
                this.render(items);
            } else {
                this.listEl.innerHTML = '<p style="color:#888">暂无数据</p>';
            }
        } catch {
            this.listEl.innerHTML = '<p style="color:#888">无法连接后端，请确保后端已启动</p>';
        }
        this.overlay.classList.remove('hidden');
    }

    hide() {
        this.overlay.classList.add('hidden');
    }

    render(items) {
        if (items.length === 0) {
            this.listEl.innerHTML = '<p style="color:#888">错题本为空</p>';
            return;
        }
        this.listEl.innerHTML = items.map(item => {
            const q = item.wrongAnswer.question;
            return `
            <div class="notebook-item" data-id="${item.id}">
                <div class="nb-question">${q.content}</div>
                <div class="nb-meta">
                    正确答案: ${q.answer} |
                    你的选择: ${item.wrongAnswer.wrongOption} |
                    复习${item.reviewCount}次 |
                    ${item.mastered ? '已掌握' : '未掌握'}
                </div>
                <div class="nb-actions">
                    <button class="nb-master" data-id="${item.id}">
                        ${item.mastered ? '取消掌握' : '标记掌握'}
                    </button>
                </div>
            </div>`;
        }).join('');

        this.listEl.querySelectorAll('.nb-master').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                const item = items.find(i => i.id == id);
                try {
                    await fetch(`${API_BASE}/notebook/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mastered: !item.mastered })
                    });
                    this.show();
                } catch (e) { console.error('Failed to update:', e); }
            });
        });
    }
}
