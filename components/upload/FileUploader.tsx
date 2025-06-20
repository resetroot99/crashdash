'use client'

import { useState, useCallback } from 'react'
import { Upload, File, AlertCircle } from 'lucide-react'

interface FileUploaderProps {
  onFileUpload: (file: File, content: string) => void
  acceptedTypes?: string[]
}

export default function FileUploader({ 
  onFileUpload, 
  acceptedTypes = ['.xml', '.csv'] 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const content = await file.text()
      onFileUpload(file, content)
    } catch (err) {
      setError('Failed to read file content')
    } finally {
      setIsLoading(false)
    }
  }, [onFileUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }, [handleFile])

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300'}
          ${isLoading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        
        <p className="text-lg font-medium mb-2">
          {isLoading ? 'Processing...' : 'Drop your CCC file here'}
        </p>
        
        <p className="text-sm text-gray-600 mb-4">
          Supports XML and CSV exports from CCC
        </p>
        
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        
        <label 
          htmlFor="file-upload" 
          className="btn-primary cursor-pointer inline-block"
        >
          Choose File
        </label>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-md flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-danger-600" />
          <span className="text-danger-700 text-sm">{error}</span>
        </div>
      )}
    </div>
  )
} 