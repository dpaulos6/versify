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
exports.automateVersioning = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const simple_git_1 = __importDefault(require("simple-git"));
const semver_1 = __importDefault(require("semver"));
// Create a Git instance
const git = (0, simple_git_1.default)();
// Function to read the current version from package.json
const getCurrentVersion = () => {
    const packageJson = JSON.parse(node_fs_1.default.readFileSync('package.json', 'utf8'));
    return packageJson.version;
};
// Function to bump the version based on the type (major, minor, patch)
const bumpVersion = (type) => {
    const currentVersion = getCurrentVersion();
    const newVersion = semver_1.default.inc(currentVersion, type);
    if (!newVersion) {
        throw new Error('Invalid version bump');
    }
    return newVersion;
};
// Function to update the version in package.json
const updateVersionInPackageJson = (newVersion) => {
    const packageJson = JSON.parse(node_fs_1.default.readFileSync('package.json', 'utf8'));
    packageJson.version = newVersion;
    node_fs_1.default.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
};
// Function to commit and tag the new version
const commitAndTagRelease = (newVersion) => __awaiter(void 0, void 0, void 0, function* () {
    yield git.add('./*')
        .commit(`chore: release version ${newVersion}`)
        .tag([newVersion], (err) => {
        if (err) {
            console.error('Error tagging release:', err);
            process.exit(1);
        }
        console.log(`Release ${newVersion} tagged successfully.`);
    });
});
// Main function to automate versioning
const automateVersioning = (bumpType) => __awaiter(void 0, void 0, void 0, function* () {
    const newVersion = bumpVersion(bumpType);
    updateVersionInPackageJson(newVersion);
    yield commitAndTagRelease(newVersion);
    console.log(`Version bumped to ${newVersion} and tagged in Git.`);
});
exports.automateVersioning = automateVersioning;
