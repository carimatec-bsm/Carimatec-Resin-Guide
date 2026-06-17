// =============================================
// 화면 동작 로직 (수정 불필요)
// =============================================

let currentCategory = 'engineering';
let selectedIds = []; // 선택된 소재 (최대 2개, 2개면 비교 모드)
let mySSChart = null;
let myRadarChart = null;
const MAX_COMPARE = 2;

// 제품 코드 표기: 다색(색상에 '/' 포함) 소재는 색상별 변형 코드로 전개
function formatCode(mat) {
    const code = (mat.code || '').trim();
    if (!code) return '';
    const color = (mat.stats && mat.stats.color) || '';
    if (color.indexOf('/') > -1) {
        return color.split('/').map(c => code + c.trim()).join(' / ');
    }
    return code;
}

window.switchCategory = function(cat) {
    currentCategory = cat;
    selectedIds = [];
    document.querySelectorAll('.category-tab').forEach(t => { t.classList.remove('active'); t.classList.add('text-slate-500'); });
    const activeTab = document.getElementById(`tab-${cat}`);
    if (activeTab) { activeTab.classList.add('active'); activeTab.classList.remove('text-slate-500'); }

    const ssContainer = document.getElementById('ss-container');
    if (cat === 'engineering') ssContainer.style.display = 'block';
    else ssContainer.style.display = 'none';

    const searchInput = document.getElementById('material-search');
    if (searchInput) searchInput.value = '';
    window.renderSystem();
    window.resetMaterialUI();
};

window.renderSystem = function() {
    const catData = resinData[currentCategory];
    if (!catData) return;
    const sortedIds = Object.keys(catData).sort((a,b) => catData[a].idx - catData[b].idx);

    const btnContainer = document.getElementById('material-btns-container');
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');

    if (!btnContainer || !tableHead || !tableBody) return;

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    btnContainer.innerHTML = '';
    sortedIds.forEach(id => {
        const mat = catData[id];
        const btn = document.createElement('button');
        btn.className = `material-btn py-3 px-1 text-[11px] font-bold rounded-lg border ${mat.border?.replace('border-', 'border-opacity-20 ') || 'border-slate-200'} ${mat.color || 'bg-white'} ${mat.text || 'text-slate-800'} hover:shadow-md transition-all`;
        btn.id = `btn-${id}`;
        btn.innerText = mat.title;
        if (canHover) {
            btn.onmouseover = () => { if (selectedIds.length === 0) window.updateMaterialUI(id); };
            btn.onmouseleave = () => { if (selectedIds.length === 0) window.resetMaterialUI(); };
        }
        btn.onclick = () => window.handleClick(id);
        btnContainer.appendChild(btn);
    });

    let headHtml = `<tr class="bg-slate-100 font-bold"><th class="p-3 border">Properties (물성)</th><th class="p-3 border">Unit (단위)</th>`;
    sortedIds.forEach(id => { headHtml += `<th class="p-3 border col-${id}">${catData[id].title}</th>`; });
    tableHead.innerHTML = headHtml + `</tr>`;

    const statsLabels = [{ label: 'Color (제공 색상)', unit: '-', key: 'color' }, { label: 'Viscosity (점도)', unit: 'cP', key: 'visc' }, { label: 'E Modulus (탄성계수)', unit: 'MPa', key: 'modulus' }, { label: 'Strength (인장강도)', unit: 'MPa', key: 'strength' }, { label: 'Elongation (연신율)', unit: '%', key: 'elongation' }, { label: 'Izod Impact (충격강도)', unit: 'J/m', key: 'impact' }, { label: 'Hardness (경도)', unit: 'D/A', key: 'hardness' }];

    let bodyHtml = '';
    // 제품 코드 행 (맨 위)
    bodyHtml += `<tr class="text-xs"><td class="p-3 border font-bold">Code (제품 코드)</td><td class="p-3 border text-[10px]">-</td>`;
    sortedIds.forEach(id => { bodyHtml += `<td class="p-3 border col-${id}">${formatCode(catData[id]) || '-'}</td>`; });
    bodyHtml += `</tr>`;
    statsLabels.forEach((stat, i) => {
        bodyHtml += `<tr class="${i % 2 === 1 ? 'bg-slate-50' : ''} text-xs"><td class="p-3 border font-bold">${stat.label}</td><td class="p-3 border text-[10px]">${stat.unit}</td>`;
        sortedIds.forEach(id => {
            let val = catData[id].stats[stat.key];
            if (stat.key === 'hardness') val += catData[id].stats.unit;
            bodyHtml += `<td class="p-3 border col-${id}">${val}</td>`;
        });
        bodyHtml += `</tr>`;
    });
    tableBody.innerHTML = bodyHtml;
    window.initCharts();
    if (window.applyMaterialFilter) window.applyMaterialFilter();
};

