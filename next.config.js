/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false
let assetPrefix = ''
if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '')

  assetPrefix = `/${repo}/`
}
const nextConfig = {
  assetPrefix: assetPrefix,
  reactStrictMode: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
