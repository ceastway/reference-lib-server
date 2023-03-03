/*
node dist/util/async-promise.js

Example of ASYNC/Fetch - Promise All
  - separate component for getData/Fetch
  - Try/Catech/Finally
*/

const recordVideo1 = new Promise((resolve, reject) => {
  resolve('Video 1 Recorded');
  console.log(reject);
});
  
const recordVideo2 = new Promise((resolve, reject) => {
  resolve('Video 2 Recorded');
  console.log(reject);
});

const recordVideo3 = new Promise((resolve, reject) => {
  resolve('Video 3 Recorded');
  console.log(reject);
});

Promise.all([
  recordVideo1,
  recordVideo2,
  recordVideo3
]).then((messages) => {
  console.log(messages);
}
);
