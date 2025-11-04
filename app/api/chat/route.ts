import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const message = formData.get('message') as string
    const file = formData.get('file') as File | null

    // Here you would typically call your chat API
    // For now, we'll return a mock response
    const response = `Response to: ${message}${file ? ` (File: ${file.name})` : ''}`

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Error processing chat request:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}