window.initCharts = function() {
    const ctxSS = document.getElementById('ssCurveChart')?.getContext('2d');
    const ctxRadar = document.getElementById('radarChart')?.getContext('2d');
    const catData = resinData[currentCategory];
    const sortedIds = Object.keys(catData).sort((a,b) => catData[a].idx - catData[b].idx);

    if (currentCategory === 'engineering' && ctxSS) {
        const ssDatasets = sortedIds.map(id => ({
            label: catData[id].title, borderColor: catData[id].borderColor, data: catData[id].chart || [], showLine: true, tension: 0.2, borderWidth: 3, pointRadius: 0
        }));
        if (mySSChart) mySSChart.destroy();
        mySSChart = new Chart(ctxSS, {
            type: 'scatter',
            data: { datasets: ssDatasets },
            options: { responsive: true, maintainAspectRatio: false, scales: { x: { min: 0, max: 300, title: { display: true, text: 'Strain (%)' } }, y: { min: 0, max: 100, title: { display: true, text: 'Stress (MPa)' } } }, plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { weight: 'bold' } } } } }
        });
    }

    if (ctxRadar) {
        const radarLabels = ['Strength (인장강도)', 'Modulus (탄성계수)', 'Elongation (연신율)', 'Flowability (흐름성)', 'Hardness (경도 D/A)', 'Izod Impact (충격강도)'];
        const radarDatasets = sortedIds.map(id => {
            const s = catData[id].stats;
            const mScale = (currentCategory === 'engineering') ? 45.0 : 35.0; 
            const flow = 100 - (parseFloat(s.visc) / (currentCategory === 'engineering' ? 60.0 : 50.0));
            const impactVal = s.impact === '-' ? 0 : parseFloat(s.impact);
            const hardnessVal = s.unit === 'A' ? (parseFloat(s.hardness) * 0.4) : parseFloat(s.hardness);

            const elonMultiplier = (currentCategory === 'engineering' ? 0.35 : 2.5);
            const elonScore = parseFloat(s.elongation) * elonMultiplier;

            const data = [
                parseFloat(s.strength) * 1.0, 
                parseFloat(s.modulus) / mScale, 
                elonScore > 100 ? 100 : elonScore, 
                flow < 0 ? 0 : flow, 
                hardnessVal, 
                impactVal
            ];
            return { label: catData[id].title, backgroundColor: catData[id].borderColor + '22', borderColor: catData[id].borderColor, data: data, borderWidth: 2, pointRadius: 2 };
        });
        if (myRadarChart) myRadarChart.destroy();
        myRadarChart = new Chart(ctxRadar, {
            type: 'radar',
            data: { labels: radarLabels, datasets: radarDatasets },
            options: { 
                responsive: true, maintainAspectRatio: false, 
                scales: { r: { min: 0, max: 100, ticks: { display: false }, pointLabels: { font: { size: 9, weight: 'bold' } } } },
                plugins: { legend: { position: 'top', labels: { boxWidth: 10, font: { weight: 'bold' } } } }
            }
        });
    }
};

window.handleClick = function(id) {
    const idx = selectedIds.indexOf(id);
    if (idx >= 0) {
        selectedIds.splice(idx, 1);          // 이미 선택된 소재 → 선택 해제
    } else {
        selectedIds.push(id);                // 새 소재 추가
        if (selectedIds.length > MAX_COMPARE) selectedIds.shift(); // 최대 2개 유지(가장 오래된 것 제거)
    }
    refreshButtons();
    if (selectedIds.length === 0) window.resetMaterialUI();
    else if (selectedIds.length === 1) window.updateMaterialUI(selectedIds[0]);
    else window.updateComparisonUI(selectedIds);
};

