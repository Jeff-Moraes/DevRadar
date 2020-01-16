const Dev = require("../models/Devs");
const parseStringAsArray = require("../utils/parseStringAsArray");

module.exports = {
  async index(req, res) {
    const { latitude, longitude, techs } = req.query;
    const techsArr = parseStringAsArray(techs);
    // get all devs
    const devs = await Dev.find({
      techs: {
        $in: techsArr
      },
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000
        }
      }
    });
    // filter by techs
    return res.json({ dev: [devs] });
  }
};
