const fs = require('fs')

module.exports = {
  addFile(dir,name,data) {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/${name}`, data)
  }
}