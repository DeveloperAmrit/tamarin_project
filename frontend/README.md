# Frontend - Attack Depth SimulatorThis is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).



Next.js frontend for the Attack Depth Simulator application.## Getting Started



## Quick StartFirst, run the development server:



```bash```bash

# Install dependenciesnpm run dev

npm install# or

yarn dev

# Run development server# or

npm run devpnpm dev

```# or

bun dev

Application will start at: http://localhost:3000```



## Environment VariablesOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.



Create `.env.local`:You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

```

NEXT_PUBLIC_API_URL=http://localhost:8000This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

```

## Learn More

## Features

To learn more about Next.js, take a look at the following resources:

- Interactive network graph builder

- Real-time visualization with ReactFlow- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- Attack simulation interface- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- Detailed results display

- Responsive design with Tailwind CSSYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!



## Components## Deploy on Vercel



- `NetworkGraph.tsx` - Interactive graph visualizationThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

- `NodeForm.tsx` - Add network nodes

- `EdgeForm.tsx` - Create connectionsCheck out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

- `CredentialForm.tsx` - Manage credentials
- `SimulationPanel.tsx` - Run attack simulations
- `ResultsDisplay.tsx` - Show simulation results

## Build for Production

```bash
npm run build
npm start
```
