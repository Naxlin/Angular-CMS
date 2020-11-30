const express = require('express');
const Message = require('../models/message');
const sequenceGenerator = require('./sequenceGenerator');
const router = express.Router();

// Function to return an error if one occurs, reduces code!
function returnError(res, err) {
    res.status(500).json({message: "An error occurred!", error: err});
}

router.get('/', (req, res, next) => {
    Message.find().populate('sender').then(mess => {
        res.status(200).json({message: "Messages fetched successfully!", messages: mess});
    }).catch(err => {
        returnError(res, err);
    });
});

router.get('/:id', (req, res, next) => {
    Message.findOne({"id": req.params.id})
    .then(mes => {
        res.status(200).json({message: "Message fetched successfully!", mess: mes});
    }).catch(err => {
        returnError(res, err);
    });
});

router.post('/', (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const message = new Message({
      id: maxMessageId,
      subject: req.body.subject,
      msgText: req.body.msgText,
      sender: req.body.sender
  });

  message.save().then(createdMessage => {
    res.status(201).json({
        message: 'Message added successfully',
        mess: createdMessage
    });
    })
    .catch(error => {
        res.status(500).json({
        message: 'An error occurred',
        error: error
    });
  });
});

router.put('/:id', (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
    message.name = req.body.name;
    message.description = req.body.description;
    message.url = req.body.url;

    message.updateOne({ id: req.params.id }, message)
        .then(result => {
        res.status(204).json({
            message: 'Message updated successfully'
        })
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
        });
      });
    })
    .catch(error => {
    res.status(500).json({
        message: 'Message not found.',
        error: { Message: 'Message not found'}
    });
  });
});

router.delete("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then(message => {
    message.deleteOne({ id: req.params.id })
        .then(result => {
        res.status(204).json({
            message: "Message deleted successfully"
        });
        })
        .catch(error => {
            res.status(500).json({
            message: 'An error occurred',
            error: error
        });
      })
    })
    .catch(error => {
    res.status(500).json({
        message: 'Message not found.',
        error: { message: 'Message not found'}
    });
  });
});

module.exports = router; 