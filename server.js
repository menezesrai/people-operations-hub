const { createApp } = require('./src/app');

const port = Number.parseInt(process.env.PORT || '3000', 10);
const app = createApp();

app.listen(port, () => {
  console.log(`People Operations Hub is running at http://localhost:${port}`);
});
