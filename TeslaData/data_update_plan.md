# US/CA 地区切换与单位换算功能 — 评审报告 & 实施蓝图

> 文档状态：已评审，待实施
> 撰写日期：2026-02-24
> 对应数据源：`TeslaData/Model 3.md`、`TeslaData/Model Y.md`

---

## 一、评审结论

**强烈建议实施，但必须理解：这不是简单的单位换算问题。**

加拿大市场与美国市场的差异已超出「乘以 1.609」的数学换算范畴——两套数据体系在车型命名、测试标准、规格数值三个层面均存在实质差异。若仅做简单换算，将产生误导性数据，损害产品可信度。

---

## 二、两市场数据差异明细

### 2.1 Model 3 Gen2 (Highland) 差异对比

| 差异维度 | 美国官网 (US) | 加拿大官网 (CA) |
|---------|-------------|---------------|
| 续航单位 | EPA est. (mi) | EPA est. (km) |
| 加速测试标准 | 0-60 mph | 0-100 km/h（数值不同，**非同一测试**） |
| 中阶 RWD 命名 | Model 3 Premium RWD | Long Range RWD |
| 中阶 AWD 命名 | Model 3 Premium AWD | Long Range AWD |
| Performance 峰值马力 | 510 hp（北美发布口径） | **460 hp**（CA 官网明确标注） |

#### Model 3 Gen2 具体数值对比

| 车型 | US 续航 (mi) | CA 续航 (km) | US 0-60 (s) | CA 0-100 (s) |
|-----|------------|------------|------------|-------------|
| RWD（基础款） | 321 mi | — | 5.8 s | — |
| Premium/LR RWD | 363 mi | 584 km | 4.9 s | 5.2 s |
| Premium/LR AWD | 346 mi | 550 km | 4.2 s | — |
| Performance | 309 mi | 478 km | 2.9 s | 3.1 s |

> ⚠️ 注意：584 km ≈ 363 mi × 1.609 = 584.1，换算值与官网吻合；但 0-100 km/h 5.2 s ≠ 0-60 mph 4.9 s × 换算，两者为不同测试标准。

---

### 2.2 Model Y Gen2 (Juniper) 差异对比

**这是两市场差异最大的车型，不只是数值不同，连车型数量都不同。**

#### 美国官网：5 款

| 美国命名 | 驱动 | EPA 续航 (mi) | 0-60 mph | 超充功率 |
|---------|-----|------------|---------|--------|
| Model Y RWD | 后驱 | 321 mi | 6.8 s | 225 kW |
| Model Y AWD | 四驱 | 294 mi | 4.6 s | 225 kW |
| Model Y Premium RWD | 后驱 | 357 mi | 5.4 s | 250 kW |
| Model Y Premium AWD | 四驱 | 327 mi | 4.6 s | 250 kW |
| Model Y Performance | 四驱 | 306 mi | 3.3 s | 250 kW |

#### 加拿大官网：3 款

| 加拿大命名 | 驱动 | EPA 续航 (km) | 0-100 km/h | 超充功率 |
|---------|-----|------------|-----------|--------|
| Model Y Rear-Wheel Drive | 后驱 | 463 km | 7.2 s | **175 kW** |
| Model Y Premium AWD | 四驱 | 542 km | 5.0 s | 250 kW |
| Model Y Performance | 四驱 | 494 km | 3.7 s | 250 kW |

#### 关键差异汇总

| 差异维度 | 美国 | 加拿大 |
|---------|-----|-------|
| Gen2 车型数量 | **5 款** | **3 款** |
| 无对应款型 | RWD（基础款）、AWD（基础款）| — |
| RWD 超充功率 | 225 kW | **175 kW**（官网明确） |
| 加速标准 | 0-60 mph | 0-100 km/h |
| RWD 0-xx | 6.8 s (0-60) | 7.2 s (0-100)，非换算关系 |

---

### 2.3 为什么不能简单换算

| 指标 | 换算可行性 | 说明 |
|-----|---------|------|
| 续航 mi → km | ✅ 可换算（× 1.609） | 误差通常 < 1 km，官网值与换算值基本吻合 |
| 0-60 mph → 0-100 km/h | ❌ **不可换算** | 0-100 km/h 含 60-100 mph 段，阻力、电机特性不同，两者为独立测试 |
| 车型列表 | ❌ 无法换算 | CA 市场根本没有 US 的部分车型（如 Y AWD 基础款） |
| 车型名称 | ❌ 无法映射 | Premium RWD (US) ≠ Long Range RWD (CA)，仅为商业命名差异 |
| 马力 | ❌ **不可换算** | Performance 510 hp (US) vs 460 hp (CA)，官网标注值本身不同 |
| 充电功率 | ❌ **不可换算** | Y RWD 225 kW (US) vs 175 kW (CA)，规格本身不同 |

