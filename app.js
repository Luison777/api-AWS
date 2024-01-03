const express = require('express')
var createError = require('http-errors')
var logger = require('morgan');
var app = express()
const port = 8080

var crudRouter=require('./routes/CRUDroutes')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/prueba',crudRouter)

app.get('/', (req, res) => {
  res.send('Hello World from AWS!')
})

app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;