/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        API_URL: process.env.API_URL,
        MAX_UPLOAD_IMAGE: process.env.MAX_UPLOAD_IMAGE,
        FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
        FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
        FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
        FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
        FIREBASE_MEASURMENT_ID: process.env.FIREBASE_MEASURMENT_ID,
        LIMIT: process.env.LIMIT,
        LIMIT_CM: process.env.LIMIT_CM,
        DEFAULT_AVATAR: process.env.DEFAULT_AVATAR,
        API_ADMINISTRATIVE_UNIT_URL: process.env.API_ADMINISTRATIVE_UNIT_URL,
        API_HOST: process.env.API_HOST,
        LIMIT_FQ: process.env.LIMIT_FQ,
        LIMIT_NOTIFY: process.env.LIMIT_NOTIFY,
        MQTT_BROKER: process.env.MQTT_BROKER,
    },
    swcMinify: true,
    images: {
        minimumCacheTTL: 600,
        domains: ['res.cloudinary.com', 'i.imgur.com'],
    },
};

module.exports = nextConfig;
