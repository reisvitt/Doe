const express = require("express")
const server = express()
require('dotenv/config');

// configuração do banco de dados
const mysql = require("mysql")

const connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER_DATABASE,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
})

connection.connect(function(err){
  if(err) return console.log(err)
  console.log("conectou ao banco de dados!")
})


// configurar o servidor para apresentar arquivos extras
server.use(express.static('public'))

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// configurarndo o tamplate engine
const nunjuscks = require("nunjucks")
nunjuscks.configure("./", {
  express: server,
  noCache: true
})


// pagina em exibixao na raiz
server.get("/", function(req, res){

  connection.query("SELECT * FROM donors", function(error, result){
    if(error) return res.send("Erro de banco de dados.")

    const donors = result

    return res.render("index.html", { donors })

  })
})

// envio do formulario
server.post("/", function(req, res){
  // pega dados do formulario

  const name = req.body.name
  const email = req.body.email
  const blood = req.body.blood

  if(name == "" || email == "" || blood == ""){
    console.log("Fechando conexão com banco de dados.")
    return res.send("Todos os campos são obrigatórios!")
  }


  // coloca valores no banco de dados
  const sql = "INSERT INTO donors (name, email, blood) VALUES ('" + name + "', '" + email + "', '" + blood + "')"

  connection.query(sql, function(err, results, fields){
    if(err) return console.log(err)
    console.log("Adicionou registro ao banco de dados!")
    
    return res.redirect("/")
  })

  
})

//  ligar o servidor e permitir o acesso na porta 3000
server.listen(3000)
