// Utility: Convert Base64 to Blob URL
export function base64ToBlobUrl(base64) {
    const arr = base64.split(',')
    const mimeMatch = arr[0].match(/:(.*?);/)
  
    if (!mimeMatch) {
      throw new Error('Invalid base64 string')
    }
  
    const mime = mimeMatch[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
  
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
  
    const blob = new Blob([u8arr], { type: mime })
    return URL.createObjectURL(blob) // Convert Blob to a URL
  }