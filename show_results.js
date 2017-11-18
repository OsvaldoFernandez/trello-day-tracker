'use latest';

const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const _ = require('underscore');

module.exports = (ctx, done) => {

  const get_card_info = (result) => {
    return {
      id: result._id,
      title: result.title,
      duration: moment(result.finished_at).diff(result.started_at, 'days', true)
    }
  };

  const list_cards = (result) => {
    return _.sortBy(result.map(get_card_info), 'duration').reverse();
  };

  const get_cards_cb = (err, result) => {
    if(err) return done(err);
    done(null, list_cards(result));
  };

  const connect_db_cb = (err, db) => {
    if(err) return done(err);
    db.collection('cards').find().toArray(get_cards_cb);
  }

  MongoClient.connect(ctx.data.MONGO_URL, connect_db_cb);
};
