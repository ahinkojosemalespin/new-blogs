
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
  res.render('index', { title: 'index' });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/***********************************************************/
//SEQUELIZE

var Sequelize = require('sequelize')
  , sequelize = new Sequelize('Blogs', 'postgres', 'root', {
      host: '192.168.2.150',
      dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
      port: 5432, // or 5432 (for postgres)
  })

sequelize
  .authenticate()
  .complete(function (err) {
      if (!!err) {
          console.log('Unable to connect to the database:', err)
      } else {
          console.log('Connection has been established successfully.')
      }
  })

var Blogs = sequelize.define('blogs', {
    blogtitle: Sequelize.STRING,
    dateblog: Sequelize.DATE,
    urlblog: Sequelize.STRING
})
var Tags = sequelize.define('tags', {
    texttag: Sequelize.STRING,
    urltag: Sequelize.STRING,
})
var Authors = sequelize.define('authors', {
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: Sequelize.STRING,
})

Blogs.belongsTo(Authors);
Blogs.hasMany(Tags);
Tags.hasMany(Blogs);

sequelize
  .sync()
  .complete(function (err) {
      if (!!err) {
          console.log('An error occurred', err)
      } else {
          console.log('Table authors created')
      }
  })
/***********************************************************/
//BLOGS
//Function to get all the blogs
app.get('/blogs/get', function (req, res) {
    Blogs.findAll({ include: [Authors] }).complete(function (err, blogs) {
      if (!!err) {
          console.log('An error occurred', err)
      } else if (!blogs) {
          console.log('No records')
      } else {
          res.json(blogs);
      }
  })
});

//Function to insert a new blog
app.post('/blogs/new', function (req, res) {
    Blogs.create({ blogtitle: req.body.blogtitle, dateblog: req.body.dateblog, urlblog: req.body.urlblog, authorId: req.body.idauthor }).complete(function (err, blog1) {
        console.log(blog1.dataValues)
        res.json(blog1);
    })
});

//Function to get tags of a blog
app.get('/blogs/getTagsByBlog', function (req, res) {
    Tags.findAll({ include: [{ model: Blogs}], where: { "blogs.id": req.query.idblog } }).complete(function (err, blogs) {
        if (!!err) {
            console.log('An error occurred', err)
        } else if (!blogs) {
            console.log('No records.')
        } else {
            res.json(blogs);
        }
    })
});

//Function to modify the author
app.post('/blogs/update', function (req, res) {
    console.log(req.body);
    sequelize.query('UPDATE "blogs" SET "authorId" = ' + req.body.idauthor + ' WHERE "id" = ' + req.body.idblog).success(function (myTableRows) {
        console.log(myTableRows)
        res.json(myTableRows);
    })
});

//AUTHORS
//Function to get all the authors
app.get('/authors/get', function (req, res) {
    Authors.findAll().complete(function (err, authors) {
        if (!!err) {
            console.log('An error occurred', err)
        } else if (!authors) {
            console.log('No records.')
        } else {
            res.json(authors);
        }
    })
});

//Function to insert a new author
app.post('/authors/new', function (req, res) {
    Authors.create({ firstname: req.body.firstname, lastname: req.body.lastname, email: req.body.email, }).complete(function (err, author1) {
        console.log(author1.dataValues)
        res.json(author1);
    });
});

//TAGS
//Function to get all the tags
app.get('/tags/get', function (req, res) {
    Tags.findAll().complete(function (err, tags) {
        if (!!err) {
            console.log('An error occurred', err)
        } else if (!tags) {
            console.log('No records.')
        } else {
            res.json(tags);
        }
    })
});

//Function to insert a new tag
app.post('/tags/new', function (req, res) {
    console.log(req.body);
    Tags.create({ texttag: req.body.texttag, urltag: req.body.urltag }).complete(function (err, tag1) {
        console.log(tag1.dataValues)
        res.json(tag1);
    });
});

//Function to delete all the relationship of the blog and tags
app.post('/tags/detelerel', function (req, res) {
    console.log(req.body);
    sequelize.query('DELETE from "blogstags" WHERE "blogId" = ' + req.body.idblog).success(function (myTableRows) {
        console.log(myTableRows)
        res.json(myTableRows);
    })
});

//Function to assing tags to blogs
app.post('/tags/assing', function (req, res) {
    console.log(req.body);
    sequelize.query('INSERT INTO "blogstags" ("tagId","blogId") VALUES (' + req.body.idtag + ',' + req.body.idblog + ')').success(function (myTableRows) {
        console.log(myTableRows)
        res.json(myTableRows);
    })
});