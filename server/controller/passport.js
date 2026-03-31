import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import passport from 'passport';
// FIX: Added .js extension and used import
import User from '../db/models/Users.js'; 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
          // Create new user if not found
          user = new User({
              username: profile.displayName,
              email: profile.emails[0].value,
              // Since you updated your Schema to make password optional, 
              // you can actually leave this out now if you prefer.
              password: "google_login_auth_placeholder", 
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// Serialize user for the session (required by passport)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// ESM doesn't require a default export here if you are 
// just importing this for side-effects in server.js
export default passport;