---

## 三、当前代码现状（评审快照）

### 3.1 数据库 Schema（`src/db/schema.ts`）

```
rangeEPA: integer('range_epa')          // 单位：miles（隐式）
acceleration060: numeric('acceleration_060')  // 0-60 mph（隐式）
topSpeed: integer('top_speed')          // 单位：mph（隐式）
curbWeight: integer('curb_weight')      // 单位：lbs（隐式）
basePriceMSRP: integer('base_price_msrp')  // 单位：USD cents（隐式）
```

**问题**：字段无单位标注，无区域区分，全部隐式为 US 标准。

### 3.2 COMPARISON_SPEC_CONFIG（`src/lib/vehicle-utils.ts`）

```
{ key: 'acceleration060', label: '0–60 mph', unit: 's' }   // 硬编码 mph
{ key: 'topSpeed',        label: 'Top Speed', unit: 'mph' } // 硬编码 mph
{ key: 'rangeEPA',        label: 'EPA Range', unit: 'mi' }  // 硬编码 mi
{ key: 'curbWeight',      label: 'Curb Weight', unit: 'lbs' } // 硬编码 lbs
{ key: 'length',          label: 'Length', unit: 'in' }     // 硬编码 in
{ key: 'basePriceMSRP',   label: 'Base MSRP', unit: '$' }  // 硬编码 USD
{ key: 'energyConsumption', unit: 'Wh/mi' }                 // 硬编码 mi
```

**问题**：单位字符串全部硬编码，无地区/语言感知逻辑。

### 3.3 其他现状
- 无任何 `RegionContext` 或地区偏好 state
- i18n（next-intl）仅处理语言翻译，不含单位/地区切换
- 无 `unit-utils.ts` 换算工具函数
- localStorage 中无地区偏好存储

---

## 四、分阶段实施计划

### 阶段一：数据层扩展（优先级：高）

**目标**：让数据库能同时存储 US 和 CA 两套数据

#### 方案 A（推荐）：在 vehicle 表新增 CA 覆盖字段

```typescript
// src/db/schema.ts — 新增字段
caRangeEPAkm: integer('ca_range_epa_km'),       // CA: EPA km（非换算，官网值）
caAcceleration0100: numeric('ca_acceleration_0100'), // CA: 0-100 km/h（非换算）
caTopSpeedKmh: integer('ca_top_speed_kmh'),      // CA: km/h
caTrimName: text('ca_trim_name'),                // CA: 官网命名（如 Long Range RWD）
caSuperchargerRateMax: integer('ca_supercharger_rate_max'), // CA: kW（部分不同）
caHorsepower: integer('ca_horsepower'),          // CA: hp（如 Performance 460 hp）
caAvailable: boolean('ca_available').default(true), // CA 是否有售（Gen2 Y 只有3款）
caBasePriceMSRP: integer('ca_base_price_msrp'),  // CA: CAD cents
```

**优点**：
- 无需创建新表，join 成本低
- NULL = 与 US 相同（可用换算值填充）
- 明确区分「确实不同」vs「可以换算」

**缺点**：
- 表字段增多（但数量可控）
- 若未来支持更多地区，需继续增加字段

#### 方案 B（备选）：新增 region 字段，允许同一车型多条记录

```typescript
region: text('region').default('US'),  // 'US' | 'CA'
// 配合 unique constraint: (modelId, year, trim, region)
```

**优点**：扩展性好，支持任意多地区
**缺点**：同一车型比较时需 JOIN 或在应用层处理，复杂度更高

**推荐：方案 A**，理由是当前只需支持 US/CA 两个市场，且 CA 差异字段数量有限。

#### 数据填充策略

| 车型类别 | 处理方式 |
|---------|---------|
| Model 3 Gen1 / Gen1 Refresh | CA 数据与 US 差异微小，可通过换算公式生成（`caRangeEPAkm = rangeEPA * 1.609`） |
| Model Y Gen1 | 同上，差异小，换算填充 |
| Model 3 Gen2 (Highland) | **手动填入**：US/CA 命名不同、加速数值独立、马力差异 |
| Model Y Gen2 (Juniper) | **手动填入**：车型数量 5→3，充电功率不同，加速标准独立 |

---

### 阶段二：单位换算工具函数

新建 `src/lib/unit-utils.ts`：

