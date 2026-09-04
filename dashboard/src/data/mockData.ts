export const kpis = {
  index: 117.4,
  momChange: 6.8,
  yoyChange: 9.2,
  observations: '1.24M',
  coverage: 98.6,
  lastUpdated: '04 Sep 2026 · 18:00 IST',
}

export const trendData = [
  { month: 'Jan', index: 100 },
  { month: 'Feb', index: 101 },
  { month: 'Mar', index: 103 },
  { month: 'Apr', index: 106 },
  { month: 'May', index: 110 },
  { month: 'Jun', index: 113 },
  { month: 'Jul', index: 116 },
  { month: 'Aug', index: 120 },
  { month: 'Sep', index: 117.4 },
]

export const routeHeatmap = [
  { route: 'DEL-BOM', index: 118.0, change: 12.1, severity: 'high' as const },
  { route: 'BOM-BLR', index: 121.2, change: 15.3, severity: 'high' as const },
  { route: 'DEL-BLR', index: 113.0, change: 8.4, severity: 'medium' as const },
  { route: 'BLR-HYD', index: 104.0, change: 3.1, severity: 'low' as const },
  { route: 'DEL-CCU', index: 96.0, change: -2.2, severity: 'positive' as const },
  { route: 'MAA-DEL', index: 111.0, change: 7.8, severity: 'medium' as const },
]

export const contributors = [
  { route: 'DEL-BOM', value: 2.1 },
  { route: 'BOM-BLR', value: 1.7 },
  { route: 'DEL-BLR', value: 1.2 },
  { route: 'MAA-DEL', value: 0.8 },
  { route: 'Other', value: 1.0 },
]

export const leadTimeData = [
  { window: 'T+1', fare: 12000 },
  { window: 'T+7', fare: 8000 },
  { window: 'T+15', fare: 6000 },
  { window: 'T+30', fare: 4500 },
  { window: 'T+45', fare: 4200 },
]

export const airlineData = [
  { airline: 'IndiGo', fare: 5420, change: 8.2 },
  { airline: 'Air India', fare: 6120, change: 5.4 },
  { airline: 'Akasa', fare: 4910, change: 12.1 },
  { airline: 'SpiceJet', fare: 4680, change: -2.1 },
  { airline: 'AI Express', fare: 4850, change: 6.7 },
]

export const fareComposition = [
  { name: 'Base Fare', value: 4000, percent: 81.3 },
  { name: 'Taxes', value: 700, percent: 14.2 },
  { name: 'Airport', value: 120, percent: 2.4 },
  { name: 'Convenience', value: 100, percent: 2.1 },
]

export const fareDistribution = [
  { label: 'P10', value: 4100, width: 20 },
  { label: 'P25', value: 4700, width: 30 },
  { label: 'Median', value: 5600, width: 45 },
  { label: 'P75', value: 7200, width: 60 },
  { label: 'P90', value: 9800, width: 82 },
]

export const volatility = [
  { route: 'DEL-BOM', level: 'HIGH' as const },
  { route: 'BOM-BLR', level: 'HIGH' as const },
  { route: 'DEL-BLR', level: 'MEDIUM' as const },
  { route: 'BLR-HYD', level: 'LOW' as const },
]

export const dgcaData = [
  { month: 'Jan', apix: 100, dgca: 100 },
  { month: 'Feb', apix: 103, dgca: 102 },
  { month: 'Mar', apix: 107, dgca: 106 },
  { month: 'Apr', apix: 111, dgca: 110 },
  { month: 'May', apix: 115, dgca: 114 },
  { month: 'Jun', apix: 118, dgca: 117 },
]

export const dataQuality = [
  { label: 'Quality Score', value: '96.8%', highlight: true },
  { label: 'Valid Observations', value: '1.24M', highlight: false },
  { label: 'Missing', value: '1.5%', highlight: false },
  { label: 'Duplicates', value: '0.8%', highlight: false },
  { label: 'Outliers', value: '0.7%', highlight: false },
  { label: 'Sold Out', value: '0.5%', highlight: false },
  { label: 'Scraping Success', value: '98.6%', highlight: true },
]

