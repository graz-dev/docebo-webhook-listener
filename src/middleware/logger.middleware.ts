import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`req:`, {
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
    });

    getResponseLog(res);

    if (next) {
      next();
    }
  }
}

const getResponseLog = (res: Response) => {
  const rawResponse = res.write;
  const rawResponseEnd = res.end;

  let chunkBuffers = [];

  console.log(`======>> Beginning res.write`);
  res.write = (...chunks) => {
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
      if (!chunks[i]) {
        res.once('drain', res.write);
        --i;
      }
    }

    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    return rawResponse.apply(res, resArgs);
  };

  console.log(`========> Done writing, beginning res.end`);
  res.end = (...chunks) => {
    console.log(
      `========> Chunks gathered during res.write: ${typeof chunkBuffers}`,
      Buffer.from(chunkBuffers).toJSON(),
    );
    console.log(
      `========> Chunks to handle during res.end: ${typeof chunks}`,
      Buffer.from(chunks).toJSON(),
    );

    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      console.log(`res.end chunk ${i} content: ${typeof chunks[i]}`, chunks[i]);

      if (chunks[i]) resArgs[i] = Buffer.from(chunks[i]);
    }

    if (Buffer.concat(resArgs)?.length) {
      chunkBuffers = [...chunkBuffers, ...resArgs];
    }

    const body = Buffer.concat(chunkBuffers).toString('utf8');

    const responseLog = {
      response: {
        statusCode: res.statusCode,
        body: JSON.parse(body) || body || {},
        headers: res.getHeaders(),
      },
    };

    console.log('res: ', responseLog);

    rawResponseEnd.apply(res, resArgs);
    return responseLog as unknown as Response;
  };
};
