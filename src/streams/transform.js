import { Transform } from 'stream';

const transform = async () => {
  const reverseStream = new Transform({
    transform(chunk, encoding, callback) {
      const reversed = chunk.toString().trim().split('').reverse().join('') + '\n';
      callback(null, reversed);
    }
  });

  process.stdin
    .pipe(reverseStream)
    .pipe(process.stdout);
};

await transform();
