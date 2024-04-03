import main from './job.js'
import cron from 'node-cron';

import { createNewLogFile} from "./logger.js";

console.log("Job server is starting");


const job = cron.schedule('0 0 * * *', () => {
    createNewLogFile();
    main();
});


job.start();
