import {createApp} from './app/createApp';
import {env} from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`TenderFlow backend listening on http://localhost:${env.port}`);
});