export const sourceHealth = [
  { source: 'IndiGo', success: 99.2, status: 'healthy' as const },
  { source: 'Air India', success: 97.8, status: 'healthy' as const },
  { source: 'Akasa', success: 98.4, status: 'healthy' as const },
  { source: 'SpiceJet', success: 95.7, status: 'warning' as const },
  { source: 'OTA Sources', success: 96.3, status: 'healthy' as const },
]

export const alerts = [
  { severity: 'high' as const, route: 'DEL → MAA', message: 'Fare increased 42% in 24h', note: 'Possible demand shock' },
  { severity: 'medium' as const, route: 'BOM → BLR', message: 'Fare increased 27%', note: 'Availability decline' },
  { severity: 'info' as const, route: 'DEL → BOM', message: 'T+1 premium reached 51%', note: 'Short-notice pricing' },
]

export const explorerData = [
  { timestamp: '18:00:21', route: 'DEL-BOM', airline: 'IndiGo', leadTime: 'T+7', base: 4200, tax: 720, total: 4920, source: 'Airline' },
  { timestamp: '17:58:42', route: 'DEL-BOM', airline: 'Air India', leadTime: 'T+7', base: 4500, tax: 740, total: 5240, source: 'Airline' },
  { timestamp: '17:55:17', route: 'DEL-BOM', airline: 'Akasa', leadTime: 'T+7', base: 4050, tax: 710, total: 4760, source: 'OTA' },
]

export const chartColors = {
  blue: '#5b9fd4',
  green: '#c6f54a',
  red: '#ff5a4a',
  orange: '#f05a1a',
  yellow: '#f5d547',
  purple: '#9a6dd7',
  gray: '#6b6b6b',
  pie: ['#f05a1a', '#f5d547', '#f4f4f0', '#5b9fd4'],
}

export const healthScore = 97

export const riskScore = {
  value: 72,
  max: 100,
  note: 'Index eased 2.6 pts from the August peak',
}

export const breakdownCards = [
  { label: 'MoM', value: `+${kpis.momChange}%`, accent: '#c6f54a' },
  { label: 'YoY', value: `+${kpis.yoyChange}%`, accent: '#f05a1a' },
  { label: 'Observations', value: kpis.observations, accent: '#ff5a4a' },
  { label: 'Coverage', value: `${kpis.coverage}%`, accent: '#5b9fd4' },
]

export const routeWatchlist = [
  {
    code: 'DEL-BOM',
    name: 'Delhi → Mumbai',
    index: 118.0,
    change: 12.1,
    spark: [108, 110, 109, 114, 116, 119, 118],
  },
  {
    code: 'BOM-BLR',
    name: 'Mumbai → Bengaluru',
    index: 121.2,
    change: 15.3,
    spark: [105, 108, 112, 111, 118, 122, 121],
  },
  {
    code: 'DEL-BLR',
    name: 'Delhi → Bengaluru',
    index: 113.0,
    change: 8.4,
    spark: [104, 106, 105, 108, 110, 112, 113],
  },
  {
    code: 'DEL-CCU',
    name: 'Delhi → Kolkata',
    index: 96.0,
    change: -2.2,
    spark: [102, 101, 100, 99, 97, 96, 96],
  },
]

export const allocationBars = [
  { label: 'DEL-BLR', pct: 45, color: '#f05a1a' },
  { label: 'BOM-BLR', pct: 85, color: '#f5d547' },
  { label: 'MAA-DEL', pct: 48, color: '#f4f4f0' },
  { label: 'DEL-CCU', pct: 8, color: '#3a3a3a' },
]

export const insights = {
  body: 'Trunk fares on DEL–BOM rose 12.1% MoM while APIx eased to 117.4 from the August peak of 120. DGCA backtesting tracks the official series within 1 index point through June 2026.',
  sources: [
    { id: 'NSO', label: 'NSO' },
    { id: 'RBI', label: 'RBI' },
    { id: 'DG', label: 'DGCA' },
    { id: 'MO', label: 'MoCA' },
    { id: 'FT', label: 'IndiGo' },
  ],
}
