const mongoose = require('mongoose')

const url = 'mongodb://' + process.env.FULLSTACKOPEN_MLAB_USER + ':' + process.env.FULLSTACKOPEN_MLAB_PWD + '@ds239309.mlab.com:39309/fullstackopen'


mongoose.connect(url)

const personSchema = mongoose.model('Person', {
    name: String,
    number: String
})

personSchema.format = (person) => {
    return {
        name : person.name,
        number : person.number,
        id : person._id
    }
}
module.exports = personSchema