// 버튼 선택 표시(링) 갱신
function refreshButtons() {
    document.querySelectorAll('.material-btn').forEach(b => {
        const on = selectedIds.includes(b.id.replace('btn-', ''));
        b.classList.toggle('active', on);
        b.classList.toggle('ring-2', on);
        b.classList.toggle('ring-offset-2', on);
        b.classList.toggle('ring-indigo-400', on);
    });
}

// 상세 영역 표시 모드 전환: 'default' | 'single' | 'compare'
function showDetailMode(mode) {
    const map = { 'default-msg': 'default', 'active-content': 'single', 'compare-content': 'compare' };
    Object.keys(map).forEach(elId => {
        const el = document.getElementById(elId);
        if (el) el.classList.toggle('hidden', map[elId] !== mode);
    });
}

// 표 하이라이트 제거(전 카테고리 색상 포함)
function clearTableHighlight() {
    document.querySelectorAll('#material-table td, #material-table th').forEach(el => el.classList.remove(
        'font-bold', 'bg-blue-100', 'bg-orange-100', 'bg-green-100', 'bg-yellow-100',
        'bg-sky-100', 'bg-pink-100', 'bg-teal-100', 'bg-rose-100', 'bg-slate-200', 'bg-slate-100'));
}

window.clearSelection = function() {
    selectedIds = [];
    refreshButtons();
    window.resetMaterialUI();
};

window.updateMaterialUI = function(id) {
    const data = resinData[currentCategory][id];
    if (!data) return;
    const card = document.getElementById('detail-view');
    showDetailMode('single');
    if (card) card.className = `${data.color} p-6 rounded-2xl shadow-md border-t-8 ${data.border} min-h-[500px] flex flex-col justify-center overflow-y-auto`;

    document.getElementById('mat-title').innerText = data.title;
    document.getElementById('mat-tag').innerText = data.tag;
    const codeEl = document.getElementById('mat-code');
    if (codeEl) { const c = formatCode(data); codeEl.innerText = c ? ('제품 코드: ' + c) : ''; codeEl.classList.toggle('hidden', !c); }
    document.getElementById('mat-desc').innerText = `"${data.features.split('\n')[0].replace('· ', '')}"`;
    document.getElementById('mat-features').innerText = data.features;
    document.getElementById('mat-apps').innerText = data.apps;
    const hardnessInfo = data.stats.hardness + (data.stats.unit === 'A' ? " <span class='text-red-500'>(Shore A)</span>" : "D");
    document.getElementById('mat-color-text').innerHTML = `${data.stats.color} / 경도: ${hardnessInfo}`;

    const chipContainer = document.getElementById('mat-color-chip');
    if (chipContainer) {
        chipContainer.innerHTML = '';
        const colorMap = { 'C': '#00aeef', 'M': '#ec008c', 'Y': '#fff200', 'K': '#000000', 'W': '#ffffff', 'CL': '#ffffff', 'Black': '#000', 'Gray': '#64748b', 'Beige': '#d4b996', 'Amber/Clear': '#ffbf00', 'Yellowish': '#fdfd96', 'Transparent': '#f8fafc', 'White': '#fff', 'Yellow': '#fff200', 'Clear': '#ffffff' };
        const currentColors = data.stats.color.includes('/') ? data.stats.color.split('/') : [data.stats.color];
        currentColors.forEach(c => {
            const wrapper = document.createElement('div'); wrapper.className = "flex flex-col items-center";
            const dot = document.createElement('div'); dot.className = "w-4 h-4 rounded-full border border-slate-300 shadow-sm " + ( (c === 'Clear' || c === 'CL') ? "color-dot-clear" : (c === 'Transparent' ? "color-dot-transparent" : "") );
            if (!c.includes('Clear') && !c.includes('Transparent') && c !== 'CL') dot.style.backgroundColor = colorMap[c] || '#ddd';
            wrapper.appendChild(dot);
            if (c === 'Clear' || c === 'CL' || c === 'Transparent') { const label = document.createElement('span'); label.className = "cl-label font-bold"; label.innerText = "CL"; wrapper.appendChild(label); }
            chipContainer.appendChild(wrapper);
        });
    }

    document.getElementById('mat-title').className = `text-2xl font-bold ${data.text}`;
    document.getElementById('mat-tag').className = `${data.tagColor} text-slate-900 text-xs px-2 py-1 rounded-full font-bold`;

    clearTableHighlight();
    if (selectedIds.includes(id)) document.querySelectorAll(`.col-${id}`).forEach(el => el.classList.add(data.tableClass, 'font-bold'));

    const sortedIds = Object.keys(resinData[currentCategory]).sort((a,b) => resinData[currentCategory][a].idx - resinData[currentCategory][b].idx);
    if (currentCategory === 'engineering' && mySSChart) {
        mySSChart.data.datasets.forEach((ds, i) => { if (mySSChart.data.datasets[i]) mySSChart.setDatasetVisibility(i, sortedIds[i] === id); });
        mySSChart.options.scales.x.max = data.zoomMax || 300; mySSChart.update();
        document.getElementById('zoom-indicator').classList.toggle('hidden', (data.zoomMax || 300) >= 100);
    }
    if (myRadarChart) { myRadarChart.data.datasets.forEach((ds, i) => { if (myRadarChart.data.datasets[i]) myRadarChart.setDatasetVisibility(i, sortedIds[i] === id); }); myRadarChart.update(); }
};

