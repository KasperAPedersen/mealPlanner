// Kasper & Anya

import { Sequelize } from 'sequelize'; // Import the Sequelize class from the 'sequelize' package for ORM functionality
import Models from './models.js'; // Import models, which include all the defined database models
import dotenv from 'dotenv'; // Import dotenv to load environment variables from a .env file
import DummyData from './dummy.js'; // Import dummy data to populate the database with

// Load environment variables from .env file (like DB credentials)
dotenv.config();

// Create a new Sequelize instance with database connection details from environment variables
let sequelize = new Sequelize(
    process.env.DB_NAME,  // Database name
    process.env.DB_USER,  // Database username
    process.env.DB_PASS,  // Database password
    {
        host: process.env.DB_HOST,  // Database host (e.g., localhost)
        dialect: process.env.DB_DIALECT,  // SQL dialect (e.g., 'mysql', 'postgres', etc.)

        // Custom logging function to output ORM (Sequelize) queries with a label
        logging: (msg) => {
            console.log(`[ORM]\t\t${msg}`);
        }
    }
);

// Immediately invoked asynchronous function to test database connection and synchronize models
(async () => {
    try {
        // Test if the connection to the database is successful
        await sequelize.authenticate();
        console.log('[CON]\t\tConnection has been established successfully.\n');
    } catch (e) {
        // Handle connection failure
        console.error('[CON]\t\tUnable to connect to the database:', e);
    }

    try {
        // Synchronize all defined models with the database (create/update tables)
        await sequelize.sync();
        console.log('[SYN]\t\tModels have been synchronized.\n')
    } catch (e) {
        // Handle model synchronization failure
        console.error('[SYN]\t\tUnable to synchronize models:', e);
    }

    await insertDummyData();
})();

let insertDummyData = async () => {
    let accountCheck = await Models.Accounts.findAll({});
    if(accountCheck.length <= 0) {
        await DummyData();
    }
}

// Export the configured Sequelize instance for use in other parts of the application
export default sequelize;
