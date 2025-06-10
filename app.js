const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// ===========configure passport start ===========//
const passport = require('passport');
const gitHubAuthStrategy = require('passport-github2').Strategy;
const strategySettings = require('./config');
const session = require('express-session');
// ===========configure passport end ============//


const helmet = require('helmet');

const indexRouter = require('./routes/index');
const app = express();

// app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: '123secret456',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  // console.log(user);
  cb(null, user);
});

passport.use(new gitHubAuthStrategy(strategySettings,
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile)
  }),
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', passport.authenticate('github'))
app.get('/auth',
  passport.authenticate('github',
    { failureRedirect: '/login' }
  ),
  (req, res, next) => { res.redirect('/') }
);


app.use('/', indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
