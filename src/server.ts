import express from "express"
import "dotenv/config"
import categoriaRouter from "./routers/categoria.routers.js"
import clienteRouter from "./routers/clientes.routers.js"
import cyberwareRouter from "./routers/cyberwares.routers.js"
import instalacaoRouter from "./routers/intalacoes.routers.js"
 
const port = 3000
const app = express()
 
app.use(express.json())
 
app.use("/categoria", categoriaRouter)
app.use("/clientes", clienteRouter)
app.use("/cyberwares", cyberwareRouter)
app.use("/instalacoes", instalacaoRouter)
 
app.listen(port, () => {
    console.log("rodando na porta", port)
})
 