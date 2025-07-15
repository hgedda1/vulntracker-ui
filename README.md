# vulntracker-ui
A modern, interactive vulnerability management dashboard that visualizes known exploited vulnerabilities from CISA using charts, tables, and tiles. Built with Next.js 15, Tailwind CSS, ShadCN UI, and Recharts.

[![N|Vulntracker](https://cldup.com/dTxpPi9lDf.thumb.png)](https://hgedda1.github.io/vulntracker-ui)

## Features

- Full-text search across CVEs 
- Severity-based filtering(Critical, High, Medium, Low) 
- Chart, Table, and Tile visualizations
- Sort by CVE ID, Date Added, Due Date, Vendor
- Export to CSV/JSON 
- Overdue vulnerability alerts - Fully static — deploys anywhere (GitHub Pages, Netlify, Vercel)

Live Demo:

> https://hgedda1.github.io/vulntracker-ui

This text you see here is *actually- written in Markdown! To get a feel
for Markdown's syntax, type some text into the left window and
watch the results in the right.

## Tech

Dillinger uses a number of open source projects to work properly:

- **Next.js 15**
- **Tailwind CSS**
- **ShadCN UI**
- **Recharts**
- **Lucide Icons**

And of course it is open source here
> https://github.com/hgedda1/vulntracker-ui


## Installation

### Prerequisites

- Node.js v18+ recommended  
- `pnpm` package manager (`npm install -g pnpm`)

- vulntracker-ui requires [Node.js](https://nodejs.org/) v10+ to run.
- pnpm package

### Clone the repo git clone

```sh
https://github.com/hgedda1/vulntracker-ui.git
cd vulntracker-ui
```
Install the dependencies and devDependencies and start the server.

```sh
pnpm install
pnpm run build
```
### Start Proxy Server (for development)

To bypass CORS issues with the CISA API, run the local proxy server in a separate terminal:

```bash
node server.js
```

Development Server
```sh
pnpm run dev
```

In your browser navigate to
> http://localhost:3000/

## Data Source

CISA KEV Catalog JSON
> https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json

Fallback to local file: /data/data.json

## Development

Want to contribute? Great!

Feel free to open issues or submit PRs to enhance functionality, styling, or performance.

## Author
Hemanth Gedda

## LinkedIn
> https://www.linkedin.com/in/hemanth-gedda-6b8419252/

## Portfolio
> https://hgedda1.github.io/