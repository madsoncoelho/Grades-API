import { db } from '../models/index.js';
import { logger } from '../config/logger.js';

const create = async (req, res) => {
  const { name, subject, type, value, lastModified } = req.body;
  try {
    const grade = new db.model({ name, subject, type, value, lastModified });
    grade.save();

    res.send({ message: 'Grade inserido com sucesso.' });
    logger.info(`POST /grade - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500)
      .send({ message: error.message || 'Algum erro ocorreu ao salvar.' });
    logger.error(`POST /grade - ${JSON.stringify(error.message)}`);
  }
};

const findAll = async (req, res) => {
  const name = req.query.name;

  // condição para o filtro no findAll
  const condition = name
    ? { name: { $regex: new RegExp(name), $options: 'i' } }
    : {};

  try {
    const grades = await db.model.find(condition);
    res.send(grades);

    logger.info(`GET /grade`);
  } catch (error) {
    res.status(500)
      .send({ message: error.message || 'Erro ao listar todos os documentos.' });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await db.model.findById(id);
    res.send(grade);

    logger.info(`GET /grade - ${id}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao buscar grade de id: ' + id });
    logger.error(`GET /grade - ${JSON.stringify(error.message)}`);
  }
};

const update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: 'Informe dados para a atualização.',
    });
  }

  const id = req.params.id;

  try {
    const grade = await db.model.findByIdAndUpdate(id, {...req.body, lastModified: Date.now() },
      { new: true });
    if(!grade) {
      throw new Error('Impossível atualizar grade de id: ' + id);
    }
    res.send(grade);

    logger.info(`PUT /grade - ${id} - ${JSON.stringify(req.body)}`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao atualizar grade de id: ' + id });
    logger.error(`PUT /grade - ${JSON.stringify(error.message)}`);
  }
};

const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const grade = await db.model.findByIdAndRemove(id);

    if (!grade) {
      throw new Error('Impossível remover grade de id: ' + id);
    }
    res.send(grade);

    logger.info(`DELETE /grade - ${id}`);
  } catch (error) {
    res.status(500)
      .send({ message: 'Não foi possível deletar grade de id: ' + id });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

const removeAll = async (req, res) => {
  try {
    const result = await db.model.deleteMany();
    res.send(result);
    
    logger.info(`DELETE /grade`);
  } catch (error) {
    res.status(500).send({ message: 'Erro ao excluir grades.' });
    logger.error(`DELETE /grade - ${JSON.stringify(error.message)}`);
  }
};

export default { create, findAll, findOne, update, remove, removeAll };
