const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true});

const db = mongoose.connection;

db.on('open', function(){
    console.log('open')
})

// Cat 对应 mongodb里面collection cats
const Cat = mongoose.model('Cat', { name: String });
const kitty = new Cat({ name: 'Zildjian' });
kitty.save().then(() => console.log('meow'));

const Test = mongoose.model('Test', {name: String, age: Number})
const test = new Test({name: 'sumail', age:10})
test.save().then(() => console.log('meow'));

var personqSchema = new mongoose.Schema({
    n: {
      type: String,
      // Now accessing `name` will get you the value of `n`, and setting `n` will set the value of `name`
      alias: 'name'
    }
}, { _id: false });

const Pp = mongoose.model('Pp', personqSchema);
  
  // Setting `name` will propagate to `n`
  var persons = new Pp({ name: 'Val' });
  console.log(persons); // { n: 'Val' }
  console.log(persons.toObject({ virtuals: true })); // { n: 'Val', name: 'Val' }
  console.log(persons.name); // "Val"
  
  persons.name = 'Not Val';
  console.log(persons); // { n: 'Not Val' }
  console.log('-----aaaa-----');

// disabled _id
// var childSchema = new Schema({ name: String }, { _id: false });
// var parentSchema = new Schema({ children: [childSchema] });

// var Model = mongoose.model('Model', parentSchema);

// Model.create({ children: [{ name: 'Luke' }] }, function(error, doc) {
//   // doc.children[0]._id will be undefined
// });  

const PlayerSchema = new mongoose.Schema({
      ranking: Number,
      name: String,
      gender: String,
      age: Number
})

// 增加一个虚拟属性 不会持久化到mongodb
PlayerSchema.virtual('another').get(function(){
      return this.name + '' + this.gender;
})

// 可以set
personSchema.virtual('fullName').
  get(function() { return this.name.first + ' ' + this.name.last; }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
});

axl.fullName = 'William Rose'; // Now `axl.name.first` is "William"

const blogSchema = new mongoose.Schema({
      date: {type: Date, default: Date.now},
      title: String,
      author: String
})

PlayerSchema.methods.speak = function(){
    var greeting = this.name
    ? "Meow name is " + this.name
    : "I don't have a name";
    console.log(greeting);
}

// 此方法里面的this 都可以拿到各种model
PlayerSchema.methods.findByName = function() {
    return this.model('Blog').find({title:'oiooorr'}, (err, res) => {   
           console.log(res, '-----------');
    });
}

// 静态方法 
PlayerSchema.statics.findByRanking = function(ranking) {
    return this.find({ranking}, (err, res) => {
           console.log(res, '**********');
    })
}

PlayerSchema.query.byName = function(name) {
    return this.where({ name: new RegExp(name, 'i') });
  };

const Player = mongoose.model('Player', PlayerSchema);
const Blog = mongoose.model('Blog', blogSchema);
const player = new Player({ranking:11, name: 'eeeff', gender:'male', age:18});
console.log(player);
//Player.insertMany();
Player.findByRanking(12);
player.speak();
player.findByName();
player.save().then(() => console.log('meow'));

Player.find((err, results) => {
    if (err) return console.error(err);
    console.log(results, '----reslut-----');
})

Player.find({name:'dddd'}).limit(2).sort({age: -1}).select({name:1, ranking:1, gender:1}).exec((err, res) => {
    console.log(res, '------limit-----');
})

const pkpk = Player.findOne({name: 'dddd'}, 'ranking gender', (err, res) => {
    console.log(res, '0000------00000');
})

// Player.count({name: 'dddd'}, (err, res) => {
//     console.log(res, '====ooo====');
// })

Player.find().byName('dddd').exec(function(err, res){
    console.log(res, '------query-----');
})

Player.find({name:/^eee/}, (err, res) => {
    console.log(res);
})

Player.create([{ranking:12, name:'dddssww', gender:'female', age:32}], (err, res) => {
    console.log(res);
})

const blog = new Blog({title:'oiooorr', author: 'oinu'});

blog.save().then(() => console.log('meow'));

//----------------- ADVANCE ----------
const Schema = mongoose.Schema;

const personSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    age: Number,
    stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
  });
  
