import { useState } from 'react'
import { TopNav, type NavId } from './components/TopNav'
import { HeroPerformance } from './components/HeroPerformance'
import { RouteWatchlist } from './components/RouteWatchlist'
import { BottomRow } from './components/BottomRow'
import { RouteHeatmap } from './components/RouteHeatmap'
import { ContributorsChart } from './components/ContributorsChart'
import { LeadTimeChart } from './components/LeadTimeChart'
import { AirlineAnalysis } from './components/AirlineAnalysis'
import { FareComposition } from './components/FareComposition'
import { FareDistribution } from './components/FareDistribution'
import { VolatilityFestival } from './components/VolatilityFestival'
import { DGCAValidation } from './components/DGCAValidation'
import { DataQualityPanel } from './components/DataQualityPanel'
import { AlertsPanel } from './components/AlertsPanel'
import { GovAPI } from './components/GovAPI'
import { DataExplorer } from './components/DataExplorer'
import { kpis } from './data/mockData'

export default function App() {
  const [tab, setTab] = useState<NavId>('Dashboard')

  return (
    <div className="min-h-screen bg-notion-bg">
      <TopNav active={tab} onChange={setTab} />

      <main className="mx-auto max-w-[1320px] space-y-4 px-5 pb-16 pt-2 lg:px-8">
        {tab === 'Dashboard' ? (
          <>
            <HeroPerformance />
            <RouteWatchlist />
            <BottomRow />
          </>
        ) : null}

        {tab === 'Routes' ? (
          <>
            <RouteHeatmap />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <ContributorsChart />
              <LeadTimeChart />
            </div>
            <VolatilityFestival />
          </>
        ) : null}

        {tab === 'Airlines' ? (
          <>
            <AirlineAnalysis />
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <FareComposition />
              <FareDistribution />
            </div>
          </>
        ) : null}

        {tab === 'Quality' ? (
          <>
            <DataQualityPanel />
            <DGCAValidation />
            <GovAPI />
            <DataExplorer />
          </>
        ) : null}

        {tab === 'Alerts' ? <AlertsPanel /> : null}

        {tab === 'Settings' ? (
          <section className="rounded-[28px] bg-notion-card p-8 ring-1 ring-white/6">
            <h3 className="text-[16px] font-medium text-white">Workspace</h3>
            <p className="mt-2 text-[13px] text-white/45">SIH-26056 · NSO / RBI Analytics · Domestic airfare monitoring</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-notion-elevated px-4 py-3 ring-1 ring-white/5">
                <p className="text-[12px] text-white/40">Last updated</p>
                <p className="mt-1 text-[15px] font-medium text-white">{kpis.lastUpdated}</p>
              </div>
              <div className="rounded-2xl bg-notion-elevated px-4 py-3 ring-1 ring-white/5">
                <p className="text-[12px] text-white/40">Coverage</p>
                <p className="mt-1 text-[15px] font-medium text-white">{kpis.coverage}%</p>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  )
}
