import dotenv from "dotenv"
dotenv.config()

class AppConfig {
    public readonly  port = process.env.PORT;
    public readonly mysqlHost = process.env.DB_HOST;
    public  mysqlUser = process.env.DB_USER;
    public  mysqlPassword = process.env.DB_PASSWORD;
    public  mysqlDatabase = process.env.DATABASE;
    public  appHost = "http://localhost:" + this.port;
}

const appConfig = new AppConfig

export default appConfig;
