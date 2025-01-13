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
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const index_1 = require("./index");
commander_1.program
    .command('bump <type>')
    .description('Bump the version (major, minor, patch)')
    .action((type) => __awaiter(void 0, void 0, void 0, function* () {
    if (!['major', 'minor', 'patch'].includes(type)) {
        // biome-ignore lint/suspicious/noConsole: <explanation>
        console.error('Error: Please provide a valid bump type (major, minor, patch).');
        process.exit(1);
    }
    yield (0, index_1.automateVersioning)(type);
}));
commander_1.program.parse(process.argv);
