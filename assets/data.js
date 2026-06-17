// =============================================
// 레진 물성 데이터 (영업팀이 수정하는 파일)
// 수치/소재를 바꾸려면 이 파일만 편집하세요.
// =============================================

const colorThemes = {
    blue: { color: 'bg-blue-50', border: 'border-blue-800', text: 'text-blue-900', tagColor: 'bg-blue-200', tableClass: 'bg-blue-100', borderColor: '#1e3a8a' },
    orange: { color: 'bg-orange-50', border: 'border-orange-600', text: 'text-orange-800', tagColor: 'bg-orange-200', tableClass: 'bg-orange-100', borderColor: '#ea580c' },
    green: { color: 'bg-green-50', border: 'border-green-700', text: 'text-green-800', tagColor: 'bg-green-200', tableClass: 'bg-green-100', borderColor: '#15803d' },
    yellow: { color: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-800', tagColor: 'bg-yellow-200', tableClass: 'bg-yellow-100', borderColor: '#ca8a04' },
    sky: { color: 'bg-sky-50', border: 'border-sky-500', text: 'text-sky-800', tagColor: 'bg-sky-200', tableClass: 'bg-sky-100', borderColor: '#0ea5e9' },
    pink: { color: 'bg-pink-50', border: 'border-pink-500', text: 'text-pink-800', tagColor: 'bg-pink-200', tableClass: 'bg-pink-100', borderColor: '#db2777' },
    teal: { color: 'bg-teal-50', border: 'border-teal-800', text: 'text-teal-900', tagColor: 'bg-teal-200', tableClass: 'bg-teal-100', borderColor: '#0d9488' },
    rose: { color: 'bg-rose-50', border: 'border-rose-800', text: 'text-rose-900', tagColor: 'bg-rose-200', tableClass: 'bg-rose-100', borderColor: '#e11d48' },
    darkSlate: { color: 'bg-slate-100', border: 'border-slate-800', text: 'text-slate-900', tagColor: 'bg-slate-300', tableClass: 'bg-slate-200', borderColor: '#1e293b' },
    pureWhite: { color: 'bg-slate-50', border: 'border-slate-400', text: 'text-slate-900', tagColor: 'bg-slate-200', tableClass: 'bg-slate-100', borderColor: '#64748b' }
};

const resinData = {
    engineering: {
        rigid: { idx: 0, zoomMax: 10, title: 'Rigid V2 Black', tag: '고강성/정적모델', ...colorThemes.blue, features: '· 높은 강성과 치수 안정성\n· 외부 힘에 의한 변형이 거의 없는 단단함', apps: '정적 전시 모델, 검사용 지그, 정밀 케이스.', stats: { visc: '2822', modulus: '2859', strength: '80.8', elongation: '6.4', impact: '41.5', hardness: '74.5', color: 'Black', unit: 'D' }, chart: [{x: 0, y: 0}, {x: 2, y: 60}, {x: 4, y: 82}, {x: 6.4, y: 80.8}] },
        toughi: { idx: 1, zoomMax: 20, title: 'Tough V2 I Black', tag: '강도/내충격', ...colorThemes.orange, features: '· 높은 강성과 강도\n· 충격에 강한 모델링 출력에 적합', apps: '기능성 시제품, 인클로저, 보호용 커버.', stats: { visc: '1000', modulus: '2155', strength: '71.5', elongation: '10.4', impact: '43.7', hardness: '61.0', color: 'Black', unit: 'D' }, chart: [{x: 0, y: 0}, {x: 3, y: 55}, {x: 6, y: 72}, {x: 10.4, y: 50}] },
        toughe: { idx: 2, zoomMax: 120, title: 'Tough V2 E Black', tag: '유연/내구성', ...colorThemes.green, features: '· 높은 유연성 및 내구성\n· 반복적인 구동이나 구부림에도 파손되지 않음', apps: '리빙 힌지, 스냅핏 조인트, 반복 체결용 클립.', stats: { visc: '700', modulus: '984', strength: '34.5', elongation: '100.6', impact: '76.1', hardness: '56.5', color: 'Black', unit: 'D' }, chart: [{x: 0, y: 0}, {x: 10, y: 35}, {x: 60, y: 28}, {x: 100.6, y: 34.5}] },
        elasto70: { idx: 4, zoomMax: 300, title: 'Elasto 70 Black', tag: '고탄성/저경도', ...colorThemes.sky, features: '· 고무와 같은 높은 탄성과 유연성\n· 우수한 충격 흡수율과 미끄럼 방지', apps: '가스켓, 씰, 완충용 패드.', stats: { visc: '5000', modulus: '40', strength: '6.6', elongation: '222.7', impact: '80.0', hardness: '78', color: 'Black', unit: 'A' }, chart: [{x: 0, y: 0}, {x: 100, y: 5}, {x: 222.7, y: 6.6}] },
        elasto85: { idx: 5, zoomMax: 300, title: 'Elasto 85 Black', tag: '고탄성/내마모', ...colorThemes.pink, features: '· 강력한 물성의 고성능 1액형 탄성 소재\n· 반복 변형 시 복원력이 우수함', apps: '신발 밑창, 핸들 그립, 산업용 튜브.', stats: { visc: '5000', modulus: '58', strength: '8.0', elongation: '287.0', impact: '85.0', hardness: '85.5', color: 'Black', unit: 'A' }, chart: [{x: 0, y: 0}, {x: 100, y: 6}, {x: 287, y: 8.0}] }
    },
    functional: {
        fr: { idx: 0, title: 'Flame Retardant', tag: '난연/내충격', ...colorThemes.darkSlate, features: '· 탁월한 난연 성능 (UL94 V-0급)\n· 외부 충격에 강한 내구성', apps: '배터리 케이스, 전기차 내부 부품.', stats: { visc: '2400', modulus: '1265', strength: '38.7', elongation: '18.4', impact: '22.5', hardness: '79.5', color: 'Gray', unit: 'D' } },
        prof_gray: { idx: 1, title: 'Professional Gray', tag: '고속출력/매트', ...colorThemes.darkSlate, features: '· 빠른 출력 속도와 부드러운 질감\n· 매트한 마감으로 시각적 퀄리티 우수', apps: '디자인 목업, 정밀 인형, 소비재.', stats: { visc: '180', modulus: '1700', strength: '55', elongation: '4', impact: '-', hardness: '82', color: 'Gray', unit: 'D' } },
        pro_htr: { idx: 2, title: 'Pro HTR', tag: '초고내열 (270℃)', ...colorThemes.yellow, features: '· 높은 경도와 인장강도\n· 270°C 이상의 초고내열 온도 구현\n· 고온 공정용 고강성 지그 제작용', apps: '산업용 내열 지그, 몰딩, 엔진룸 테스트.', stats: { visc: '1622', modulus: '3200', strength: '56', elongation: '1', impact: '16.0', hardness: '90', color: 'Yellow/Gray', unit: 'D' } },
        micro150: { idx: 3, title: 'Micro 150', tag: '정밀/투명', ...colorThemes.sky, features: '· 마이크로 채널 구현 가능한 고투명 소재\n· 정밀한 디테일 표현력', apps: '마이크로 유체 칩(Lab-on-a-chip).', stats: { visc: '250', modulus: '1800', strength: '40', elongation: '10', impact: '-', hardness: '83', color: 'Clear', unit: 'D' } }
    },
    general: {
        cmyk: { idx: 0, title: '무독성 CMYK', tag: '친환경/저점도', ...colorThemes.teal, features: '· 피부 비자극, 무독성 친환경 소재\n· 6가지 색상 배합 및 자유로운 조색 가능', apps: '교육용 실습, 피규어, 장난감.', stats: { visc: '350', modulus: '2300', strength: '50', elongation: '4', impact: '17.0', hardness: '84', color: 'C/M/Y/K/W/CL', unit: 'D' } },
        std_black: { idx: 1, title: 'Standard Black', tag: '표준형/단단함', ...colorThemes.darkSlate, features: '· 에폭시 기반의 견고한 물성\n· 매끄러운 표면과 빠른 출력 속도', apps: '범용 목업, 디자인 확인용 샘플.', stats: { visc: '120', modulus: '2700', strength: '84', elongation: '4', impact: '18.0', hardness: '87', color: 'Black', unit: 'D' } },
        fig_gray: { idx: 2, title: 'Figure Gray', tag: '고정밀/피규어', ...colorThemes.darkSlate, features: '· 높은 표면조도와 서포트 제거 용이성\n· 초보자도 쉽게 정밀 출력 가능', apps: '피규어 마스터 모델, 수집품.', stats: { visc: '240', modulus: '2200', strength: '79', elongation: '5', impact: '-', hardness: '85', color: 'Gray', unit: 'D' } },
        fig_beige: { idx: 3, title: 'Figure Beige', tag: '고정밀/고강성', ...colorThemes.orange, features: '· 밝은 베이지 색상으로 디테일 확인 용이\n· 고강성 정밀 부품 출력용', apps: '치과 모델, 정밀 주조 마스터.', stats: { visc: '360', modulus: '3000', strength: '64', elongation: '5', impact: '-', hardness: '85', color: 'Beige', unit: 'D' } },
        matt_white: { idx: 4, title: 'Matt White', tag: '무광/고급질감', ...colorThemes.pureWhite, features: '· 변색 없는 흰색 무광택 질감\n· 고속 출력과 시각적 만족도 동시 제공', apps: '인테리어 소품, 고급형 소비재 시제품.', stats: { visc: '312', modulus: '1200', strength: '53', elongation: '6', impact: '22.0', hardness: '83', color: 'White', unit: 'D' } }
    }
};
