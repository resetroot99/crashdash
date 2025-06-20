export interface JobLineItem {
  id: string
  type: 'parts' | 'labor' | 'sublet' | 'misc'
  description: string
  cost: number
  retail: number
  margin: number
  department?: 'body' | 'paint' | 'glass' | 'adas' | 'mechanical'
}

export interface JobAnalysis {
  totalRevenue: number
  totalCost: number
  netProfit: number
  marginPercent: number
  departmentBreakdown: {
    [key: string]: {
      revenue: number
      cost: number
      profit: number
      margin: number
    }
  }
  healthScore: number // 0-100
  alerts: string[]
}

export interface ParsedJob {
  jobNumber: string
  customerName: string
  vehicleInfo: string
  lineItems: JobLineItem[]
  techHours?: number
  laborRate?: number
}

export interface Job {
  id: string
  userId: string
  jobNumber: string
  customerName: string
  vehicleInfo: string
  rawData: any
  parsedData: ParsedJob
  profitAnalysis: JobAnalysis
  createdAt: string
  updatedAt: string
} 