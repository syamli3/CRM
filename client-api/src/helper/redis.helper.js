import redis from "redis";

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    console.warn("⚠️ REDIS_URL is not defined in .env! Redis features (like session tracking) will not work.");
    return;
  }
  try {
    await client.connect();
    console.log("Redis client connected successfully");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
};

const disconnectRedis = async () => {
  try {
    await client.quit();
    console.log("Redis client disconnected successfully");
  } catch (err) {
    console.error("Failed to disconnect from Redis:", err);
  }
};

const setJWT = async (key, value) => {
  try {
    const res = await client.set(key, value, { EX: 60 * 60 });
    return res;
  } catch (err) {
    throw err;
  }
};

const getJWT = async (key) => {
  try {
    const res = await client.get(key);
    return res;
  } catch (err) {
    throw err;
  }
};

const deleteJWT = async (key) => {
  try {
    const res = await client.del(key);
    return res;
  } catch (err) {
    throw err;
  }
};

export { setJWT, getJWT, deleteJWT, connectRedis, disconnectRedis };
