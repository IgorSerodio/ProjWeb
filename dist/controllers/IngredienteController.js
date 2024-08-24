"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IngredienteService_1 = __importDefault(require("../services/IngredienteService"));
class IngredienteController {
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ingredientes = yield IngredienteService_1.default.getAll();
                res.json(ingredientes);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar ingredientes' });
            }
        });
    }
    getByNome(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                const ingrediente = yield IngredienteService_1.default.getByNome(nome);
                res.json(ingrediente);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar ingrediente pelo nome' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, tipoDeMedida } = req.body;
                const ingrediente = yield IngredienteService_1.default.create({ nome, tipoDeMedida });
                res.status(201).json(ingrediente);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao criar ingrediente' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.params;
                yield IngredienteService_1.default.delete(nome);
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao deletar ingrediente' });
            }
        });
    }
}
exports.default = new IngredienteController();