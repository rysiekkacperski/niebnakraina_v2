# Niebna Kraina v2 

The firebase project is written in React as front-end framework powered by Vite. The aim of the project is a presentation of offer of an institution for neurodivergent children and letting users schedule a visit via app.

## What's included and current stage

In directory './src/components/functionality' you can find all objects neccessary for the entire app to work (scheduling visits by logged in users).

The frontend for visits scheduling process is located in '.src/components/niebnakraina/pages/visit/visit.jsx'

Auth logic is located in '.src/components/general/auth.jsx'

The connection to Google Firebase is located in '/src/firebaseProvider.jsx'

To do:
- Integration with Stripe and Bigin API for visits scheduling
- Creation of product, category and therapist views