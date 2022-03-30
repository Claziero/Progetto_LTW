

const config = {
    host: '127.0.0.1',
    // Do not hard code your username and password.
    // Consider using Node environment variables.
    user: 'postgres',     
    password: 'biar',
    database: 'progettoLTW',
    port: 5432,
    ssl: true
};

const client = new pg.Client(config);

client.connect(err => {
    if (err) throw err;
    else {
        queryDatabase();
    }
});