window.resetMaterialUI = function() {
    showDetailMode('default');
    const zoom = document.getElementById('zoom-indicator');
    if (zoom) zoom.classList.add('hidden');
    const card = document.getElementById('detail-view');
    if (card) card.className = `bg-slate-100 p-8 rounded-2xl shadow-md border-t-8 border-slate-300 min-h-[500px] flex flex-col justify-center`;
    clearTableHighlight();
    if (mySSChart && currentCategory === 'engineering') { mySSChart.data.datasets.forEach((ds, i) => mySSChart.setDatasetVisibility(i, true)); mySSChart.options.scales.x.max = 300; mySSChart.update(); }
    if (myRadarChart) { myRadarChart.data.datasets.forEach((ds, i) => myRadarChart.setDatasetVisibility(i, true)); myRadarChart.update(); }
    if (selectedIds.length === 0) refreshButtons();
};

// 소재 2개 비교 뷰
window.updateComparisonUI = function(ids) {
    const cat = resinData[currentCategory];
    const a = cat[ids[0]], b = cat[ids[1]];
    if (!a || !b) return;

    const card = document.getElementById('detail-view');
    if (card) card.className = `bg-white p-6 rounded-2xl shadow-md border-t-8 border-indigo-400 min-h-[500px] flex flex-col overflow-y-auto`;
    showDetailMode('compare');

    const fmt = (m, r) => {
        if (r.top) return (r.key === 'code' ? (formatCode(m) || '-') : (m[r.key] || '-'));
        let v = m.stats[r.key];
        if (r.key === 'hardness') v = v + (m.stats.unit || '');
        return v;
    };
    const rows = [
        { label: '제품 코드', key: 'code', top: true },
        { label: '점도 (cP)', key: 'visc' },
        { label: '탄성계수 (MPa)', key: 'modulus' },
        { label: '인장강도 (MPa)', key: 'strength' },
        { label: '연신율 (%)', key: 'elongation' },
        { label: '충격강도 (J/m)', key: 'impact' },
        { label: '경도', key: 'hardness' },
        { label: '색상', key: 'color' }
    ];
    const rowsHtml = rows.map(r => `<tr class="border-b border-slate-100">
        <td class="py-1.5 pr-2 text-slate-500 font-medium whitespace-nowrap">${r.label}</td>
        <td class="py-1.5 px-1 text-center font-bold ${a.text}">${fmt(a, r)}</td>
        <td class="py-1.5 px-1 text-center font-bold ${b.text}">${fmt(b, r)}</td>
    </tr>`).join('');

    const cc = document.getElementById('compare-content');
    cc.innerHTML = `
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-700">⚖️ 소재 비교</h3>
                <button onclick="window.clearSelection()" class="text-xs text-slate-500 hover:text-slate-800 underline">선택 해제</button>
            </div>
            <table class="w-full text-xs">
                <thead><tr class="border-b-2 border-slate-200">
                    <th class="text-left py-1"></th>
                    <th class="py-1 px-1 text-center ${a.text}">${a.title}</th>
                    <th class="py-1 px-1 text-center ${b.text}">${b.title}</th>
                </tr></thead>
                <tbody>${rowsHtml}</tbody>
            </table>
            <div class="space-y-3 pt-1">
                <div>
                    <h4 class="text-xs font-bold ${a.text} mb-1">${a.title} · 특징/용도</h4>
                    <p class="text-xs text-slate-600 whitespace-pre-line leading-relaxed">${a.features}</p>
                    <p class="text-xs text-slate-500 mt-1">🚀 ${a.apps}</p>
                </div>
                <div class="border-t border-slate-100 pt-2">
                    <h4 class="text-xs font-bold ${b.text} mb-1">${b.title} · 특징/용도</h4>
                    <p class="text-xs text-slate-600 whitespace-pre-line leading-relaxed">${b.features}</p>
                    <p class="text-xs text-slate-500 mt-1">🚀 ${b.apps}</p>
                </div>
            </div>
        </div>`;

    // 차트: 선택된 2개만 표시
    const sortedIds = Object.keys(cat).sort((x, y) => cat[x].idx - cat[y].idx);
    if (currentCategory === 'engineering' && mySSChart) {
        mySSChart.data.datasets.forEach((ds, i) => mySSChart.setDatasetVisibility(i, ids.includes(sortedIds[i])));
        const zmax = Math.max.apply(null, ids.map(id => cat[id].zoomMax || 300));
        mySSChart.options.scales.x.max = zmax;
        document.getElementById('zoom-indicator').classList.toggle('hidden', zmax >= 100);
        mySSChart.update();
    }
    if (myRadarChart) {
        myRadarChart.data.datasets.forEach((ds, i) => myRadarChart.setDatasetVisibility(i, ids.includes(sortedIds[i])));
        myRadarChart.update();
    }

    // 표: 선택된 2개 컬럼 강조
    clearTableHighlight();
    ids.forEach(id => { const d = cat[id]; document.querySelectorAll(`.col-${id}`).forEach(el => el.classList.add(d.tableClass, 'font-bold')); });
};

