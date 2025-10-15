{
  "version": 2,
  "builds": [
    {
      "src": "api/index.tsx",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/index",
      "dest": "/api/index"
    }
  ]
}
