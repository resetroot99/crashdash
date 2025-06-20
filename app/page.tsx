'use client'

import { useState, useEffect } from 'react'
import FileUploader from '../components/upload/FileUploader'
import JobCard from '../components/dashboard/JobCard'
import AuthButton from '../components/auth/AuthButton'
import { CCCParser } from '../lib/parsers/ccc-parser'
import { ProfitCalculator } from '../lib/profit-calculator'
import { createClient } from '../lib/supabase/client'
import { Job } from '../types/job'
import { BarChart3, Upload as UploadIcon } from 'lucide-react'

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      // Load existing jobs for the user
      if (user) {
        const { data: existingJobs } = await supabase
          .from('jobs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
        
        if (existingJobs) {
          setJobs(existingJobs as Job[])
        }
      }
    }
    
    getUser()
  }, [supabase])

  const handleFileUpload = async (file: File, content: string) => {
    setIsProcessing(true)
    setError(null)
    
    try {
      // Parse the file based on extension
      let parsedJob
      if (file.name.endsWith('.xml')) {
        parsedJob = await CCCParser.parseXML(content)
      } else if (file.name.endsWith('.csv')) {
        parsedJob = await CCCParser.parseCSV(content)
      } else {
        throw new Error('Unsupported file type')
      }

      // Calculate profit analysis
      const profitAnalysis = ProfitCalculator.calculateJobProfit(parsedJob)

      // Save to Supabase if user is authenticated
      if (user) {
        const { data, error: saveError } = await supabase
          .from('jobs')
          .insert({
            user_id: user.id,
            job_number: parsedJob.jobNumber,
            customer_name: parsedJob.customerName,
            vehicle_info: parsedJob.vehicleInfo,
            raw_data: content,
            parsed_data: parsedJob,
            profit_analysis: profitAnalysis,
          })
          .select()
          .single()

        if (saveError) {
          throw new Error(`Failed to save job: ${saveError.message}`)
        }

        if (data) {
          setJobs(prev => [data as Job, ...prev])
        }
      } else {
        // For demo purposes when not authenticated
        const job: Job = {
          id: Date.now().toString(),
          userId: 'demo-user',
          jobNumber: parsedJob.jobNumber,
          customerName: parsedJob.customerName,
          vehicleInfo: parsedJob.vehicleInfo,
          rawData: content,
          parsedData: parsedJob,
          profitAnalysis,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setJobs(prev => [job, ...prev])
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file')
    } finally {
      setIsProcessing(false)
    }
  }

  const totalRevenue = jobs.reduce((sum, job) => sum + job.profitAnalysis.totalRevenue, 0)
  const totalProfit = jobs.reduce((sum, job) => sum + job.profitAnalysis.netProfit, 0)
  const avgMargin = jobs.length > 0 ? totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                CrashDash
              </h1>
              <p className="text-gray-600">
                Upload CCC estimates to analyze job profitability and margins
              </p>
            </div>
            <AuthButton />
          </div>
        </header>

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <FileUploader onFileUpload={handleFileUpload} />
            {isProcessing && (
              <div className="mt-6 text-primary-600">
                Processing file and calculating profit margins...
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-md text-danger-700">
                {error}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Total Jobs</p>
                    <p className="text-2xl font-bold">{jobs.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-success-600">
                  ${totalRevenue.toLocaleString()}
                </p>
              </div>
              
              <div className="card">
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className={`text-2xl font-bold ${
                  totalProfit >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  ${totalProfit.toLocaleString()}
                </p>
              </div>
              
              <div className="card">
                <p className="text-sm text-gray-500">Avg Margin</p>
                <p className={`text-2xl font-bold ${
                  avgMargin >= 25 ? 'text-success-600' : 
                  avgMargin >= 15 ? 'text-warning-600' : 
                  'text-danger-600'
                }`}>
                  {avgMargin.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Upload Another */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Recent Jobs</h2>
              <button 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="btn-primary flex items-center gap-2"
              >
                <UploadIcon className="w-4 h-4" />
                Upload Another Job
              </button>
              <input
                type="file"
                accept=".xml,.csv"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    file.text().then(content => handleFileUpload(file, content))
                  }
                }}
                className="hidden"
                id="file-upload"
              />
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
} 