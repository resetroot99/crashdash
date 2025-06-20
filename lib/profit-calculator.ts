import { ParsedJob, JobAnalysis, JobLineItem } from '../types/job'

export class ProfitCalculator {
  static calculateJobProfit(job: ParsedJob, settings?: {
    targetMargin?: number
    minMargin?: number
  }): JobAnalysis {
    const { targetMargin = 30, minMargin = 15 } = settings || {}
    
    const totalRevenue = job.lineItems.reduce((sum, item) => sum + item.retail, 0)
    const totalCost = job.lineItems.reduce((sum, item) => sum + item.cost, 0)
    const netProfit = totalRevenue - totalCost
    const marginPercent = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0

    const departmentBreakdown = this.calculateDepartmentBreakdown(job.lineItems)
    const healthScore = this.calculateHealthScore(marginPercent, targetMargin, minMargin)
    const alerts = this.generateAlerts(marginPercent, departmentBreakdown, minMargin)

    return {
      totalRevenue,
      totalCost,
      netProfit,
      marginPercent,
      departmentBreakdown,
      healthScore,
      alerts,
    }
  }

  private static calculateDepartmentBreakdown(lineItems: JobLineItem[]) {
    const breakdown: { [key: string]: any } = {}
    
    lineItems.forEach(item => {
      const dept = item.department || 'misc'
      if (!breakdown[dept]) {
        breakdown[dept] = { revenue: 0, cost: 0, profit: 0, margin: 0 }
      }
      
      breakdown[dept].revenue += item.retail
      breakdown[dept].cost += item.cost
      breakdown[dept].profit += (item.retail - item.cost)
    })

    // Calculate margins
    Object.keys(breakdown).forEach(dept => {
      const data = breakdown[dept]
      data.margin = data.revenue > 0 ? (data.profit / data.revenue) * 100 : 0
    })

    return breakdown
  }

  private static calculateHealthScore(margin: number, target: number, min: number): number {
    if (margin >= target) return 100
    if (margin <= min) return 0
    return Math.round(((margin - min) / (target - min)) * 100)
  }

  private static generateAlerts(
    margin: number, 
    breakdown: any, 
    minMargin: number
  ): string[] {
    const alerts: string[] = []
    
    if (margin < minMargin) {
      alerts.push(`Job margin ${margin.toFixed(1)}% is below minimum ${minMargin}%`)
    }

    Object.entries(breakdown).forEach(([dept, data]: [string, any]) => {
      if (data.margin < minMargin) {
        alerts.push(`${dept} department margin ${data.margin.toFixed(1)}% is below minimum`)
      }
    })

    return alerts
  }
} 