'use client'

import { Job } from '../../types/job'
import { TrendingUp, TrendingDown, AlertTriangle, Car } from 'lucide-react'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const { profitAnalysis } = job
  const isHealthy = profitAnalysis.healthScore >= 70
  const hasAlerts = profitAnalysis.alerts.length > 0

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{job.jobNumber}</h3>
          <p className="text-gray-600">{job.customerName}</p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <Car className="w-4 h-4" />
            {job.vehicleInfo}
          </p>
        </div>
        
        <div className="text-right">
          <div className={`text-2xl font-bold ${
            profitAnalysis.marginPercent >= 25 ? 'text-success-600' : 
            profitAnalysis.marginPercent >= 15 ? 'text-warning-600' : 
            'text-danger-600'
          }`}>
            {profitAnalysis.marginPercent.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-500">Margin</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="font-semibold">${profitAnalysis.totalRevenue.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Cost</p>
          <p className="font-semibold">${profitAnalysis.totalCost.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Profit</p>
          <p className={`font-semibold ${
            profitAnalysis.netProfit >= 0 ? 'text-success-600' : 'text-danger-600'
          }`}>
            ${profitAnalysis.netProfit.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isHealthy ? (
            <TrendingUp className="w-4 h-4 text-success-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-danger-600" />
          )}
          <span className={`text-sm font-medium ${
            isHealthy ? 'text-success-600' : 'text-danger-600'
          }`}>
            Health: {profitAnalysis.healthScore}/100
          </span>
        </div>
        
        {hasAlerts && (
          <div className="flex items-center gap-1 text-warning-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">{profitAnalysis.alerts.length} alerts</span>
          </div>
        )}
      </div>

      {hasAlerts && (
        <div className="mt-3 p-2 bg-warning-50 border border-warning-200 rounded text-sm">
          <ul className="space-y-1">
            {profitAnalysis.alerts.slice(0, 2).map((alert, index) => (
              <li key={index} className="text-warning-700">• {alert}</li>
            ))}
            {profitAnalysis.alerts.length > 2 && (
              <li className="text-warning-600 font-medium">
                +{profitAnalysis.alerts.length - 2} more
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
} 