// 소재 검색/필터: 이름·태그·특징·용도를 대상으로 버튼과 표 컬럼을 필터링
window.applyMaterialFilter = function() {
    const input = document.getElementById('material-search');
    const clearBtn = document.getElementById('material-search-clear');
    const emptyMsg = document.getElementById('search-empty');
    const q = (input ? input.value : '').trim().toLowerCase();
    const catData = resinData[currentCategory] || {};
    if (clearBtn) clearBtn.classList.toggle('hidden', q === '');
    let visibleCount = 0;
    Object.keys(catData).forEach(id => {
        const m = catData[id];
        const hay = `${m.title} ${m.tag || ''} ${m.features || ''} ${m.apps || ''}`.toLowerCase();
        const match = q === '' || hay.includes(q);
        const btn = document.getElementById(`btn-${id}`);
        if (btn) btn.classList.toggle('hidden', !match);
        document.querySelectorAll(`.col-${id}`).forEach(el => el.classList.toggle('hidden', !match));
        if (match) visibleCount++;
    });
    if (emptyMsg) emptyMsg.classList.toggle('hidden', visibleCount !== 0);
};

document.addEventListener('DOMContentLoaded', () => {
    window.renderSystem();
    // 푸터 최종 수정일 (data.js의 lastUpdated 값) 표시
    const lu = (typeof lastUpdated !== 'undefined' && lastUpdated) ? lastUpdated : '';
    const luEl = document.getElementById('last-updated');
    if (luEl) luEl.innerText = lu;
    const luWrap = document.getElementById('updated-wrap');
    if (luWrap) luWrap.classList.toggle('hidden', !lu);
    const input = document.getElementById('material-search');
    const clearBtn = document.getElementById('material-search-clear');
    if (input) input.addEventListener('input', window.applyMaterialFilter);
    if (clearBtn) clearBtn.addEventListener('click', () => { input.value = ''; window.applyMaterialFilter(); input.focus(); });
});