```typescript
// 可换算的指标
export const miToKm = (mi: number) => Math.round(mi * 1.60934)
export const kmhToMph = (kmh: number) => Math.round(kmh * 0.621371)
export const lbsToKg = (lbs: number) => Math.round(lbs * 0.453592)
export const inchesToMm = (inches: number) => Math.round(inches * 25.4)

// 不可换算的指标（需从独立字段取值）
// 0-60 mph vs 0-100 km/h → 分别存储，不做转换

// 货币（建议用固定汇率系数，或配置为常量）
export const USD_TO_CAD_RATE = 1.36 // 需定期更新，或从配置读取
export const usdToCad = (usdCents: number) =>
  Math.round(usdCents * USD_TO_CAD_RATE)
```

---

### 阶段三：RegionContext 状态管理

新建 `src/contexts/RegionContext.tsx`：

```typescript
'use client'

type Region = 'US' | 'CA'

interface RegionContextValue {
  region: Region
  setRegion: (r: Region) => void
}

export const RegionContext = createContext<RegionContextValue>({
  region: 'US',
  setRegion: () => {},
})

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('tesla-region') as Region) ?? 'US'
    }
    return 'US'
  })

  const setRegion = (r: Region) => {
    setRegionState(r)
    localStorage.setItem('tesla-region', r)
  }

  return (
    <RegionContext.Provider value={{ region, setRegion }}>
      {children}
    </RegionContext.Provider>
  )
}

export const useRegion = () => useContext(RegionContext)
```

**接入位置**：在根布局 `src/app/[locale]/layout.tsx` 包裹 `<RegionProvider>`。

---

### 阶段四：RegionToggle UI 组件

新建 `src/components/ui/region-toggle.tsx`：

```typescript
'use client'

import { useRegion } from '@/contexts/RegionContext'

export function RegionToggle() {
  const { region, setRegion } = useRegion()
  return (
    <div className="flex items-center gap-1 rounded-md border p-1 text-sm">
      <button
        onClick={() => setRegion('US')}
        className={region === 'US' ? 'bg-accent rounded px-2 py-0.5 font-medium' : 'px-2 py-0.5 text-muted-foreground'}
      >
        🇺🇸 US
      </button>
      <button
        onClick={() => setRegion('CA')}
        className={region === 'CA' ? 'bg-accent rounded px-2 py-0.5 font-medium' : 'px-2 py-0.5 text-muted-foreground'}
      >
        🇨🇦 CA
      </button>
    </div>
  )
}
```

**放置位置**：Navbar 右侧，语言切换按钮左侧。

---

### 阶段五：COMPARISON_SPEC_CONFIG 动态化

修改 `src/lib/vehicle-utils.ts` 中的 `COMPARISON_SPEC_CONFIG`，支持动态 unit：

```typescript
// 修改前
{ key: 'rangeEPA', label: 'EPA Range', unit: 'mi', ... }

// 修改后
{
  key: 'rangeEPA',
  label: 'EPA Range',
  unit: (region: Region) => region === 'CA' ? 'km' : 'mi',
  caKey: 'caRangeEPAkm',  // CA 时读取此字段
  ...
}
```

或者使用更简洁的 hook 封装：

```typescript
// src/hooks/useSpecConfig.ts
export function useSpecConfig() {
  const { region } = useRegion()
  return COMPARISON_SPEC_CONFIG.map(spec => ({
    ...spec,
    unit: typeof spec.unit === 'function' ? spec.unit(region) : spec.unit,
    resolvedKey: region === 'CA' && spec.caKey ? spec.caKey : spec.key,
  }))
}
```

---

### 阶段六：全站组件更新

涉及组件列表（按优先级排序）：

| 优先级 | 文件 | 需修改内容 |
|------|-----|---------|
| P0 | `src/components/tesla/key-specs-grid.tsx` | 首页/列表页关键规格，用户最先看到 |
| P0 | `src/components/tesla/spec-table.tsx` | 规格对比表，核心功能 |
| P0 | `src/app/[locale]/(marketing)/compare/page.tsx` | 对比页逻辑 |
| P1 | `src/components/tesla/vehicle-card.tsx` | 卡片显示，影响视觉 |
| P2 | 车型详情页 | 涉及多个字段显示 |

**每个组件的修改模式**：

```typescript
// 修改前
<span>{vehicle.rangeEPA} mi</span>

// 修改后
const { region } = useRegion()
const range = region === 'CA' && vehicle.caRangeEPAkm
  ? `${vehicle.caRangeEPAkm} km`
  : `${vehicle.rangeEPA} mi`

<span>{range}</span>
```

