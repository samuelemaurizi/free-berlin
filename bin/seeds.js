const mongoose = require("mongoose");
const Resource = require("../models/Resource");
const User = require("../models/User");

mongoose.Promise = Promise;
mongoose
  .connect(
    "mongodb://localhost/freeberlin",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// Resource DB
const resource = [
  {
    category: "Sports",
    shortdescr: "Golf ausprobieren - kostenlos jeden Sonntag.",
    longdescr:
      "Golf spielen macht glücklich und fördert die Gesundheit - lernen Sie Golf spielen in unserer Golfschule bei Berlin! In unserem Schnupperkurs können Golf Anfänger unverbindlich und kostenlos das Golf spielen ausprobieren.",
    location: "Tierpark",
    date: "Jeder Sonntag um 14.00 Uhr (April - Oktober 2018)"
  },
  {
    category: "Sports",
    shortdescr: "Tangoeinführung: Tango-Schnupperkurse",
    longdescr:
      "Noch beschwingter durchs Leben? An Sonntagen der offenen Tür gibt es von 16 bis 18 Uhr kostenlose Tango-Einführung im Mala Junta, Etage für Tango Argentino. Termine auf der Site.",
    location: "Brüssel Str. 21",
    date: "Jeder Samstag um 9.00 Uhr"
  },
  {
    category: "Culture",
    shortdescr: "Open Air Kino am Checkpoint Charlie.",
    longdescr:
      "Die ehrgeizige Politikerin Janet hat Freunde und Mitstreiter eingeladen, um ihre Berufung zur Gesundheitsministerin zu feiern. Doch als ihr Ehemann Bill mit einem brisanten Geständnis herausplatzt, nimmt die Party eine überraschende Wendung. Mit sichtlichem Vergnügen sprengt Sally Potter in ihrer temporeichen Screwball-Komödie eine linksliberale Partygesellschaft und nimmt die Londoner Upper Class, Post-Post-Feministinnen und alteingesessene Linksintellektuelle genüsslich aufs Korn. Stilsicher inszeniertes Kammerspiel um starke Frauen und emotionale Abgründe.",
    location: "Charlie's Beach, Friedrichstraße 48",
    date: "Jeder Donnerstag um 20.00 Uhr (September - Oktober 2018)"
  },
  {
    category: "Sports",
    shortdescr: "1 Golf ausprobieren - kostenlos jeden Sonntag.",
    longdescr:
      "Golf spielen macht glücklich und fördert die Gesundheit - lernen Sie Golf spielen in unserer Golfschule bei Berlin! In unserem Schnupperkurs können Golf Anfänger unverbindlich und kostenlos das Golf spielen ausprobieren.",
    location: "Tierpark",
    date: "Jeder Sonntag um 14.00 Uhr (April - Oktober 2018)"
  },
  {
    category: "Sports",
    shortdescr: "2 Golf ausprobieren - kostenlos jeden Sonntag.",
    longdescr:
      "Golf spielen macht glücklich und fördert die Gesundheit - lernen Sie Golf spielen in unserer Golfschule bei Berlin! In unserem Schnupperkurs können Golf Anfänger unverbindlich und kostenlos das Golf spielen ausprobieren.",
    location: "Tierpark",
    date: "Jeder Sonntag um 14.00 Uhr (April - Oktober 2018)"
  },
  {
    category: "Sports",
    shortdescr: "3 Golf ausprobieren - kostenlos jeden Sonntag.",
    longdescr:
      "Golf spielen macht glücklich und fördert die Gesundheit - lernen Sie Golf spielen in unserer Golfschule bei Berlin! In unserem Schnupperkurs können Golf Anfänger unverbindlich und kostenlos das Golf spielen ausprobieren.",
    location: "Tierpark",
    date: "Jeder Sonntag um 14.00 Uhr (April - Oktober 2018)"
  }
];

Resource.deleteMany()
  .then(() => {
    Resource.create(resource);
  })
  .then(entries => {
    console.log(entries.length + " entries created");
    mongoose.connection.close();
  })
  .catch(err => {
    throw err;
  });
