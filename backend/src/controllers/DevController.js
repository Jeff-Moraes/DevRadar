const axios = require("axios");

const Dev = require("../models/Devs");
const parseStringAsArray = require("../utils/parseStringAsArray");
const { findConnections, sendMessage } = require("../websocket");

// index, show, store, update, destroy

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiRes = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      let { name = login, avatar_url, bio } = apiRes.data;

      const techsArr = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArr,
        location
      });

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArr
      );

      sendMessage(sendSocketMessageTo, "newDev", dev);
    }

    return res.json({ dev: dev });
  },

  async update(req, res) {
    const { github_username } = req.params;

    const { name, avatar_url, bio, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      return res.json({ message: "User not find" });
    }

    const techsArr = parseStringAsArray(techs);

    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };

    dev = await Dev.findOneAndUpdate(
      github_username,
      {
        name,
        avatar_url,
        bio,
        techs: techsArr,
        location
      },
      {
        new: true
      }
    );

    return res.json({ dev: dev });
  },

  async destroy(req, res) {
    const { github_username } = req.params;

    const dev = await Dev.findOneAndDelete({ github_username });

    return res.json({ dev: dev });
  }
};