---

### 阶段七：CA 模式下的车型过滤

**最重要的逻辑**：CA 模式下，Model Y Gen2 只显示 3 款，而非 5 款。

```typescript
// src/lib/vehicle-utils.ts
export function filterVehiclesByRegion(vehicles: Vehicle[], region: Region) {
  if (region === 'US') return vehicles
  return vehicles.filter(v => v.caAvailable !== false)
}
```

在所有车型列表页面接入此过滤逻辑。

---

## 五、数据迁移 SQL 参考

```sql
-- 阶段一完成后，为 schema 添加 CA 字段后运行
-- 为 Gen1 / Gen1 Refresh 车型自动填充换算值（差异小，可接受）
UPDATE vehicles
SET
  ca_range_epa_km = ROUND(range_epa * 1.60934),
  ca_available = true
WHERE range_epa IS NOT NULL
  AND generation IN ('gen1', 'gen1-refresh');

-- Gen2 车型需手动填充（见 TeslaData/Model 3.md 和 Model Y.md）
-- 特别注意：
-- 1. Model Y Gen2: ca_available = false for 'RWD' and 'AWD' (standard) trims
-- 2. Model 3 Gen2 Performance: ca_horsepower = 460 (非 510)
-- 3. Model Y Gen2 RWD: ca_supercharger_rate_max = 175 (非 225)
```

---

## 六、验证清单（实施后检查点）

### 功能验证

- [ ] 切换到 CA 模式，Model Y Gen2 只显示 3 款（RWD、Premium AWD、Performance）
- [ ] 切换到 CA 模式，续航显示 km（如：584 km，非 363 mi）
- [ ] 切换到 CA 模式，加速显示 0-100 km/h 数值（不是 0-60 mph 简单换算）
- [ ] 切换到 CA 模式，Model 3 Gen2 中阶款显示 Long Range 命名（非 Premium）
- [ ] 切换到 CA 模式，Model 3 Performance 马力显示 460 hp（非 510）
- [ ] 切换到 CA 模式，Model Y RWD 超充功率显示 175 kW（非 225 kW）
- [ ] 刷新页面后，地区偏好保持不变（localStorage 持久化）
- [ ] US 模式功能不受影响（回归测试）

### 数据质量验证

- [ ] 对比页：CA 模式下，只比较 CA 有售车型
- [ ] 规格表：单位标签随地区动态切换（mi ↔ km, mph ↔ km/h）
- [ ] 换算填充的 Gen1 数据：与官方口径对比，误差 < 1%

---

## 七、风险与注意事项

| 风险 | 说明 | 应对 |
|-----|-----|-----|
| CA 官网数据更新 | Tesla 官网规格可能阶段性调整 | 建立数据更新 checklist，每季度核对 |
| 汇率波动 | USD→CAD 系数需定期维护 | 在 config 中配置为常量，便于更新 |
| 车型命名混淆 | US/CA 命名不一致，用户可能困惑 | 在 CA 模式下始终显示 CA 官网命名 |
| SEO 影响 | 地区切换基于 localStorage（客户端），不影响 SSR | 确认 SSR 始终渲染 US 默认值 |
| 加速标准误解 | 用户可能以为 0-100 是 0-60 的换算 | 在规格表头添加 tooltip 说明测试标准 |

---

## 八、实施顺序建议

```
阶段一（数据层）→ 阶段二（工具函数）→ 阶段三（Context）
         ↓（并行）
阶段四（UI Toggle）→ 阶段五（Config 动态化）→ 阶段六（组件更新）→ 阶段七（过滤逻辑）
```

**最小可验证版本（MVP）路径**：
1. 完成阶段一（添加 CA 字段，填入 Gen2 数据）
2. 完成阶段二+三（工具函数 + Context）
3. 完成阶段四（Toggle 按钮）
4. 仅更新 key-specs-grid 一个组件（P0）

MVP 完成后即可验证核心逻辑是否正确，再逐步铺开到其他组件。

---

## 九、数据源参考

- `TeslaData/Model 3.md` — Model 3 北美版完整规格（Gen1/Gen1 Refresh/Gen2 Highland）
- `TeslaData/Model Y.md` — Model Y 北美版完整规格（Gen1/Gen2 Juniper，含 US/CA 分表）
- Tesla 美国官网：tesla.com/model3，tesla.com/modely
- Tesla 加拿大官网：tesla.com/en_CA/model3，tesla.com/en_CA/modely

---

*文档由评审会话生成，作为未来执行阶段的参考蓝图。实施时请先核对 TeslaData 源文件中的最新数据。*
