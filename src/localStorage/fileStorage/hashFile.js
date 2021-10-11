import SparkMD5 from 'spark-md5'

export default function hashFile(file) {
  return new Promise((resolve, reject) => {
    // from https://github.com/satazor/js-spark-md5#hash-a-file-incrementally
    const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    const chunkSize = 1024*1024*2
    const chunks = Math.ceil(file.size / chunkSize)
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()

    let currentChunk = 0

    fileReader.onload = e => {
      spark.append(e.target.result)
      currentChunk++

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    fileReader.onerror = () => reject('Unable to hash file')

    const loadNext = () => {
      const start = currentChunk * chunkSize
      const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }

    loadNext()
  })
}
