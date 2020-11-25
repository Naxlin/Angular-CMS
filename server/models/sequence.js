const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    maxDocumentId: { type: int, required: true },
    maxMessageId: { type: int, required: true },
    maxContactId: { type: int, required: true },
});

module.exports = mongoose.model('Sequence', sequenceSchema);