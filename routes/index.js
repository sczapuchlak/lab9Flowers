var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    req.db.collection('flowers').distinct('color', function(err, colorDocs){
        if (err) {
            return next(err)
        }

        if (req.query.color_filter) {

            req.db.collection('flowers').find({"color":req.query.color_filter}).toArray(function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs, 'color_filter': req.query.color_filter});
            });

        } else {
            req.db.collection('flowers').find().toArray(function (err, docs) {
                if (err) {
                    return next(err);
                }
                return res.render('all_flowers', {'flowers': docs, 'colors': colorDocs});

            });
        }
    });
});


router.get('/details/:flower', function(req, res, next){
    req.db.collection('flowers').findOne({'name' : req.params.flower}, function(err, doc) {
        if (err) {
            return next(err);  // 500 error
        }
        if (!doc) {
            return next();  // Creates a 404 error
        }
        return res.render('flower_details', { 'flower' : doc });
    });
});


router.post('/addFlower', function(req, res, next) {
    //looks through the database with the name
    req.db.collection('flowers').findOne({'name': req.body.name}, function (err, doc) {
        if (doc) {
            return res.send("This flower already exists! Please go back and enter a flower that doesn't exists")
        }
        req.db.collection('flowers').insertOne(req.body, function (err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    });
    router.post('/deleteFlower', function (req, res, next) {
        console.log(req.body);
        req.db.collection('flowers').deleteOne(req.body, function (err) {

            if (err) {
                return next(err);
            }
            return res.redirect('/');
        })
    });

    router.put('/updateColor', function (req, res, next) {

        var filter = {'name': req.body.name};
        var update = {$set: {'color': req.body.color}};

        req.db.collection('flowers').findOneAndUpdate(filter, update, function (err) {
            if (err) {
                return next(err);
            }
            return res.send({'color': req.body.color})
        })
    });

    router.get('/details/:flower', function (req, res, next) {
        res.send('todo: page about' + req.params.flower);
    });
});


module.exports = router;