// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // ← This enables static export
  trailingSlash: true,     // ← Recommended for Hostinger
  images: {
    unoptimized: true,     // ← Required for static export
  },
}

module.exports = nextConfig