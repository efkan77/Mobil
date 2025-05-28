export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mr-4"></div>
              <div>
                <div className="w-64 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-80 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section Loading */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="p-6 border-b">
                  <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="w-64 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="w-full h-10 bg-gray-200 rounded"></div>
                  <div className="w-full h-20 bg-gray-200 rounded"></div>
                  <div className="w-full h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>

          {/* List Section Loading */}
          <div>
            <div className="bg-white rounded-lg shadow animate-pulse">
              <div className="p-6 border-b">
                <div className="w-48 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-64 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="w-32 h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="w-24 h-3 bg-gray-200 rounded mb-2"></div>
                          <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="w-48 h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                          <div className="w-8 h-8 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
