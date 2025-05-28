export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse mr-4"></div>
            <div>
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Loading */}
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="w-48 h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                  <div className="w-full h-10 bg-gray-200 rounded"></div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Loading */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow animate-pulse">
              <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-32 h-4 bg-gray-200 rounded"></div>
                  <div className="w-8 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <div className="w-28 h-6 bg-gray-200 rounded"></div>
                    <div className="w-20 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="w-full h-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
