export default{
    port: 3000,
    mysql: {
        host: 'lizzyipca.mysql.database.azure.com',
        port: 3306,
        user: 'lizzy',
        password: "67'MKe9I",
        database: 'lizzy_db'
      },
      loglevel: 'info',
      smtp:{
        user: 'a21113@alunos.ipca.pt',
        pass: '',
        host: 'smtp-mail.outlook.com',
        port: '587',
        secureConnection: false,
        tls: {
          ciphers: 'SSLv3',
        },
      },
    accessTokenPrivateKey: 'privateAccess.pem',
    accessTokenPublicKey: "publicAccess.pem",
    refreshTokenPrivateKey: "privateRefresh.pem",
    refreshTokenPublicKey: "publicRefresh.pem",
};