const storySchema = Schema({
author: { type: Schema.Types.ObjectId, ref: 'Person' },
title: String,
fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});
  
const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);

Story.find((err, res) => {
    console.log(res);
    console.log(res[0]);
})

const author = new Person({
    _id: new mongoose.Types.ObjectId(),
    name: 'Ian Flemingsssqqq',
    age: 50
});

const author11 = new Person({
    _id: new mongoose.Types.ObjectId(),
    name: 'qweeee',
    age: 50
});

// register 2 callback for post save
// Takes 2 parameters: this is an asynchronous post hook
schema.post('save', function(doc, next) {
  setTimeout(function() {
    console.log('post1');
    // Kick off the second post hook
    next();
  }, 10);
});

// Will not execute until the first middleware calls `next()`
schema.post('save', function(doc, next) {
  console.log('post2');
  next();
});


author.save(function (err) {
    if (err) return handleError(err);

    author11.save((err) => {
        const story33 = new Story({
            _id: new mongoose.Types.ObjectId(),
            title: 'qqqqq1',
            fans:[author._id, author11._id],
            author: author._id    // assign the _id from the person
        });
        story33.save((err) => {
            console.log('----------story---------');
            Story.findOne({title: 'qqqqq1'}).populate('fans').populate('author').exec((err, story) => {
                  console.log(story);
            })

            Story.findOne({title: 'qqqqq1'}).populate('fans').exec((err, story) => {
                console.log(story);
          })
        })
    })

    const story1 = new Story({
        _id: new mongoose.Types.ObjectId(),
        title: 'Casinoqqq Royale1111',
        author: author._id    // assign the _id from the person
    });

    const story2 = new Story({
        _id: new mongoose.Types.ObjectId(),
        title: 'Casinoqqq Royale2222',
        author: author._id    // assign the _id from the person
    });

    story1.save(function (err) {
        if (err) return handleError(err);

        Story.findOne({title: 'Casino Royale'}).populate('author', 'name').exec((err, story) => {
              console.log(story.author,'----populate-----');
        })
    });

    story2.save(function (err) {
        if (err) return handleError(err);
    });

    const authorss = new Person({
        _id: new mongoose.Types.ObjectId(),
        name: 'Ian Flemingsssqqqww',
        age: 50,
        stories: [story1._id, story2._id]
      });

      authorss.save((err, res) => {
                Person.findOne({name: 'Ian Flemingsssqqqww'}).populate('stories').exec((err, person) => {
                      console.log(person.stories);
                })
      })
});

const story3 = new Story({
    _id: new mongoose.Types.ObjectId(),
    title: 'Casinoqqq Royale22231',
});

story3.save((err, res) => {
    Story.findOne({title: 'Casinoqqq Royale22231'}, (err, story) => {
        story.author = author._id;
    })
})

/*
  Story.
  find(...).
  populate({
    path: 'fans',
    match: { age: { $gte: 21 }},
    // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB
    select: 'name -_id',
    options: { limit: 5 }
  }).
  exec();
*/  

// const commentSchema = new Schema({
//       body: {type: String, required: true},
//       on: {
//             type: Schema.Types.ObjectId,
//             required: true,
//             refPath: 'onModel'
//       },
//       onModel: {
//             type: String,
//             required: true,
//             enum: ['BlogPost', 'Product']
//       }
// })

// const Product = mongoose.model('Product', new Schema({ name: String }));
// const BlogPost = mongoose.model('BlogPost', new Schema({ title: String }));
// const Comment = mongoose.model('Comment', commentSchema);

// const book = await Product.create({ name: 'The Count of Monte Cristo' });
// const post = await BlogPost.create({ title: 'Top 10 French Novels' });

// const commentOnBook = await Comment.create({
//   body: 'Great read',
//   on: book._id,
//   onModel: 'Product'
// });

// const commentOnPost = await Comment.create({
//   body: 'Very informative',
//   on: post._id,
//   onModel: 'BlogPost'
// });

// // The below `populate()` works even though one comment references the
// // 'Product' collection and the other references the 'BlogPost' collection.
// const comments = await Comment.find().populate('on').sort({ body: 1 });
// comments[0].on.name; // "The Count of Monte Cristo"
// comments[1].on.title; // "Top 10 French Novels"



