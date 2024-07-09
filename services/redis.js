import redis from "redis";

let redisClient = redis.createClient();

redisClient.on("error", (error) => console.error(`Error : ${error.errors}`));

redisClient.on("connect", function (err) {
  console.log("Connected to redis successfully");
});

export default redisClient;
