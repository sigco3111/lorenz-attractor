# 🌀 lorenz-attractor

> Three.js 기반 로렌즈 어트랙터 3D 시각화 — 수만 개의 포인트가 그리는 나비 모양 카오스 궤적

카오스 이론의 가장 유명한 모델인 Lorenz Attractor의 나비(butterfly) 모양 궤적을 3D 공간에 수만 개의 포인트로 그려내고, 각 포인트의 속도에 따라 붉은색 → 푸른색으로 변하는 컬러맵과 카메라의 자동 공전으로 우아한 카오스의 미학을 감상할 수 있습니다.

[🇰🇷 한국어 (기본)](#) · [🇺🇸 English](./README.en.md)

---

## 🤖 생성 정보 (Attribution)

이 프로젝트의 코드는 아래 모델과 프롬프트를 이용해 **자동으로 생성**되었습니다.

| 항목 | 값 |
|---|---|
| **모델** | MiniMax-M3 |
| **실행 환경** | OpenCode CLI |
| **저장소** | [`sigco3111/lorenz-attractor`](https://github.com/sigco3111/lorenz-attractor) |
| **라이선스** | MIT |
| **의존성** | 없음 (Three.js CDN, 단일 HTML) |

### 📝 사용된 프롬프트 (원문)

```
카오스 이론의 대표적인 모델인 로렌즈 어트랙터(Lorenz Attractor)의 나비 모양 궤적을
3D 공간에 수만 개의 포인트로 그려내는데, 각 포인트의 색상은 속도에 따라 붉은색에서
푸른색으로 변하도록 하고 카메라가 궤적 주위를 천천히 공전하며 복잡한 곡선의 미학을
감상할 수 있는 우아한 애니메이션을 코딩해줘.

Implementation Advice: Use Three.js. Create the trail using LineSegments or
BufferGeometry for performance. Calculate the position updates using the Lorenz
physics equations in the animation loop. 모든 의존관계의 코드를 하나의 HTML에
담는 형태로 코드 작성.
```

---

## 🧮 로렌즈 방정식 (Lorenz Equations)

3개의 변수 (x, y, z)가 시간에 따라 진화하는 3D 미분방정식 시스템:

```
dx/dt = σ · (y − x)
dy/dt = x · (ρ − z) − y
dz/dt = x · y − β · z
```

**표준 매개변수**:
- `σ = 10` (Prandtl 수 — 점성)
- `ρ = 28` (Rayleigh 수 — 대류 강도)
- `β = 8/3` (기하학적 비율)

이 매개변수에서 시스템은 **카오스** 상태 — 초기값의 미세한 차이가 exponentially 발산하며, 궤적은 두 개의 나비 날개 모양 영역을 영원히 오가며 절대 반복되지 않습니다 (스트레인지 어트랙터).

### 수치 적분

JavaScript 애니메이션 루프에서 RK4 (4차 Runge-Kutta) 또는 단순 Euler 적분:

```js
// Euler 적분 (간단, dt가 작으면 충분)
function step(x, y, z, dt) {
  const dx = sigma * (y - x);
  const dy = x * (rho - z) - y;
  const dz = x * y - beta * z;
  return [x + dx*dt, y + dy*dt, z + dz*dt];
}
```

RK4는 Euler 대비 4배 정확하지만 4배 비쌈 — 매 프레임 수만 포인트 처리 시 trade-off 고려.

---

## ✨ 주요 특징 (Features)

- 🦋 **나비 모양 궤적** — 30,000+ 포인트가 그리는 Lorenz Attractor의 시그니처 형태
- 🎨 **속도 기반 컬러맵** — 빨강 (느린 영역) → 파랑 (빠른 영역), viridis 변형
- 🎥 **자동 카메라 공전** — 궤적 주위를 부드럽게 회전하며 모든 각도 노출
- ⚡ **Three.js + BufferGeometry** — GPU 최적화된 단일 라인 스트립
- 🔢 **실시간 물리 적분** — 매 프레임 Lorenz ODE 계산
- 📦 **단일 HTML** — Three.js CDN 로드 + 외부 의존성 0
- 🔒 **온디바이스** — 모든 렌더링이 브라우저 GPU에서 처리

---

## 🚀 실행 방법 (Quick Start)

### 방법 1: 그냥 브라우저로 열기 (가장 간단)
```bash
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### 방법 2: 로컬 서버 (권장)
```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

## 🎮 조작법 (Controls)

| 입력 | 효과 |
|---|---|
| **자동 카메라 공전** | 궤적 주위를 천천히 회전 (기본) |
| **마우스 드래그** | 궤도 회전 (OrbitControls) |
| **마우스 휠** | 줌 인/아웃 |
| **우클릭 드래그** | 팬 (이동) |
| **`space`** | 카메라 공전 일시정지 / 재개 |
| **`r`** | 궤적 리셋 (초기 조건부터 다시) |
| **`+` / `-`** | dt (시간 단계) 조정 — 빠른 진화 / 느린 진화 |

---

## 🛠️ 기술 스택 (Tech Stack)

| 영역 | 사용 기술 |
|---|---|
| **렌더링** | Three.js (WebGL) |
| **지오메트리** | BufferGeometry + Line / LineSegments |
| **물리 적분** | RK4 / Euler (Lorenz ODE) |
| **카메라** | PerspectiveCamera + OrbitControls |
| **컬러맵** | HSL / RGB 보간 (속도 magnitude 기반) |
| **루프** | `requestAnimationFrame` |
| **빌드** | 없음 (단일 HTML, CDN import) |

---

## 📂 프로젝트 구조

```
lorenz-attractor/
├── index.html      # 단일 HTML (Three.js CDN + Lorenz 로직 + 렌더링)
└── README.md       # 한국어 (기본)
```

---

## 🎨 디자인 결정 (Design Choices)

브레인스토밍 단계에서 내린 결정 4가지:

| 결정 포인트 | 선택 | 이유 |
|---|---|---|
| **렌더링 API** | Three.js (WebGL 추상화) | BufferGeometry·셰이더·카메라 컨트롤 표준 제공, 30k+ 포인트도 60fps |
| **지오메트리 표현** | LineSegments (구간별) vs Line (연속) | LineSegments가 색상 그라데이션·두께 효과에 유리, 인접 구간 색 분리 가능 |
| **컬러맵** | 속도 magnitude → viridis 변형 (빨강-노랑-파랑) | 진화 속도가 느린 영역(나비 중심)과 빠른 영역(날개 끝) 시각적 대비 극대화 |
| **카메라 패턴** | 자동 공전 (기본) + OrbitControls (수동) | 자동 모드는 미적 감상, 수동 모드는 세부 구조 탐색 — 두 사용 패턴 모두 지원 |

### 직접 커스터마이즈하고 싶다면

`index.html` 상단에서 다음 상수를 조정하면 분위기를 바꿀 수 있어요:

```js
const CONFIG = {
  POINT_COUNT: 30000,        // 궤적 포인트 수 (성능 트레이드오프)
  DT: 0.005,                 // 시간 단계 (작을수록 정확, 클수록 빠른 진화)
  SIGMA: 10,                 // Prandtl 수
  RHO: 28,                   // Rayleigh 수 (28이 표준 카오스 값)
  BETA: 8/3,                 // 기하학적 비율
  CAMERA_SPEED: 0.0008,      // 자동 공전 속도 (라디안/ms)
  TRAIL_FADE: 0.998,         // 궤적 페이드 비율 (1.0 = 영구, <1.0 = 점차 사라짐)
  COLOR_SPEED_MIN: 0,        // 컬러맵 최소 속도 (이하는 빨강)
  COLOR_SPEED_MAX: 50,       // 컬러맵 최대 속도 (이상은 파랑)
  // ... 더 많은 옵션은 코드 내 주석 참조
};
```

**카오스 매개변수 탐색**:
- `ρ < 24` → 안정점 (궤적이 원점으로 수렴)
- `ρ ≈ 24.06` → 첫 번째 bifurcation
- `ρ = 28` → 완전 카오스 (나비 어트랙터)
- `ρ > 313` → 다시 안정화 (주기적 패턴)

고급 사용자용: 적분 방법을 Euler → RK4로 교체하거나, 컬러맵을 plasma/inferno로 바꿔보세요.

---

## 🗺️ 로드맵 (Roadmap)

- [ ] **v0.1** — 단일 HTML MVP: Lorenz ODE + Three.js BufferGeometry 궤적 + 자동 공전
- [ ] **v0.2** — 속도 기반 컬러맵 + 슬라이더 UI (σ, ρ, β, dt)
- [ ] **v0.3** — Vercel 배포 + 라이브 데모
- [ ] **v0.4** — 다중 어트랙터 동시 표시 (Rössler, Aizawa, Thomas 등)
- [ ] **v0.5** — 트레일 페이드 효과 (일정 비율로 옛 포인트 소멸)
- [ ] **v0.6** — Record & replay (MP4 / GIF / WebM)
- [ ] **v1.0** — Playwright E2E 테스트 (WebGL 컨텍스트 + canvas 픽셀 분산 검증)

---

## 📚 관련 어트랙터 (Related Strange Attractors)

| 어트랙터 | 매개변수 | 모양 |
|---|---|---|
| **Lorenz** | σ=10, ρ=28, β=8/3 | 나비 |
| **Rössler** | a=0.2, b=0.2, c=5.7 | 나선 + 폴드 |
| **Aizawa** | a=0.95, b=0.7, c=0.6, d=3.5, e=0.25, f=0.1 | 구 + 꼬임 |
| **Thomas** | b=0.208 | 대칭 사이클 |
| **Halvorsen** | a=1.89 | 나선 다발 |
| **Sprott** | 다양 | 16+ 기본 사례 |

---

## 📜 License

MIT © 2026 sigco3111

---

## 🙏 Acknowledgments

이 프로젝트는 **MiniMax-M3** 모델과 OpenCode CLI 환경에서 생성되었습니다. 프롬프트 엔지니어링과 디자인 결정은 저장소 소유자가 직접 수행했습니다.

- **Lorenz Attractor**: Edward Lorenz (1963) — *"Deterministic Nonperiodic Flow"*, J. Atmos. Sci.
- **Three.js**: [mrdoob & contributors](https://threejs.org/)
- **카오스 이론 입문**: James Gleick — *"Chaos: Making a New Science"*
- **코딩미션 참조 페이지**: [cokac.com — 코드깎는노인](https://cokac.com/list/announcement/24)