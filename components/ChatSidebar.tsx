'use client'

interface ChatSidebarProps {
  queryHistory: string[]
  onSelectQuery: (query: string) => void
}

export default function ChatSidebar({ queryHistory, onSelectQuery }: ChatSidebarProps) {
  if (queryHistory.length === 0) {
    return (
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Queries</h3>
        <p className="text-sm text-gray-500">No queries yet</p>
      </div>
    )
  }

  return (
    <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Recent Queries</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {queryHistory.map((query, index) => (
          <button
            key={index}
            onClick={() => onSelectQuery(query)}
            className="w-full text-left px-3 py-2 mb-2 rounded-lg text-sm text-gray-700 hover:bg-white transition-colors border border-transparent hover:border-gray-200"
          >
            <p className="truncate">{query}</p>
          </button>
        ))}
      </div>
    </div>
  )
}




