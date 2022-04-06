// const { Gio } = imports.gi;

const Config = imports.misc.config;

const [major] = Config.PACKAGE_VERSION.split('.');
const shellVersion = Number.parseInt(major, 10);

class System {
    constructor(filePath) {
        this.usage = 0;
        this.filePath = filePath;

        this.refresh();
    }

    // eslint-disable-next-line class-methods-use-this
    refresh() {
        console.log('Hello');
    }

    // eslint-disable-next-line class-methods-use-this
    loadFileData() {
        throw new Error('Can\'t load contents of stat file');
    }
}

var _sys = new System();
console.log(_sys.usage);
