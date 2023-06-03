const { tallyModel } = require('./connector')
const { data } = require('./data')

const refreshAll = async () => {
    await tallyModel.deleteMany({})
    // console.log(connection)
    await tallyModel.insertMany(data)
}
//refreshAll()
module.exports={refreshAll}