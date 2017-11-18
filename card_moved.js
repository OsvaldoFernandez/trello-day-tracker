'use latest';

const MongoClient = require('mongodb').MongoClient;

const save_card = (card_id, card_title, db, cb) => {
  const doc = {
    _id: card_id,
    title: card_title,
    started_at: new Date()
  };

  const insert_cb = (err) => {
    if(err) return cb(err);
    console.log('Card ID: %s saved!!', card_id);
    cb(null);
  }

  db.collection('cards').insert(doc, insert_cb);
}

const update_card = (card_id, db, cb) => {
  const doc = {
    _id: card_id
  };

  const setting = {
    $set: {
      finished_at: new Date()
    }
  };

  const update_cb = (err) => {
    if(err) return cb(err);
    console.log('Card ID: %s updated!!', card_id);
    cb(null);
  }

  db.collection('cards').updateOne(doc, setting, update_cb);
}

module.exports = (ctx, done) => {

  const card_id = ctx.data.card_url.split('/')[4];
  const card_title = ctx.data.card_title;
  const list_name = ctx.data.list_name;

  const card_cb = (err) => {
    if(err) return done(err);
    done(null, 'Success.');
  };

  const connect_db_cb = (err, db) => {
    if(err) return done(err);

    switch(list_name) {
      case 'Doing':
        save_card(card_id, card_title, db, card_cb);
        break;
      case 'QA Approved':
        update_card(card_id, db, card_cb);
        break;
      default:
        done('Invalid list name');
    }
  }

  MongoClient.connect(ctx.data.MONGO_URL, connect_db_cb);
};
