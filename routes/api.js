/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
});

const Book = mongoose.model('books', bookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, function (err, docs) {
        if (err) return res.status(500).json({ message: 'Internal server error' });
        res.status(200).json(docs.map(function (book) { return { _id: book._id, title: book.title, commentcount: book.comments.length } }))
      })
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title) {
        const book = new Book({ title: title });
        book.save(function (err, doc) {
          if (err) return res.status(500).json({ message: 'Internal server error' });
          res.status(200).json({ _id: doc._id, title: doc.title })
        })
      } else {
        return res.status(200).send('missing required field title')
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteMany({},function(err,doc){
        res.status(200).send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, function (err, doc) {
        if (err || !doc) return res.status(200).send('no book exists');
        res.status(200).json({ _id: doc._id, title: doc.title, comments: doc.comments, commentcount: doc.comments.length })
      })
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (comment) {
        Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true, omitUndefined: true }, function (err, doc) {
          if (err || !doc) return res.status(200).send('no book exists');
          res.status(200).json({ _id: doc._id, title: doc.title, comments: doc.comments, commentcount: doc.comments.length });
        })
      } else {
        return res.status(200).send('missing required field comment');
      }
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndDelete(bookid,function(err,doc){
        if (err || !doc) return res.status(200).send('no book exists');
        res.status(200).send('delete successful');
      })
    });

};
