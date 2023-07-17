import fs from 'fs'

export const storeFileStream = async (stream, filename, destDir, prefix = null, fnSeparator = '_') => {
  let fn = filename
  if (prefix !== null) {
    fn = prefix + fnSeparator + fn
  }

  const path = `${destDir}/${fn}`
  const result = await new Promise((resolve, reject) =>
    stream.on('error', error => {
      if (stream.truncated)
        // delete the truncated file
        fs.unlinkSync(path)
      reject(error)
    })
      .pipe(fs.createWriteStream(path))
      .on('finish', () => resolve({ path }))
  )

  return result.path
}

