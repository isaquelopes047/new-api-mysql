const express = require('express');
const router = express.Router();
const mysql = require('../connect/mysql').pool;
const login = require('../middleware/login')

/* Get TODOS OS PRODUTOS */
router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {

        if(error) {return res.status(500).send({error: error})}

        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}

                const response = {
                    quantidade: result.length,
                    produtos: result.map(prod => {

                        return {
                            id_produto: prod.id_produto,
                            nome: prod.nome,
                            preco: prod.preco,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna os detalhes de um produto',
                                url: 'http://localhost:3000/produtos/' + prod.id_produto
                            }
                        }

                    })
                }
                return res.status(200).send({response})
            }
        )
    })
});

/* Get SOMENTE DE UM PRODUTO EM ESPECIFICO */
router.get('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if(error) {return res.status(500).send({error: error})}

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}
                
                if(result.length == 0){
                    return res.status(404).send({
                        mensagem: 'Não foi encontrado nenhum produto com esse id'
                    })
                }

                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna um produto',
                            url: 'http://localhost:3000/produtos'
                        }

                    }
                }
                return res.status(200).send({response})
            }
        )
    })
});

/* POST ADD UM PRODUTO */
router.post('/', login.obrigatorio, (req, res)=> {
    mysql.getConnection((error, conn) => {

        if(error) {return res.status(500).send({error: error})}

        conn.query(
            'INSERT INTO produtos (nome, preco) VALUES (?,?)',
            [req.body.nome, req.body.preco],
            (error, result, fields) => {
                conn.release();

                if(error) {return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto inserido com sucesso',
                    produtoCriado: {

                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'POST',
                            descricao: 'Adicionar um produto',
                            url: 'http://localhost:3000/produtos'
                        }
                        
                    }
                }

                return res.status(201).send({response});
            }
        )
    })
});

/* PATCH ALTERAR REGISTRO POR PARAMETRO DA URL */
router.patch('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if(error) {return res.status(500).send({error: error})}

        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',

            [ 
              req.body.nome, 
              req.body.preco,
              req.params.id_produto
            ],

            (error, result, fields) => {
                conn.release();

                if(error) {return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto atualizado com sucesso',
                    produtoAtualizado: {

                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                        
                    }
                }

                return res.status(202).send({response});
            }
        )
    })
});

/* DELETA PRODUTO POR PARAMETRO DA URL */
router.delete('/:id_produto', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if(error) {return res.status(500).send({error: error})}

        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?',

            [req.params.id_produto],

            (error, result, fields) => {
                conn.release();
                if(error) {return res.status(500).send({error: error})}

                const response = {
                    mensagem: 'Produto removido com sucesso',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos'
                    }
                }
                return res.status(202).send({response});
            }
        )
    })
});



module.exports = router;